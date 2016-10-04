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


describe('session', function () {
	this.slow(0);
	this.timeout(3000);

	let session, tickets, desc;


	beforeEach(function () {
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

	describe.only('router session', function () {
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

		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[2])
		});
		it('should next session with pointer 0-0', function () {
			session.point('ticket-test--2');
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			tickets[5].state = 'closed';
			let r = session.next();
			expect(r)
				.to.equal(null)
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--2');
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[2].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});

		it('should next session with pointer !', function () {
			session.point('ticket-test--1');
			tickets[2].state = 'closed';
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[5])
		});
	});

	describe('picker session', function () {

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
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[2])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--2');
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--2');
			tickets[3].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[4])
		});
		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[2].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[3])
		});

		it('should next session with pointer', function () {
			session.point('ticket-test--1');
			tickets[2].state = 'closed';
			tickets[3].state = 'closed';
			tickets[4].state = 'closed';
			let r = session.next();
			expect(r)
				.to.deep.equal(tickets[5])
		});
	});
});