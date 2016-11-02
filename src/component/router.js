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

	next(cursor, criteria) {
		// console.log("ROUTER");
		let l = this.getLength(),
			len = l,
			node, nxt;
		while (l--) {
			node = this.getNode(len - l - 1);
			// console.log("NXT", cursor.current(), node, node.contains(cursor.current()));
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
		}
		// console.log("ROUTER CURR", cursor.current());
		// console.log("ROUTER NXT ", nxt);
		if (nxt && nxt.canNext(cursor, criteria)) {
			return nxt.next(cursor, criteria);
		} else {
			cursor.clear();
			return null;
		}
	}

	// next(cursor, criteria, prev = false) {
	// 	console.log("ROUTER", prev);
	// 	let l = this.getLength(),
	// 		len = l,
	// 		node, nxt;
	// 	if (!prev || prev.contains(cursor.current())) {
	// 		while (l--) {
	// 			node = this.getNode(len - l - 1);
	// 			// console.log("NXT", met, cursor.current(), node);
	// 			if (!cursor.isEmpty()) {
	// 				if (node.contains(cursor.current())) {
	// 					if (node.isDone()) {
	// 						nxt = this.getNode(len - l);
	// 						break;
	// 					} else {
	// 						nxt = node;
	// 						break;
	// 					}
	// 				}
	// 			} else {
	// 				if (!node.isDone()) {
	// 					nxt = node;
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	console.log("ROUTER CURR", cursor.current());
	// 	console.log("ROUTER NXT ", nxt);
	// 	if (nxt && !nxt.isDone()) {
	// 		if (nxt.isLeaf()) {
	// 			cursor.point(nxt.getContent());
	// 		} else {
	// 			return nxt.next(cursor, criteria);
	// 		}
	// 	} else {
	// 		// console.log("ROUTER PARENT", this._parent);
	// 		// let parent = this.getParent();
	// 		// if (!parent) {
	// 		cursor.clear();
	// 		return null;
	// 		// }
	// 		// return parent.next(cursor, criteria, this);
	// 	}
	// }


	canNext(cursor, criteria) {
		let l = this.getLength(),
			len = l,
			node, nxt;
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
		}

		return nxt ? nxt.canNext(cursor, criteria) : false;
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
			res = false;
		while (l--) {
			res = res || this.getNode(l)
				.contains(item);
		}
		return res;
	}
}


module.exports = Router;