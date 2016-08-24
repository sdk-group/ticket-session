'use strict'
let Session = require("../build/session.js");


describe('session', function () {
	let session;

	it('#constructor', function () {
		session = new Session();
		expect(session)
			.to.be.an.instanceOf(Session);
	});
});