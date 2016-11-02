'use strict'

let OrchestrationNode = require("./component/orchestration-node.js");
let Factory = require("./component-factory.js");

class GraphAddresser {
	constructor() {
		this.desc = null;
		this.graph = null;
		this.address_table = {};
		this.identifier_table = {};
		this._delimiter = '.';
	}

	// methods
	from(description, entities) {
		// console.log("DESCRIPTION", require('util')
		// 	.inspect(description, {
		// 		depth: null
		// 	}));
		this.desc = description;
		this.build(entities);

	}

	clear() {
		this.desc = null;
		this.graph = null;
		this.address_table = {};
		this.identifier_table = {};
	}

	onUpdate(cb) {
		if (cb.constructor === Function)
			this._updateCB = cb;
	}

	notify(data) {
		console.log("GRAPH ADDRESSER NOTIFIED");
		this._updateCB(data);
	}

	build(entities) {
		let tickets = entities,
			tl = tickets.length,
			tkeymap = {};

		while (tl--) {
			tkeymap[tickets[tl].id] = tl;
		}
		this._resolve(this.desc, entities, tkeymap, null);
		this.graph = Factory.build(this.desc);
		this.graph.attachObserver(this);
	}

	_resolve(curr, entities, keymap, waylong) {
		// console.log(curr);
		if (curr.type === 'idle') {
			let ln = (curr.data.constructor === Array) ? curr.data[0] : curr.data;
			curr.data = entities[keymap[ln]] || null;
			this.identifier_table[ln] = waylong || '~';
			this.address_table[waylong || '~'] = curr.data;
		} else {
			// console.log("CURRDATA", curr.data);
			let l = curr.data.length,
				newway;
			while (l--) {
				newway = waylong === null ? `${l}` : `${waylong}${this._delimiter}${l}`;
				this._resolve(curr.data[l], entities, keymap, newway);
			}
		}
	}

	addressDelimiter() {
		return this._delimiter;
	}

	hasLeaf(addr) {
		return !!this.address_table[this.identifier_table[addr]];
	}

	getLeaf(addr) {
		return this.address_table[this.identifier_table[addr]];
	}

	isInactive() {
		let keys = Object.keys(this.address_table),
			l = keys.length,
			res = true,
			entity;
		// console.log("ADDRESSER", this.address_table);
		while (l--) {
			entity = this.address_table[keys[l]];
			res = res && entity.isInactive();
		}
		return res;
	}

	getAddress(addr) {
		return this.identifier_table[addr];
	}

	render(cursor) {
		return this.graph.render(cursor);
	}

	next(cursor, criteria) {
		return this.graph.next(cursor, criteria);
	}

	entities(fn) {
		let keys = Object.keys(this.address_table),
			l = keys.length,
			res = [],
			entity;
		while (l--) {
			entity = this.address_table[keys[l]];
			if (fn) {
				if (fn(entity))
					res.push(entity);
			} else {
				res.push(entity);
			}
		}
		return res;

	}

	updateCallback() {
		return this._updateCB;
	}

	to(type = 'picker', data = []) {
		let desc = this.desc;
		if (desc.type == type)
			return this;
		if (type == 'idle')
			throw new Error("Cannot transform to leaf what's not a leaf.");

		this.desc = {
			type: type,
			data: [this.desc]
		};

		this.graph.detachObserver(this);
		this.graph = Factory.build({
			type: type,
			data: [this.graph]
		});
		this.graph.attachObserver(this);
	}

	splitBy(splitter) {
		let Model = this.constructor,
			entities = this.entities();
		let lgraph = new Model(),
			rgraph = new Model();
		let lbranch = {},
			rbranch = {};
		this._split(this.desc, splitter, lbranch, rbranch);
		lgraph.from(lbranch, entities);
		lgraph.onUpdate(this.updateCallback());
		rgraph.from(rbranch, entities);
		rgraph.onUpdate(this.updateCallback());
		return [lgraph, rgraph];
	}

	splitDescriptionBy(splitter) {
		if (!splitter || !(splitter.constructor === Function))
			return [];
		let lbranch = {},
			rbranch = {};
		this._split(this.desc, splitter, lbranch, rbranch);
		return [lbranch, rbranch];
	}

	splitBranchBy(desc, splitter) {
		if (!splitter || !(splitter.constructor === Function))
			return [];
		let lbranch = {},
			rbranch = {};
		this._split(desc, splitter, lbranch, rbranch);
		return [lbranch, rbranch];
	}

	_split(curr, splitter, curr_left, curr_right) {
		if (curr.type === 'idle') {
			if (splitter(curr.data)) {
				curr_left.type = curr.type;
				curr_left.data = curr.data.id;
			} else {
				curr_right.type = curr.type;
				curr_right.data = curr.data.id;
			}
		} else {
			// console.log("CURRDATA", curr.data);
			let l = curr.data.length,
				i = -1;
			curr_left.type = curr.type;
			curr_left.data = [{}];
			curr_right.type = curr.type;
			curr_right.data = [{}];
			let empty = true;
			while (l--) {
				i++;
				empty = !curr_left.data[curr_left.data.length - 1].type;
				if (!empty) {
					curr_left.data.push({});
				}
				empty = !curr_right.data[curr_right.data.length - 1].type;
				if (!empty) {
					curr_right.data.push({});
				}
				this._split(curr.data[i], splitter, curr_left.data[curr_left.data.length - 1], curr_right.data[curr_right.data.length - 1]);
			}
			empty = !curr_left.data[curr_left.data.length - 1].type;
			empty && curr_left.data.pop();
			empty = !curr_right.data[curr_right.data.length - 1].type;
			empty && curr_right.data.pop();
		}
	}

	description() {
		return this.desc;
	}
}

module.exports = GraphAddresser;