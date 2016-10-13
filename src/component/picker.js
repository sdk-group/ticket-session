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

	isApplyable(fn) {
		let l = this.getLength(),
			res = true,
			node;
		while (l--) {
			node = this.getNode(l);
			res = res && node.isApplyable(fn);
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
			// console.log(!node.isDone(), cursor.current() !== node.getContent(), node.isApplyable(criteria), node);
			if (!node.isDone() && cursor.current() !== node.getContent() && node.isApplyable(criteria)) {
				nxt = node;
				break;
			}
		}
		// console.log("PICKER NXT", cursor.current(), nxt);
		if (nxt) {
			//@TODO move some of this logic to idle
			if (nxt.isLeaf()) {
				cursor.point(nxt.getContent());
			} else {
				return nxt.next(cursor, criteria);
			}
		} else {
			// console.log("PICKER PARENT", this._parent);
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


module.exports = Picker;