__extends__(TestEnemy, Entity);

function TestEnemy() {
	Entity.prototype.constructor.call(this);
}

TestEnemy.prototype.tick = function(seconds) {
	this.center.x -= seconds * 10;

	var vel = new Vector(200 * Math.random() + 100, 50 * Math.random() - 25);
	Particle().position(this.center).velocity(vel).circle().radius(5).color(0, 0, 0, 1).decay(0.1);
};

TestEnemy.prototype.drawImpl = function(c) {
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
