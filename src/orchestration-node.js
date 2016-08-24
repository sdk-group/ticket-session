'use strict'


class OrchestrationNode {
	constructor(description = {}) {
		//for (){}
		this.content = Object.create(null);
	}

	// methods
	addNode(node, addr) {
		if (node.constructor === OrchestrationNode) {
			this.content[addr] = node;
		}
	}

	addNodes(nodes) {
		let node_arr = nodes;
		if (nodes.constructor === OrchestrationNode) {
			node_arr = [nodes];
		}

		if (node_arr.constructor === Array) {
			let l = node_arr.length;
			let len = node_arr.length;
			while (l--) {
				this.addNode(node_arr[len - l]);
			}
		}
	}

	render(cursor) {
		throw new Error("%s::%s is not implemented.", this.constructor.name, 'render');
	}
}

module.exports = OrchestrationNode;