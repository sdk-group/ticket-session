'use strict'

let OrchestrationNode = require('./orchestration-node.js');

class Idle extends OrchestrationNode {
	// methods
	build(entity) {
		this._content = (entity.constructor === Array) ? entity[0] : entity;
		if (this._content.setContainer && this._content.setContainer.constructor === Function)
			this._content.setContainer(this);
	}

	getNode(addr) {
		throw new Error(`${this.constructor.name}::getNode by address ${addr} cannot be performed on single-entity node`);
	}

	getLength() {
		throw new Error(`${this.constructor.name}::getLength cannot be performed on single-entity node`);
	}

	isLeaf() {
		return true;
	}

	render(cursor) {
		if (cursor.isEmpty())
			return this.getContent();

		if (cursor.isSame(this.getContent())) {
			cursor.resetDepth();
			return this.getContent();
		}
	}

	update(leaf_data) {
		this._content.update(leaf_data);
		this.notify(this._content);
	}

	// isApplyable(fn) {
	// 	return fn && fn(this.getContent());
	// }

	isDone() {
		return this._content.isProcessed();
	}
	contains(item) {
		return this._content === item;
	}
	next(cursor, criteria) {
		// console.log("IDLE");
		// let parent = this.getParent();
		// if (parent)
		// return parent.next(cursor, criteria, this);
		// else {
		let cnt = this.getContent();
		if (this.isDone() || cursor.current() === cnt) {
			cursor.clear();
		} else {
			cursor.point(cnt);
		}
		// }
	}

	canNext(cursor, criteria) {
		let cnt = this.getContent();
		return !(this.isDone() || cursor.current() === cnt) && criteria(cnt);
	}
}


module.exports = Idle;