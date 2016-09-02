'use strict'

let Idle = discover('idle');

function discover(name) {
	return require(`./component/${_.kebabCase(name)}.js`);
}

class ComponentFactory {
	//description: {type:,data:}
	static build(description) {

		let Model = discover(description.type);

		let response = new Model();
		if (response.isLeaf()) {
			response.build(description.data);
		} else {
			response.build(_.map(description.data, d => {
				let item = d;
				if (!Idle.isComponent(d)) {
					item = ComponentFactory.build(d);
				}
				return item;
			}));
		}
		return response;
	}
}

module.exports = ComponentFactory;