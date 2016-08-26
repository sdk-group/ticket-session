'use strict'

let Cursor = require("./cursor.js");

class Session {
	constructor() {
		this.cursor = new Cursor(this.graph);
	}

	// methods

	createSession() {

	}


}

module.exports = Session;