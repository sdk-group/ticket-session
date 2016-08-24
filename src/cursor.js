'use strict'

class Cursor {
	constructor(graph) {
		this.root = graph;
		this.curr_path = null;
		this.curr = null;
	}

	current() {
		return this.curr || this.graph.find(this.curr_path);
	}
}

module.exports = Cursor;