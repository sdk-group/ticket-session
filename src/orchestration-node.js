'use strict'


class OrchestrationNode {
	constructor(parent = null) {
		this.parent = parent;
		this.content = [];
	}

	// methods

	addNode(node) {
		if (node.constructor === OrchestrationNode) {
			this.content.push(node);
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