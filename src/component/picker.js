'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Picker extends OrchestrationNode {
	build(data) {
		if (data.constructor === Array) {
			this.addNodes(data);
		}
	}

	render(cursor) {
		if (cursor.isEmpty()) {
			let l = this.getLength(),
				res = [],
				rendered;
			while (l--) {
				rendered = this.getNode(l)
					.render(cursor);
				if (rendered && rendered.constructor === Array)
					res = res.concat(rendered);
				else
					res.push(rendered);
			}
			return res;
		}
		return this.getNode(cursor.currentLevelPos())
			.render(cursor.incDepth());
	}

	// isApplyable(fn) {
	// 	let l = this.getLength(),
	// 		res = true,
	// 		node;
	// 	while (l--) {
	// 		node = this.getNode(l);
	// 		res = res && node.isApplyable(fn);
	// 	}
	// 	return res;
	// }
	canNext(cursor, criteria) {
		let l = this.getLength(),
			len = l,
			node, res = false;
		while (l--) {
			node = this.getNode(len - l - 1);
			res = res || node.canNext(cursor, criteria);
		}
		return res;
	}


	next(cursor, criteria) {
			// console.log("PICKER");
			let l = this.getLength(),
				len = l,
				node, nxt;
			while (l--) {
				node = this.getNode(len - l - 1);
				// console.log(!node.isDone(), cursor.current() !== node.getContent(), node.canNext(cursor, criteria), node);
				if (node.canNext(cursor, criteria)) {
					nxt = node;
					break;
				}
			}
			// console.log("PICKER NXT", cursor.current(), nxt);
			if (nxt) {
				//@TODO move some of this logic to idle
				return nxt.next(cursor, criteria);
			} else {
				cursor.clear();
				return null;
			}
		}
		// 	next(cursor, criteria, prev = false) {
		// 	console.log("PICKER", prev);
		// 	let l = this.getLength(),
		// 		len = l,
		// 		node, nxt, met = !prev;
		// 	while (l--) {
		// 		node = this.getNode(len - l - 1);
		// 		console.log(!node.isDone(), cursor.current() !== node.getContent(), node.isApplyable(criteria), node);
		// 		if (!node.isDone() && cursor.current() !== node.getContent() && node.isApplyable(criteria) && (!prev || met)) {
		// 			nxt = node;
		// 			break;
		// 		}
		// 		met = met || (prev == node);
		// 	}
		// 	console.log("PICKER NXT", cursor.current(), nxt);
		// 	if (nxt) {
		// 		//@TODO move some of this logic to idle
		// 		if (nxt.isLeaf()) {
		// 			cursor.point(nxt.getContent());
		// 		} else {
		// 			return nxt.next(cursor, criteria);
		// 		}
		// 	} else {
		// 		// console.log("PICKER PARENT", this._parent);
		// 		// let parent = this.getParent();
		// 		// if (!parent) {
		// 		cursor.clear();
		// 		return null;
		// 		// }
		// 		// return parent.next(cursor, criteria, this);
		// 	}
		// }

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


module.exports = Picker;