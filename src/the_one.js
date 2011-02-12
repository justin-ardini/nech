var THE_ONE_DELAY1 = 0.1;
var THE_ONE_DELAY2 = 1.0;

__extends__(TheOne, Entity);

function TheOne(position) {
	Entity.prototype.constructor.call(this, position, 15);
	this.health = this.maxHealth = 100;
}

TheOne.prototype.primaryShot = function(game) {
	game.addEntity(new Laser(this.position, 0));
	return THE_ONE_DELAY1;
}

TheOne.prototype.secondaryShot = function(game) {
	game.addEntity(new Missile(this.position, 0));
	return THE_ONE_DELAY2;
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
