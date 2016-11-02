'use strict'

const _proto_signum = Symbol('OrchestrationNode');

class OrchestrationNode {
	//init
	constructor() {
		this._proto_signum = _proto_signum;
		this._content = [];
		this._observers = [];
	}


	attachObserver(observer) {
		this._observers.push(observer);
	}

	detachObserver(observer) {
		let new_arr = [],
			l = this._observers.length;
		while (l--) {
			if (this._observers[l] !== observer)
				new_arr.push(this._observers[l]);
		}
		this._observers = new_arr;
	}

	setParent(parent = null, attach = false) {
		this._parent = parent;
		if (parent && attach) {
			this.attachObserver(parent);
		}
	}
	getParent() {
		return this._parent;
	}


	notify(data) {
		console.log(this.constructor.name + " ON NOTIFIED");
		let l = this._observers.length;
		while (l--) {
			this._observers[l].notify(data);
		}
	}

	addNode(node, addr = null) {
		if (this.constructor.isComponent(node)) {
			if (addr === null) {
				this._content.push(node);
			} else {
				this._content[addr] = (node);
			}
			node.setParent(this, true);
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

	getLength() {
		return this._content.length;
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

	next(cursor) {
		throw new Error(`${ this.constructor.name}::${"next"} is not implemented.`);
	}


	render(cursor) {
		throw new Error(`${ this.constructor.name}::${"render"} is not implemented.`);
	}

}

module.exports = OrchestrationNode;