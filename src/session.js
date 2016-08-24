'use strict'

let Cursor = require("./cursor.js");
let OrchestrationNode = require("./orchestration-node.js");

class Session {
	constructor(graph_description = {}) {
		this.graph = new OrchestrationNode(graph_description);
		this.cursor = new Cursor(this.graph);
	}

	// methods


}

module.exports = Session;