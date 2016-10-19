'use strict'
let Session = require("../build/session.js");

class Ticket {
	constructor(data) {
		this.id = data.id;
		this.state = data.state;
	}
	identifier() {
		return this.id;
	}
	isActive() {
		return this.state == 'processing' || this.state == 'called'
	}
	isProcessed() {
		return this.state != 'registered' &&
			this.state != 'booked' &&
			this.state != 'postponed';
	}
	setContainer(cnt) {
		this._container = cnt;
	}
	isInactive() {
		let state = this.state;
		return state == 'closed' || state == 'expired';
	}

	getContainer() {
		return this._container;
	}

}

class TicketSession {
	static fields() {
		return ["description", "uses", "dedicated_date", "organization", "code", "user_info"];
	}

	getDescription() {
		return _.cloneDeep(this.properties.description);
	}

	fillThis(dataset) {
		let id = this.id = 'ticket-session-test';
		this.properties = dataset || {};
		this.properties = _.pick(this.properties, TicketSession.fields());
		this.properties['@type'] = this.type = 'TicketSession';

		return this;
	}
}


describe.only('session', function () {
	this.slow(0);
	this.timeout(3000);


	describe('router session', function () {
		let session, tickets, desc;
		beforeEach(function () {
			desc = {
				uses: ['ticket-test--1', 'ticket-test--2', 'ticket-test--3'],
				description: {
					type: 'router',
					data: [{
							type: 'idle',
							data: 'ticket-test--1'
							}, {
							type: 'picker',
							data: [{
								type: 'idle',
								data: 'ticket-test--2'
					}, {
								type: 'idle',
								data: 'ticket-test--3'
					}, {
								type: 'idle',
								data: 'ticket-test--4'
					}]
				},
						{
							type: 'idle',
							data: 'ticket-test--5'
					}]
				}
			};
			let t = new TicketSession();
			t.fillThis(_.cloneDeep(desc));

			tickets = _.map(Array(20), (t, i) => new Ticket({
				id: 'ticket-test--' + i,
				state: 'registered'
			}));

			session = Session(t, tickets);
		})
		it('#constructor', function () {
			desc = {
				uses: ['ticket-test--1', 'ticket-test--2', 'ticket-test--3'],
				description: {
					type: 'router',
					data: [{
						type: 'idle',
						data: 'ticket-test--1'
				}, {
						type: 'picker',
						data: [{
							type: 'idle',
							data: 'ticket-test--2'
					}, {
							type: 'idle',
							data: 'ticket-test--3'
					}]
				}]
				}
			};

			let t = new TicketSession();
			t.fillThis(_.cloneDeep(desc));
			session = Session(t, tickets);
			expect(session.constructor.name)
				.to.equal('Session');
		});


		// it('ouch', function () {
		// 	console.log("____________________________________________________________");
		// 	let d = {
		// 		"type": "router",
		// 		"data": [
		// 			{
		// 				"type": "router",
		// 				"data": [
		// 					{
		// 						"type": "picker",
		// 						"data": [
		// 							{
		// 								"type": "idle",
		// 								"data": "ticket-test--1"
		// 							}]
		// 					}, {
		// 						"type": "picker",
		// 						"data": [
		// 							{
		// 								"type": "idle",
		// 								"data": "ticket-test--2"
		// 							}]
		// 					}]
		// 			}, {
		// 				"type": "router",
		// 				"data": [
		// 					{
		// 						"type": "picker",
		// 						"data": []
		// 					}, {
		// 						"type": "picker",
		// 						"data": []
		// 					}]
		// 			}]
		// 	}

		// 	let t = new TicketSession();
		// 	t.fillThis(_.cloneDeep(d));
		// 	session = Session(t, tickets);
		// 	expect(session.constructor.name)
		// 		.to.equal('Session');
		// });

		it('should set session cursor by str', function () {
			session.point('ticket-test--2');
			tickets[2].state = 'called';
			expect(session.cursor.current())
				.to.eql(tickets[2])
		});

		it('should set session cursor by obj', function () {
			session.point(tickets[2]);
			tickets[2].state = 'called';
			expect(session.cursor.current())
				.to.eql(tickets[2])
		});


		it('should render session', function () {
			session.point(tickets[2]);
			tickets[2].state = 'called';
			let r = session.render();
			expect(r)
				.to.eql(tickets[2]);
		});


		it('should render no-pointer session', function () {
			let r = session.render();
			expect(r)
				.to.deep.equal(tickets[1])
		});

		it('should render no-pointer session  with first closed', function () {
			tickets[1].state = 'closed';
			let r = session.render();
			expect(r)
				.to.deep.equal([tickets[4], tickets[3], tickets[2]])
		});

		it('should next session', function () {
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[1])
		});


		it('should next session with first closed', function () {
			tickets[1].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[2])
		});

		it('should next session with pointer !!!!', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			let r = session.next(() => true);
			expect(r)
				.to.deep.equal(tickets[2])
		});
		it('should next session with pointer 0-0', function () {
			session.point('ticket-test--2');
			tickets[2].state = 'called';
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			tickets[5].state = 'closed';
			let r = session.next();
			expect(r)
				.to.equal(null)
		});
		it('should next session with pointer !!!', function () {
			session.point('ticket-test--2');
			tickets[2].state = 'called';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});
		it('should next session with pointer !!', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			tickets[2].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});

		it('should next session with pointer !', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			tickets[2].state = 'closed';
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(null)
		});
	});

	describe('picker session', function () {
		let session, tickets, desc;
		beforeEach(function () {
			desc = {
				uses: ['ticket-test--1', 'ticket-test--2', 'ticket-test--3', 'ticket-test--4', 'ticket-test--5'],
				description: {
					type: 'picker',
					data: [{
							type: 'idle',
							data: 'ticket-test--1'
				}, {
							type: 'picker',
							data: [{
								type: 'idle',
								data: 'ticket-test--2'
					}, {
								type: 'idle',
								data: 'ticket-test--3'
					}, {
								type: 'idle',
								data: 'ticket-test--4'
					}]
				},
						{
							type: 'idle',
							data: 'ticket-test--5'
					}]
				}
			};
			let t = new TicketSession();
			t.fillThis(_.cloneDeep(desc));
			tickets = _.map(Array(20), (t, i) => new Ticket({
				id: 'ticket-test--' + i,
				state: 'registered'
			}));

			session = Session(t, tickets);
		})
		it('#constructor', function () {
			desc = {
				uses: ['ticket-test--1', 'ticket-test--2', 'ticket-test--3'],
				description: {
					type: 'picker',
					data: [{
						type: 'idle',
						data: 'ticket-test--1'
				}, {
						type: 'picker',
						data: [{
							type: 'idle',
							data: 'ticket-test--2'
					}, {
							type: 'idle',
							data: 'ticket-test--3'
					}]
				}]
				}
			};
			let t = new TicketSession();
			t.fillThis(_.cloneDeep(desc));
			session = Session(t, tickets);
			expect(session.constructor.name)
				.to.equal('Session');
		});


		it('should set session cursor by str', function () {
			session.point('ticket-test--2');
			expect(session.cursor.current())
				.to.eql(tickets[2])
		});

		it('should set session cursor by obj', function () {
			session.point(tickets[2]);
			expect(session.cursor.current())
				.to.eql(tickets[2])
		});


		it('should render session', function () {
			session.point(tickets[2]);
			let r = session.render();
		});


		it('should render no-pointer session', function () {
			let r = session.render();
			expect(r)
				.to.deep.equal([tickets[5], tickets[4], tickets[3], tickets[2], tickets[1]])
		});

		it('should next session', function () {
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[1])
		});


		it('should next session with first closed', function () {
			tickets[1].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[2])
		});

		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[2])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--2');
			tickets[2].state = 'called';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[1])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--2');
			tickets[2].state = 'called';
			tickets[3].state = 'closed';
			tickets[1].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[4])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			tickets[2].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});

		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[1].state = 'called';
			tickets[2].state = 'closed';
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[5])
		});
	});
});