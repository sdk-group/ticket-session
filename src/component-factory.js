'use strict'

let Idle = discover('idle');

function discover(name) {
	return require(`./component/${_.kebabCase(name)}.js`);
}

class ComponentFactory {
	static build(type, data = []) {

		let Model = discover(type);

		let response = new Model();
		if (response.isLeaf()) {
			response.build(data);
		} else {
			response.build(_.map(data, d => {
				let item = d;
				if (!Idle.isComponent(d)) {
					item = new Idle();
					item.build(d);
				}
				return item;
			}));
		}
		return response;
	}
}

module.exports = ComponentFactory;