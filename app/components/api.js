let p1 = {
	name: 'nijat'
};
let a1 = function() {
	console.log(this.name);
}.bind(p1);
a1();