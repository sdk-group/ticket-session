'use strict'

let Cursor = require("./cursor.js");
let Graph = require("../build/graph-addresser.js")

class Session {
	constructor(desc, linkdata) {
		this.graph = new Graph();
		this.cursor = new Cursor(this.graph);
		this.from(desc, linkdata);
	}

	// methods

	from(desc, linkdata) {
		this.graph.clear();
		this.cursor.clear();
		this.graph.from(desc.getDescription(), linkdata);
		this._modelDoc = desc;

		let uses = desc.properties.uses,
			l = uses.length,
			addr;
		while (l--) {
			if (this.graph.hasLeaf(uses[l]) &&
				this.graph.getLeaf(uses[l])
				.isActive())
				addr = uses[l];
		}
		this.point(addr);

		return this;
	}

	virtualRoute(virtual_entity) {
		let desc = this._modelDoc.get("description");
		let entities = this.graph.entities();
		entities.push(virtual_entity);
		if (desc.type != 'picker') {
			desc = {
				type: 'picker',
				data: [{
					type: 'idle',
					data: virtual_entity.id
				}, _.cloneDeep(desc)]
			}
		} else {
			desc.data.unshift({
				type: 'idle',
				data: virtual_entity.id
			});
		}
		console.log("DESCRIPTION", require('util')
			.inspect(desc, {

				depth: null
			}));
		this._modelDoc.set("description", desc);
		let uses = this._modelDoc.get("uses");
		uses.push(virtual_entity.id);
		this._modelDoc.set("uses", uses);
		this.from(this.extract(), entities);
	}

	splittedRoute(splitter) {
		let description = this._modelDoc.get("description");
		if (description.type == 'idle')
			return;
		let entities = this.graph.entities();
		let is_directed = this._modelDoc.get("directed");
		let desc;

		if (!is_directed) {
			let branches = this.graph.splitDescriptionBy(splitter);
			desc = {
				type: 'router',
				data: branches
			};
			this._modelDoc.set("directed", true);
		} else {
			function customizer(objValue, srcValue) {
				if (_.isArray(objValue)) {
					return objValue.concat(srcValue);
				}
			}
			let buff = {};
			_.mergeWith(buff,
				this.graph.description()
				.data[0],
				this.graph.description()
				.data[1], customizer);
			console.log("MERGED", buff);
			let branches = this.graph.splitBranchBy(buff, splitter);
			desc = {
				type: 'router',
				data: branches
			};
		}
		this._modelDoc.set("description", desc);
		this.from(this.extract(), entities);
	}

	extract() {
		return this._modelDoc;
	}


	identifier() {
		return this._modelDoc.id;
	}

	code() {
		return this._modelDoc.get("code");
	}

	dedication() {
		return this._modelDoc.get("dedicated_date");
	}

	attachment() {
		return this._modelDoc.get("organization");
	}


	render() {
		return this.graph.render(this.cursor);
	}

	find(id) {
		return this.graph.getLeaf(id);
	}

	point(addr) {
		if (addr === null || addr === undefined)
			return;

		this.cursor.point(addr);
	}

	//@FIXIT this is faster than bind, but ugly as shit
	_pointIfActiveCallback(cursor, cb) {
		return function (entity) {
			cursor.clear();
			if (entity.isActive())
				cursor.point(entity);
			cb(entity);
		}
	}

	current() {
		return this.cursor.current();
	}

	_truth() {
		return true;
	}

	next(criteria) {
		criteria = criteria || this._truth;
		let cnt = this.cursor.current();
		if (!cnt) {
			this.graph.next(this.cursor, criteria);
		} else {
			cnt = cnt.getContainer();
			cnt.next(this.cursor, criteria);
		}
		return this.cursor.current();
	}

	isInactive() {
		return this.graph.isInactive();
	}

	onUpdate(cb) {
		this.graph.onUpdate(this._pointIfActiveCallback(this.cursor, cb));
	}

	tickets(fn) {
		return this.graph.entities(fn);
	}

	_activityTest(entity) {
		return entity && !entity.isInactive();
	}

	activeTickets() {
		return this.graph.entities(this._activityTest);
	}
}

module.exports = function (desc, linkdata) {
	return new Session(desc, linkdata);
}