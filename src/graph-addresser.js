'use strict'

let OrchestrationNode = require("./component/orchestration-node.js");
let Factory = require("./component-factory.js");

class GraphAddresser {
	constructor() {
		this.desc = null;
		this.graph = {};
		this.address_table = {};
		this.identifier_table = {};
		this._delimiter = '.';
	}

	// methods
	from(description, entities) {
		this.desc = description;
		this.build(entities);

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
		if (curr.type === 'idle') {
			let ln = (curr.data.constructor === Array) ? curr.data[0] : curr.data;
			curr.data = entities[keymap[ln]] || null;
			this.identifier_table[ln] = waylong;
			this.address_table[waylong] = curr.data;
		} else {
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

	getAddress(addr) {
		return this.identifier_table[addr];
	}

	render(cursor) {
		return this.graph.render(cursor);
	}

	next(cursor) {
		return this.graph.next(cursor);
	}
}

module.exports = GraphAddresser;