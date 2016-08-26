'use strict'
let Session = require("../build/session.js");

class Ticket {
	constructor(data) {
		this.id = data.id;
		this.state = data.state;
	}
	identify() {
		return this.id;
	}
}

describe.only('session', function () {
	let session, tickets;

	it('#constructor', function () {
		session = new Session();
		expect(session)
			.to.be.an.instanceOf(Session);
	});

	beforeEach(function () {
		session = new Session();
		tickets = _.map(Array(20), (t, i) => new Ticket({
			id: 'ticket-test--' + i,
			state: 'registered'
		}));
	})

	describe('picker session', function () {
		it('should create session', function (done) {
			session.initialize();
		});
		it('should assemble session', function () {
			let child = session.createChild('picker', tickets.slice(0, 5));
			session.append(child);
			let child2 = session.createChild('picker', tickets.slice(5, 10));
			child.append(child2);
		});

	});
});