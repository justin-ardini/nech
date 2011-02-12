__extends__(TestEnemy, Entity);

function TestEnemy(position) {
	Entity.prototype.constructor.call(this, position, 90, 2);
}

TestEnemy.prototype.primaryShot = function(game) {
	for (var i = 1; i <= 20; ++i) {
		game.addEntity(new Laser(this.position, new Vector(i * 4 - 350, 0)));
	}
}

TestEnemy.prototype.secondaryShot = function(game) {
	game.addEntity(new Missile(this.position, new Vector(-200, 0)));
}

TestEnemy.prototype.drawImpl = function(c) {
	c.beginPath();
	c.lineTo(-60, 0);
	c.lineTo(-30, 15);
	c.lineTo(-45, 30);
	c.lineTo(0, 45);
	c.lineTo(60, 90);
	c.lineTo(30, 15);
	c.lineTo(45, 0);
	c.lineTo(30, -15);
	c.lineTo(60, -90);
	c.lineTo(0, -45);
	c.lineTo(-45, -30);
	c.lineTo(-30, -15);
	c.fill();
};
