__extends__(TheOne, Entity);

function TheOne() {
	Entity.prototype.constructor.call(this);
}

TheOne.prototype.tick = function(seconds) {
};

TheOne.prototype.drawImpl = function(c) {
	c.fillStyle = 'black';
	c.beginPath();
	c.lineTo(0, 5);
	c.lineTo(5, 10);
	c.lineTo(10, -20);
	c.lineTo(15, -25);
	c.lineTo(0, -40);
	c.lineTo(-15, -25);
	c.lineTo(-10, -20);
	c.lineTo(-5, 10);
	c.fill();
};
