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
	}
	let tickets;

	beforeEach(function () {
		tickets = _.map(Array(20), (t, i) => new Ticket({
			id: 'ticket-test--' + i,
			state: 'registered'
		}));
		nodes.push(Factory.build('idle', tickets[0]));
		nodes.push(Factory.build('picker', tickets.slice(1, 5)));
		nodes.push(Factory.build('picker', tickets.slice(5, 9)));
		// nodes.push(Factory.build('pointer', [tickets[9]]));
		nodes.push(tickets[10]);
		nodes.push(tickets[11]);
		graph = new Graph();

		graph.build(nodes[1])
		graph.addNodes(nodes[2])
		graph.addNodes(nodes[0], '4')
		graph.addNodes(nodes[10], '4')

		console.log(require('util')
			.inspect(graph, {
				depth: null
			}));
	});

	it('should do what...', function () {

	});
});