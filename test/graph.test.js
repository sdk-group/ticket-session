'use strict';

let Factory = require("../build/component-factory.js");
let Graph = require("../build/graph-addresser.js")

describe('GRAPH', function () {
	let graph, table, nodes = [];
	class Ticket {
		constructor(data) {
			this.id = data.id;
			this.state = data.state;
		}
		identify() {
			return this.id;
		}

		get(field) {
			return this[field];
		}
	}
	let tickets;

	beforeEach(function () {
		tickets = _.map(Array(20), (t, i) => new Ticket({
			id: 'ticket-test--' + i,
			state: (Math.random() > 0.5) && 'registered' || "postponed"
		}));
		// nodes.push(Factory.build('idle', tickets[0]));
		// nodes.push(Factory.build('picker', tickets.slice(1, 5)));
		// nodes.push(Factory.build('picker', tickets.slice(5, 9)));
		// nodes.push(Factory.build('pointer', [tickets[9]]));
		// nodes.push(tickets[10]);
		// nodes.push(tickets[11]);
		graph = new Graph();
		let description = {
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
		graph.from(description, tickets)


		console.log(require('util')
			.inspect(graph, {
				depth: null
			}));

		let res = graph.splitDescriptionBy(function (t) {
			return t.get("state") == 'registered'
		})

		console.log(require('util')
			.inspect(res, {
				depth: null
			}));

	});

	it('should do what...', function () {

	});
});