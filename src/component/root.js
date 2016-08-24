'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Root extends OrchestrationNode {
	// methods
	build(data) {
		console.log(data);
	}

	addNode(node, addr) {}
}


module.exports = Root;