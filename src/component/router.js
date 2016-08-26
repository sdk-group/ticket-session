'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Router extends OrchestrationNode {
	constructor() {
		super();
		this.content = [];
	}

	// methods
	build(data) {
		if (data.constructor === Array) {
			let l = data.length,
				len = l,
				i;
			while (l--) {
				i = len - l - 1;
				this.addNode(data[i], i);
			}
		}
	}
}


module.exports = Router;