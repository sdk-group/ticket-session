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
			// console.log("ROUTER RENDER", rendered);
			return rendered;
		}
		return this.getNode(cursor.currentLevelPos())
			.render(cursor.incDepth());
	}

	next(cursor, criteria, downtree = true) {
		// console.log("ROUTER", downtree);
		let l = this.getLength(),
			len = l,
			node, nxt;
		// if (!downtree) {
		// 	cursor.clear();
		// 	return null;
		// }
		while (l--) {
			node = this.getNode(len - l - 1);
			// console.log("NXT", met, cursor.current(), node);
			if (!cursor.isEmpty()) {
				if (node.contains(cursor.current())) {
					if (node.isDone()) {
						nxt = this.getNode(len - l);
						break;
					} else {
						nxt = node;
						break;
					}
				}
			} else {
				if (!node.isDone()) {
					nxt = node;
					break;
				}
			}
			// if (!node.isDone() && (cursor.isEmpty() || node.contains(cursor.current()) && !node.isLeaf() || met)) {
			// 	nxt = node;
			// 	break;
			// }
			// met = met || node.contains(cursor.current());
		}
		// console.log("ROUTER CURR", cursor.current());
		// console.log("ROUTER NXT ", nxt, nxt && nxt.isApplyable(criteria), !nxt.isDone());
		if (nxt && nxt.isApplyable(criteria) && !nxt.isDone()) {
			if (nxt.isLeaf()) {
				cursor.point(nxt.getContent());
			} else {
				return nxt.next(cursor, criteria);
			}
		} else {
			// console.log("ROUTER PARENT", this._parent);
			let parent = this.getParent();
			if (!parent) {
				cursor.clear();
				return null;
			}
			return parent.next(cursor, criteria, false);
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