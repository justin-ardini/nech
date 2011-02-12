__extends__(TheOne, Entity);

function TheOne() {
	Entity.prototype.constructor.call(this);
}

TheOne.prototype.tick = function(seconds) {
};

TheOne.prototype.drawImpl = function(c) {
	c.fillStyle = 'black';
	c.beginPath();
	c.lineTo(-20, 0);
	c.lineTo(-10, 5);
	c.lineTo(-15, 10);
	c.lineTo(0, 15);
	c.lineTo(20, 30);
	c.lineTo(10, 5);
	c.lineTo(15, 0);
	c.lineTo(10, -5);
	c.lineTo(20, -30);
	c.lineTo(0, -15);
	c.lineTo(-15, -10);
	c.lineTo(-10, -5);
	c.fill();
};
