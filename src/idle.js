'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Idle extends OrchestrationNode {
	constructor(entity) {
		this.content = entity;
	}

	// methods
	render(cursor) {
		if (cursor.identity(this.content))
			return this.content;
	}
}


module.exports = Idle;