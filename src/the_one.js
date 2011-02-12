__extends__(TheOne, Entity);

function TheOne(position) {
	Entity.prototype.constructor.call(this, position, 15, 1);
	this.primaryShotDelay = 0;
	this.secondaryShotDelay = 0;
}

TheOne.prototype.getPrimaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(0.1, function() {
		return [new Laser(this_.position, 0)];
	});
};

TheOne.prototype.getSecondaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(1.0, function() {
		return [new SuperLaser(this_.position)];
	});
};

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
