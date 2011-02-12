__extends__(TheOne, Entity);

function TheOne() {
	Entity.prototype.constructor.call(this);
}

TheOne.prototype.tick = function(seconds) {
};

TheOne.prototype.drawImpl = function(c) {
	c.scale(0.5, 0.5);
	c.beginPath();
	c.lineTo(-10, -5);
	c.lineTo(-20, -30);
	c.lineTo(-15, -30);
	c.lineTo(0, -10);
	c.lineTo(20, -5);
	c.lineTo(20, 5);
	c.lineTo(0, 10);
	c.lineTo(-15, 30);
	c.lineTo(-20, 30);
	c.lineTo(-10, 5);
	c.lineTo(-20, 0);
	c.fill();
};
