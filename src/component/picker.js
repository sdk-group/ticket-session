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

	next(cursor) {
		let l = this.getLength(),
			len = l,
			node, nxt;
		while (l--) {
			node = this.getNode(len - l - 1);
			if (!node.isDone() && cursor.current() !== node.getContent()) {
				nxt = node;
				break;
			}
		}
		if (nxt) {
			if (nxt.isLeaf()) {
				cursor.point(nxt.getContent());
			} else {
				return nxt.next(cursor);
			}
		} else {
			console.log("PICKER PARENT", this._parent);
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


module.exports = Picker;