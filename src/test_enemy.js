__extends__(TestEnemy, Entity);

function TestEnemy() {
	Entity.prototype.constructor.call(this);
	this.particleTimer = 0;
}

TestEnemy.prototype.tick = function(seconds) {
	this.position.x -= seconds * 10;

	this.particleTimer += seconds;
	while (this.particleTimer > 0) {
		this.particleTimer -= 0.025;
		var vel = new Vector(100 + 50 * Math.random(), 20 * Math.random() - 10);
		Particle().position(this.position).velocity(vel).circle().radius(5).expand(0.2);
	}
};

TestEnemy.prototype.drawImpl = function(c) {
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
