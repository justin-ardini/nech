__extends__(TestEnemy, Entity);
var TEST_ENEMY_DELAY1 = 1.0;
var TEST_ENEMY_DELAY2 = 5.0;

function TestEnemy(position) {
	Entity.prototype.constructor.call(this, position, 90, 2);
}

TestEnemy.prototype.primaryShot = function(game) {
	for (var i = 0; i < 20; ++i) {
		// -2/3 MATH.PI <= angle <= 2/3 MATH.PI
		var angle = -0.6666 * Math.PI + (i / 20) * (Math.PI * 1.3333);
		game.addEntity(new Laser(this.position, new Vector(-250 * Math.cos(angle), -250 * Math.sin(angle))));
	}
	return TEST_ENEMY_DELAY1;
}

TestEnemy.prototype.secondaryShot = function(game) {
	game.addEntity(new Missile(this.position, new Vector(-200, 0)));
	return TEST_ENEMY_DELAY2;
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
