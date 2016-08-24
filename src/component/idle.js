'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Idle extends OrchestrationNode {
	// methods
	build(entity) {
		this.content = entity;
	}

	isLeaf() {
		return true;
	}

	render(cursor) {

	}
}


module.exports = Idle;