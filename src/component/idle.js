'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Idle extends OrchestrationNode {
	// methods
	build(entity) {
		this._content = entity;
	}

	getEntity() {
		return this._content;
	}

	isLeaf() {
		return true;
	}

	render(cursor) {

	}
}


module.exports = Idle;