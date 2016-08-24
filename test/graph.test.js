'use strict';

let Factory = require("../build/component-factory.js");

describe.only('GRAPH', function () {
	let graph, nodes = [];
	class Ticket {
		constructor(data) {
			this.id = data.id;
			this.state = data.state;
		}
	}
	let tickets;

	beforeEach(function () {
		tickets = _.map(Array(20), (t, i) => new Ticket({
			id: 'ticket-test--' + i,
			state: 'registered'
		}));
		nodes.push(Factory.build('idle', tickets[0]));
		nodes.push(Factory.build('picker', tickets.slice(1, 5)));
		nodes.push(Factory.build('router', tickets.slice(5, 9)));
		nodes.push(Factory.build('pointer', [tickets[9]]));
		nodes.push(tickets[10]);
		nodes.push(tickets[11]);
		graph = Factory.build('root', nodes);

		console.log(require('util')
			.inspect(nodes, {
				depth: null
			}));

		console.log(require('util')
			.inspect(graph, {
				depth: null
			}));
	});

	it('should do what...', function () {

	});
});