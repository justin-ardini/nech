__extends__(TheOne, Entity);

function TheOne(position) {
	Entity.prototype.constructor.call(this, position, 15, 1);
}

TheOne.prototype.drawImpl = function(c) {
	c.beginPath();
	c.lineTo(-5, -2);
	c.lineTo(-10, -15);
	c.lineTo(-7, -15);
	c.lineTo(0, -5);
	c.lineTo(10, -2);
	c.lineTo(10, 2);
	c.lineTo(0, 5);
	c.lineTo(-7, 15);
	c.lineTo(-10, 15);
	c.lineTo(-5, 2);
	c.lineTo(-10, 0);
	c.fill();
};
