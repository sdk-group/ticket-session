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

	extract() {
		return this._modelDoc;
	}


	identifier() {
		return this._modelDoc.id;
	}

	code() {
		return this._modelDoc.properties.code;
	}

	getSection() {
		return this._modelDoc.properties.organization;
	}


	render() {
		return this.graph.render(this.cursor);
	}

	find(id) {
		console.log(this.graph);
		return this.graph.getLeaf(id);
	}

	point(addr) {
		if (addr === null || addr === undefined)
			return;

		this.cursor.point(addr);
	}

	current() {
		return this.cursor.current();
	}

	next() {
		let cnt = this.cursor.current();
		if (!cnt) {
			this.graph.next(this.cursor);
		} else {
			cnt = cnt.getContainer();
			cnt.next(this.cursor);
		}
		return this.cursor.current();
	}


	onUpdate(cb) {
		this.graph.onUpdate(cb);
	}


}

module.exports = function (desc, linkdata) {
	return new Session(desc, linkdata);
}