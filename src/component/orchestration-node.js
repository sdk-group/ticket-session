'use strict'

const _proto_signum = Symbol('OrchestrationNode');

class OrchestrationNode {
	//init
	constructor() {
		this._proto_signum = _proto_signum;
		this._content = [];
	}

	setParent(parent = null) {
		this._parent = parent;
	}

	addNode(node, addr = null) {
		if (this.constructor.isComponent(node)) {
			if (addr === null) {
				this._content.push(node);
			} else {
				this._content[addr] = (node);
			}
			node.setParent(this);
		}
	}
	addNodes(nodes) {
		if (this.constructor.isComponent(nodes)) {
			this.addNode(nodes);
		} else
		if (nodes && nodes.constructor === Array) {
			let l = nodes.length,
				len = l;
			while (l--) {
				this.addNode(nodes[len - l - 1]);
			}
		}
	}
	getNode(addr) {
		return this._content[addr];
	}

	getContent() {
		return this._content;
	}

	build() {
		throw new Error(`${ this.constructor.name}::${"build"} is not implemented.`);
	}

	//check
	static isComponent(obj) {
		return obj && obj._proto_signum === _proto_signum;
	}

	isLeaf() {
		return false;
	}

	//methods
	next(cursor) {
		throw new Error(`${ this.constructor.name}::${"next"} is not implemented.`);
	}


	render(cursor) {
		throw new Error(`${ this.constructor.name}::${"render"} is not implemented.`);
	}
}

module.exports = OrchestrationNode;