'use strict'

describe.only("PERF", function () {
	this.timeout(100000);
	this.slow(0);
	let iterations = 1000000;
	console.log("ITERATIONS x %d", iterations)
		// describe('array ops', function () {
		// 	let x1, x2, x3, km1 = {},
		// 		km2 = {},
		// 		km3 = {};
		// 	beforeEach(function () {
		// 		x1 = Array(2000);
		// 		x2 = Array(1000);
		// 		x3 = Array(1000);
		// 		x1 = _.map(x1, (el, i) => {
		// 			let val = Math.random();
		// 			km1[val] = i;
		// 			return val
		// 		})
		// 		x2 = _.map(x2, (el, i) => {
		// 			let val = Math.random();
		// 			km2[val] = i;
		// 			return val
		// 		})
		// 		x3 = _.map(x3, (el, i) => {
		// 			let val = Math.random();
		// 			km3[val] = i;
		// 			return val
		// 		})
		// 	});
		// 	it('solid', function () {
		// 		for (var i = 0; i < iterations; i++) {
		// 			let keys = Object.keys(km1),
		// 				l = keys.length;
		// 			while (l--) {
		// 				x1[km1[keys[l]]]++;
		// 			}
		// 		}
		// 	});

	// 	it('solid-1', function () {
	// 		for (var i = 0; i < iterations; i++) {
	// 			let l = x1.length;
	// 			while (l--) {
	// 				x1[l]++;
	// 			}
	// 		}
	// 	});
	// 	it('divided', function () {
	// 		let flag = true,
	// 			donor, acceptor, val;
	// 		for (var i = 0; i < iterations; i++) {
	// 			if (flag) {
	// 				donor = x2;
	// 				km2[11]
	// 				acceptor = x3
	// 			} else {
	// 				donor = x3;
	// 				acceptor = x2;
	// 			}
	// 			val = donor[11]
	// 			donor.splice(11, 1);
	// 			acceptor.push(val)
	// 		}
	// 		flag = !flag;

	// 	});

	// 	it('divided_addr', function () {
	// 		let flag = true,
	// 			donor = {
	// 				11: '42'
	// 			},
	// 			acceptor = {};
	// 		for (var i = 0; i < iterations; i++) {
	// 			if (flag) {
	// 				_.unset(donor, "11");
	// 				// donor["11"] = undefined;
	// 				acceptor["11"] = '42';
	// 			} else {
	// 				// acceptor["11"] = undefined;
	// 				_.unset(acceptor, "11");
	// 				donor["11"] = '42';
	// 			}
	// 			x1[acceptor["11"] || donor["11"]] += 1;
	// 		}
	// 		flag = !flag;

	// 	});
	// });
	describe('sort', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(15);
			x2 = Array(10);
			x1 = _.map(x1, el => Math.random())
			x2 = _.map(x2, el => Math.random())
		});

		it('lodash sortBy', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.sortBy(x1)
			}
		});

		it('lodash orderBy', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.orderBy(x1, _.identity, 'asc')
			}
		});

		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				res = res.sort()
			}
		});
	});
	describe('filter', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(15);
			x2 = Array(10);
			x1 = _.map(x1, el => Math.random())
			x2 = _.map(x2, el => Math.random())
		});

		it('lodash filter arrow', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.filter(x1, t => t > 0.5)
			}
		});

		it('lodash filter fn', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.filter(x1, function (t) {
					return t > 0.5;
				})
			}
		});


		it('native arrow', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.filter(t => t > 0.5);
			}
		});

		it('native fn', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.filter(function (t) {
					return t > 0.5;
				});
			}
		});

		it('native while', function () {
			let res, l = x1.length,
				len = l;
			for (var i = 0; i < iterations; i++) {
				res = [];
				while (l--) {
					if (x1[len - l - 1] > 0.5)
						res.push(x1[len - l - 1]);
				}
				l = len;
			}
			console.log(res);
		});
	})
	describe.only('indexOf', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(150);
			x2 = Array(100);
			x1 = _.map(x1, el => Math.random())
			x2 = _.map(x2, el => ({
				val: Math.random()
			}))
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = !!~_.indexOf(x1, x1[25])
			}
		});

		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = !!~x1.indexOf(x1[25])
			}
		});

		it('find', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.find(x2, x2[25])
			}
		});

		it('find by keymap', function () {
			let res, keymap = {},
				l = x2.length,
				k = l;
			while (l--) {
				keymap[x2[l].val] = l;
			}
			for (var i = 0; i < iterations; i++) {

				res = x2[keymap[x2[25].val]]
			}
		});
	})

	describe('bind vs closure', function () {
		let cb1 = function (data, self) {
			if (self)
				self._val = data;
			else
				this._val = data;
		};
		var cb2 = function (data, self) {
			if (self)
				self._val = data;
			else
				this._val = data;
		};

		function cb3(data, self) {
			if (self)
				self._val = data;
			else
				this._val = data;
		}
		const cb4 = (data, self) => {
			if (self)
				self._val = data;
			else
				this._val = data;
		}
		let cb5 = (data, self) => {
			if (self)
				self._val = data;
			else
				this._val = data;
		};
		var cb6 = (data, self) => {
			if (self)
				self._val = data;
			else
				this._val = data;
		};
		beforeEach(function () {});

		it('lodash cb1', function () {
			let res = _.bind(cb1, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('lodash cb2', function () {
			let res = _.bind(cb2, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('lodash cb3', function () {
			let res = _.bind(cb3, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('lodash cb4', function () {
			let res = _.bind(cb4, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('lodash cb5', function () {
			let res = _.bind(cb5, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('lodash cb6', function () {
			let res = _.bind(cb6, {});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});

		it('native cb1', function () {
			let res = cb1.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('native cb2', function () {
			let res = cb2.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('native cb3', function () {
			let res = cb3.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('native cb4', function () {
			let res = cb4.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('native cb5', function () {
			let res = cb5.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('native cb6', function () {
			let res = cb6.bind({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});

		it('arg cb1', function () {
			var that = {};
			let res = cb1;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('arg cb2', function () {
			var that = {};
			let res = cb2;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('arg cb3', function () {
			var that = {};
			let res = cb3;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('arg cb4', function () {
			var that = {};
			let res = cb4;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('arg cb5', function () {
			var that = {};
			let res = cb5;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('arg cb6', function () {
			var that = {};
			let res = cb6;
			for (var i = 0; i < iterations; i++) {
				res(666, that);
			}
		});
		it('closure cb1', function () {
			let res = function (that) {
				let cb1 = function (data, self) {
					that._val = data;
				};
				return cb1;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('closure cb2', function () {
			let res = function (that) {
				var cb2 = function (data, self) {
					that._val = data;
				};
				return cb2;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('closure cb3', function () {
			let res = function (that) {
				function cb3(data, self) {
					that._val = data;
				};
				return cb3;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('closure cb4', function () {
			let res = function (that) {
				const cb4 = function (data, self) {
					that._val = data;
				};
				return cb4;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('closure cb5', function () {
			let res = function (that) {
				let cb5 = (data, self) => {
					that._val = data;
				};
				return cb5;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
		it('closure cb6', function () {
			let res = function (that) {
				var cb6 = (data, self) => {
					that._val = data;
				};
				return cb6;
			}({});
			for (var i = 0; i < iterations; i++) {
				res(666);
			}
		});
	})

	describe('concat', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(150);
			x2 = Array(100);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.concat(x1, x2)
			}
		});
		it('lodash flatten', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.flatten([x1, x2])
			}
		});

		// it('splice', function () {
		// 	let res;
		// 	for (var i = 0; i < iterations; i++) {
		// 		x1.splice(x1.length, 0, ...x2);
		// 	}
		// });
		it('native12', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.concat(x2);
			}
		});

		it('native21', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x2.concat(x1);
			}
		});

		it('push', function () {
			let res, j, l = x2.length;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				for (j = 0; j < l; j++) {
					res.push(x2[j]);
				}
			}
		});

		it('push+apply', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				Array.prototype.push.apply(res, x2);
			}
		});
		it('push+spread', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				res.push(...x2);
			}
		});
	});
	describe('array/string as path', function () {
		it('array slice->push.apply', function () {
			let res = [];
			for (var i = 0; i < iterations; i++) {
				var t = res.slice();
				t.push(i);
				// res = t;
			}
		});
		// it('array slice->concat', function () {
		// 	let res = [];
		// 	for (var i = 0; i < iterations; i++) {
		// 		res = [].concat(res, i);
		// 	}
		// });
		it('string +=', function () {
			let res = '';
			for (var i = 0; i < iterations; i++) {
				var t = res;
				t += i;
				res = t;
			}
		});
		it('string templates', function () {
			let res = '';
			for (var i = 0; i < iterations; i++) {
				var t = res;
				t = `${t}${i}`;
				res = t;
			}
		});
	});
	describe('val at end', function () {
		it('split', function () {
			let ch, res = '12.32.561.213';
			for (var i = 0; i < iterations; i++) {
				ch = res.split('.');
				ch = ch[ch.length - 1];
			}
		});
		it('regex', function () {
			let ch, res = '12.32.561.213';
			for (var i = 0; i < iterations; i++) {
				ch = res.match(/.*\.(\d+)$/)[1];
			}
		});
		it('string templates', function () {
			let ch, res = '12.32.561.213';
			for (var i = 0; i < iterations; i++) {
				let l = res.length;
				ch = '';
				while (l--) {
					ch = res[l] + ch;
					if (res[l - 1] == '.')
						l = 0;
				}
			}
		});
	});
	describe('map', function () {
		let x1, x2;
		let fn = function (x) {
			return x;
		}
		beforeEach(function () {
			x1 = Array(150);
			x2 = Array(100);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		// it('native', function () {
		// 	let res;
		// 	for (var i = 0; i < iterations; i++) {
		// 		res = x1.map(fn)
		// 	}
		// });

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.map(x1, fn)
			}
		});

		it('push + for of', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (var j of x1) {
					res.push(fn(j));
				}
			}
		});

		it('push + for', function () {
			let res, j, l = x1.length;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j = 0; j < l; j++) {
					res.push(fn(x1[j]));
				}
			}
		});


		it('push + while ', function () {
			let res, k = x1.length,
				l = x1.length;
			for (var i = 0; i < iterations; i++) {
				res = Array(k);
				while (l--) {
					res[k - l] = (fn(x1[k - l - 1]));
				}
				l = k;
			}
		});

	});
	describe('obj keys', function () {
		let x1;
		let fn = function (x) {
			return x;
		}
		beforeEach(function () {
			x1 = {
				a: 123,
				b: 4,
				c: 5,
				d: 6
			};
		});
		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.keys(x1);
			}
		});
		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = Object.keys(x1);
			}
		});
		it('arr', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				let fin = [];
				for (var ij in x1) {
					fin.push(ij)
				}
			}
			console.log(ij);
		});
	});
	describe('obj has', function () {
		let x1;
		let fn = function (x) {
			return x;
		}
		beforeEach(function () {
			x1 = {
				a: 123,
				b: 4,
				c: 5,
				d: 6
			};
		});
		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.has(x1, 'a');
			}
		});
		it('native hasOwnProperty', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.hasOwnProperty('a');
			}
		});
		it('bool typecast', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = !!x1['a'];
			}
		});
		it('bool typecast', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = !!x1.a;
			}
		});
	});
	describe.only('obj iteration', function () {
		let x1;
		beforeEach(function () {
			x1 = {
				a: 123,
				b: 4,
				c: 5,
				d: 6
			};
		});

		it('of keys', function () {
			let res, keys = Object.keys(x1),
				l = keys.length;
			for (var i = 0; i < iterations; i++) {
				res = {}
				for (var j of keys) {
					res[j] = x1[j];
				}
			}

		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = {};
				_.reduce(x1, (acc, val, k) => {
					res[k] = val;
				}, res)
			}

		});

		it('for in', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = {};
				for (var j in x1) {
					res[j] = x1[j];
				}
			}

		});

		it(' for', function () {
			let res, keys = Object.keys(x1),
				l = keys.length;
			for (var i = 0; i < iterations; i++) {
				res = {}
				for (var j = 0; j < l; j++) {
					res[keys[j]] = x1[keys[j]];
				}
			}

		});


		it(' while ', function () {
			let res, keys = Object.keys(x1),
				l = keys.length,
				k = l;
			for (var i = 0; i < iterations; i++) {
				res = {}
				while (l--) {
					res[keys[k - l - 1]] = x1[keys[k - l - 1]];
				}
				l = k;
			}

		});

		it(' reduce ', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = {}
				_.reduce(x1, (acc, val, key) => {
					acc[key] = val;
					return acc;
				}, res)
			}

		});

	});
	describe.only('keyby', function () {
		let x1;
		beforeEach(function () {
			x1 = Array(150);
			x1 = _.map(x1, el => ({
				val: Math.random()
			}))
		});

		it(' reduce ', function () {
			let res = {};
			for (var i = 0; i < iterations; i++) {
				res = {}
				_.reduce(x1, (acc, val, key) => {
					acc[val.val] = val;
					return acc;
				}, res)
			}

		});

		it(' lodash ', function () {
			let res = {};
			for (var i = 0; i < iterations; i++) {
				res = _.keyBy(x1, 'val')
			}

		});

		it(' while ', function () {
			let res = {},
				l = x1.length,
				k = l;
			for (var i = 0; i < iterations; i++) {
				res = {}
				while (l--) {
					res[x1[l].val] = x1[l];
				}
				l = k;
			}

		});

		it('keymap', function () {
			let res = {},
				l = x1.length,
				k = l;
			for (var i = 0; i < iterations; i++) {
				res = {}
				while (l--) {
					res[x1[l].val] = l;
				}
				l = k;
			}

		});
	});
	describe.only('counters', function () {
		var j = 0,
			iter = iterations * 100;

		beforeEach(function () {
			j = 0
		});
		it('++', function () {
			let res;
			for (var i = 0; i < iter; i++) {
				j++
			}
		});
		it('+=', function () {
			let res;
			for (var i = 0; i < iter; i++) {
				j += 1
			}
		});
		it('++ in loop', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				for (j = 0; j < 100; j++) {}
			}
		});
		it('+= in loop', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				for (j = 0; j < 100; j += 1) {}
			}
		});

		it('++ in loop local var', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				for (var j = 0; j < 100; j++) {}
			}
		});
		it('+= in loop local var', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				for (var j = 0; j < 100; j += 1) {}
			}
		});

		it('++ in loop local let', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				for (let j = 0; j < 100; j++) {}
			}
		});
		it('+= in loop local let', function () {
			let res;
			for (let i = 0; i < iterations; i++) {
				for (var j = 0; j < 100; j += 1) {}
			}
		});
	})


	describe('forEach', function () {
		let x1, x2;

		function fn(x) {
			return x;
		}

		beforeEach(function () {
			x1 = Array(150);
			x2 = Array(100);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				_.forEach(x1, fn)
			}
		});

		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				x1.forEach(fn)
			}
		});


		it('push + for of', function () {
			let res, j;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j of x1) {
					fn(j);
				}
			}
		});

		it(' for in', function () {
			let res, j;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j in x1) {
					fn(x1[j]);
				}
			}
		});

		it('while ', function () {
			let res, k = x1.length,
				l = x1.length;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					fn(x1[k - l - 1]);
				}
				l = k;
			}
		});

		it('while 2', function () {
			var k = x1.length,
				l = x1.length;
			let res;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					fn(x1[k - l - 1]);
				}
				l = k;
			}
		});
		it('while with let', function () {
			let res, k = x1.length,
				l = x1.length,
				key;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					key = x1[k - l - 1];
					fn(key);
				}
				l = k;
			}
		});
		it('while with inner let', function () {
			let res, k = x1.length,
				l = x1.length;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					let key = x1[k - l - 1];
					fn(key);
				}
				l = k;
			}
		});
		it('while with var', function () {
			let res, k = x1.length,
				l = x1.length
			var key;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					key = x1[k - l - 1];
					fn(key);
				}
				l = k;
			}
		});
		it('while with inner  var', function () {
			let res, k = x1.length,
				l = x1.length
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					var key = x1[k - l - 1];
					fn(key);
				}
				l = k;
			}
		});
		it(' for ', function () {
			let res, j, l = x1.length;
			for (var i = 0; i < iterations; i++) {
				for (j = 0; j < l; j++) {
					fn(x1[j]);
				}
			}
		});
	});

	describe('isArray', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(150);
			x2 = Array(100);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.isArray(x1)
			}
		});


		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = Array.isArray(x1)
			}
		});

		it('instanceOf', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1 instanceof Array;
			}
		});

		it('proto', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = Object.prototype.toString.call(x1) == "[object Array]"
			}
		});

		it('constructor', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.constructor === Array;
			}
		});
	});

	describe('setter', function () {
		class Agent {
			set prop(val) {
				this._prop = val;
			}
			setProp(val) {
				this._prop = val;
			}
		}

		let inst;

		beforeEach(function () {
			inst = new Agent();
		});

		it('setter', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst.prop = Math.random()
			}
		});


		it('method', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst.setProp(Math.random())
			}
		});

		it('direct', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst._prop = Math.random()
			}
		});
	});

	describe('graph traverse', function () {
		describe('class-content', function () {

			class Agent {
				constructor(i) {
					this.index = i;
					this.content = null;
				}
			}

			let addrs = ['1.content.2.content.3', '1.content.0.content.0', '1.content.1.content.4.content.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => new Agent(i));
				inst[0].content = [null, inst[1], inst[2]];
				inst[1].content = [inst[3], inst[4], inst[5], inst[6]];
				inst[2].content = {
					'a': inst[7],
					'b': inst[8]
				}
				inst[3].content = new Set([inst[9]]);
				inst[4].content = [inst[10], inst[11], inst[12], inst[13], inst[14]]
				inst[5].content = [inst[15], inst[16], inst[17], inst[18]]
				inst[14].content = {
					'id': inst[19]
				}

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[1])
				}
			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[0])

				}
			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[2])

				}
			});

			it('set', function () {
				let res, path = addrs[1].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('arr', function () {
				let res, path = addrs[0].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('obj', function () {
				let res, path = addrs[2].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});
		});
		describe('obj-content', function () {
			let addrs = ['1.content.2.content.3', '1.content.0.content.0', '1.content.1.content.4.content.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => {
					let o = {};
					o.index = i;
					return o;
				});
				inst[0].content = [null, inst[1], inst[2]];
				inst[1].content = [inst[3], inst[4], inst[5], inst[6]];
				inst[2].content = {
					'a': inst[7],
					'b': inst[8]
				}
				inst[3].content = new Set([inst[9]]);
				inst[4].content = [inst[10], inst[11], inst[12], inst[13], inst[14]]
				inst[5].content = [inst[15], inst[16], inst[17], inst[18]]
				inst[14].content = {
					'id': inst[19]
				}

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[1])
				}
			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[0])

				}
			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[2])

				}
			});

			it('set', function () {
				let res, path = addrs[1].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('arr', function () {
				let res, path = addrs[0].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('obj', function () {
				let res, path = addrs[2].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});
		});


		describe('obj-byaddr', function () {
			let addrs = ['1.2.3', '1.0.0', '1.1.4.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => {
					let o = {};
					o.index = i;
					return o;
				});
				inst[0]['1'] = inst[1];
				inst[0]['2'] = inst[2];
				inst[0]['1.0'] = inst[3];
				inst[0]['1.1'] = inst[4];
				inst[0]['1.2'] = inst[5];
				inst[0]['1.3'] = inst[6];

				inst[0]['2.a'] = inst[7];
				inst[0]['2.b'] = inst[8];

				inst[0]['1.0.0'] = inst[9];
				inst[0]['1.1.0'] = inst[10];
				inst[0]['1.1.1'] = inst[11];
				inst[0]['1.1.2'] = inst[12];
				inst[0]['1.1.3'] = inst[13];
				inst[0]['1.1.4'] = inst[14];
				inst[0]['1.2.0'] = inst[15];
				inst[0]['1.2.1'] = inst[16];
				inst[0]['1.2.2'] = inst[17];
				inst[0]['1.2.3'] = inst[18];

				inst[0]['1.1.4.id'] = inst[19];

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[1])
				}

			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[0])

				}

			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[2])

				}

			});

			it('set', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[1]];
				}

			});

			it('arr', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[0]];
				}

			});

			it('obj', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[2]];
				}

			});
		});
	});
});