'use strict'

class Cursor {
	constructor(graph) {
		this.graph = graph;
		this.pos = null;
		this.addr = null;
		this.addr_arr = null;
		this.curr = null;

		this._depth = 0;
	}

	current() {
		return this.curr;
	}

	point(addr) {
		if (addr === null)
			this.clear();

		let pos = this.identifyEntity(addr) || addr;
		if (this.graph.hasLeaf(pos)) {
			this.pos = pos;
			this.curr = this.graph.getLeaf(pos);
			this.addr = this.graph.getAddress(pos);
			this.addr_arr = this.addr.split(this.graph.addressDelimiter());
			this.resetDepth();
		}
		return this;
	}

	isEmpty() {
		return this.pos === null;
	}

	incDepth() {
		this._depth++;
		return this;
	}

	resetDepth() {
		this._depth = 0;
		return this;
	}

	currentLevelPos() {
		return this.addr_arr[this._depth];
	}

	clear() {
		this.pos = this.curr = this.addr_arr = this.addr = null;
		this.resetDepth();
		return this;
	}

	isSame(entity) {
		return entity === this.curr;
	}

	identifyEntity(entity) {
		return (entity.identifier && entity.identifier.constructor === Function) && entity.identifier() || entity.id;
	}

}
module.exports = Cursor;