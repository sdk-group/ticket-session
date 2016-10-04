'use strict';

let OrchestrationNode = require('./orchestration-node.js');

class Router extends OrchestrationNode {
	build(data) {
		if (data.constructor === Array) {
			this.addNodes(data);
		}
	}

	render(cursor) {
		if (cursor.isEmpty()) {
			let l = this.getLength(),
				rendered, node, i = -1;
			while (l--) {
				i++;
				node = this.getNode(i);
				rendered = node.render(cursor);
				if (!node.isDone())
					break;
			}
			console.log("ROUTER RENDER", rendered);
			return rendered;
		}
		return this.getNode(cursor.currentLevelPos())
			.render(cursor.incDepth());
	}

	next(cursor) {
		let l = this.getLength(),
			len = l,
			node, nxt, met = false;
		while (l--) {
			node = this.getNode(len - l - 1);
			// console.log("NXT", met, cursor.current(), node);
			if (!node.isDone() && (cursor.isEmpty() || node.contains(cursor.current()) && !node.isLeaf() || met)) {
				nxt = node;
				break;
			}
			met = met || node.contains(cursor.current());
		}
		// console.log("NXT II", nxt);
		if (nxt) {
			if (nxt.isLeaf()) {
				cursor.point(nxt.getContent());
			} else {
				return nxt.next(cursor);
			}
		} else {
			// console.log("ROUTER PARENT", this._parent);
			let parent = this.getParent();
			if (!parent) {
				cursor.clear();
				return null;
			}
			return parent.next(cursor);
		}
	}


	isDone() {
		let l = this.getLength(),
			res = true;
		while (l--) {
			res = res && this.getNode(l)
				.isDone();
		}
		return res;
	}

	contains(item) {
		let l = this.getLength(),
			res = true;
		while (l--) {
			res = res && this.getNode(l)
				.contains(item);
		}
		return res;
	}
}


module.exports = Router;