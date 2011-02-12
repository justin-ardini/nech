__extends__(TestEnemy, Entity);

function TestEnemy() {
	Entity.prototype.constructor.call(this);
}

TestEnemy.prototype.tick = function(seconds) {
	this.center.x -= seconds * 10;
};

TestEnemy.prototype.drawImpl = function(c) {
	c.fillStyle = 'black';
	c.beginPath();
	c.lineTo(0, 20);
	c.lineTo(5, -20);
	c.lineTo(10, -20);
	c.lineTo(15, -25);
	c.lineTo(0, -40);
	c.lineTo(-15, -25);
	c.lineTo(-10, -20);
	c.lineTo(-5, -20);
	c.fill();
};
