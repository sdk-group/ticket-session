'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Picker extends OrchestrationNode {
	// constructor() {
	// 	super();
	// 	this.content = [];
	// 	this.address_table = {};
	// }
	// methods
	build(data) {
		if (data.constructor === Array) {
			this.addNodes(data);
		}
	}
}


module.exports = Picker;