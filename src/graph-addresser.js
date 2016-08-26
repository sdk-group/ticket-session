'use strict'

let OrchestrationNode = require("./component/orchestration-node.js");

class GraphAddresser {
	constructor() {
		this.address_table = {};
		this.identifier_table = {};
	}

	// methods
	build(root) {
		this._root = root;
	}

	addNodes(nodes, addr = null) {
		if (addr === null) {
			this._root.addNodes(nodes);
		} else {
			let addr_parts = addr.split('.'),
				l = addr_parts.length,
				len = l,
				curr = this._root;
			while (l--) {
				curr = curr.getNode(addr_parts[len - l - 1]);
			}
			curr.addNodes(nodes);
		}
	}


}

module.exports = GraphAddresser;