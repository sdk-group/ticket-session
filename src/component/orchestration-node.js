'use strict'

const _proto_signum = Symbol('OrchestrationNode');

class OrchestrationNode {
	constructor() {
		this._proto_signum = _proto_signum;
	}

	static isComponent(obj) {
		return obj._proto_signum === _proto_signum;
	}

	isLeaf() {
		return false;
	}

	next(cursor) {
		throw new Error(`${ this.constructor.name}::${"next"} is not implemented.`);
	}

	find(addr) {
		return this.content[addr];
	}

	build(cursor) {
		throw new Error(`${ this.constructor.name}::${"build"} is not implemented.`);
	}

	render(cursor) {
		throw new Error(`${ this.constructor.name}::${"render"} is not implemented.`);
	}
}

module.exports = OrchestrationNode;