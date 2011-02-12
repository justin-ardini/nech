__extends__(TheOne, Entity);

function TheOne(position) {
	Entity.prototype.constructor.call(this, position, 15);
	this.health = this.maxHealth = 50;
	this.shield = this.maxShield = 100;
	this.usingShield = false;
};

TheOne.prototype.getPrimaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(0.1, function() {
		return [new Laser(this_.position, 0)];
	});
};

TheOne.prototype.getSecondaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(1.0, function() {
		return [new Missile(this_.position, 0)];
	});
};

TheOne.prototype.onFromServer = function(entity) {
	this.shield = entity.shield;
	this.usingShield = entity.usingShield;
};

TheOne.prototype.onToServer = function(entity) {
	entity.shield = this.shield;
	entity.usingShield = this.usingShield;
};

TheOne.prototype.onDie = function(game) {
	for (var i = 0; i < 40; i++) {
		var angle = Math.PI * 2 * Math.random();
		var vel = Vector.fromAngle(angle).mul(200 * Math.random());
		Particle().position(this.position).velocity(vel).line().radius(300).expand(0.001).angle(angle);

		vel = Vector.fromAngle(Math.PI * 2 * Math.random()).mul(400 * Math.random());
		Particle().position(this.position).velocity(vel).circle().radius(20).expand(0.001);

		vel = Vector.fromAngle(Math.PI * 2 * Math.random()).mul(100 * Math.random());
		Particle().position(this.position).velocity(vel).triangle().radius(20).expand(0.001);
	}
};

TheOne.prototype.drawImpl = function(c) {
	if (this.usingShield) {
		c.beginPath();
		c.arc(0, 0, 35, 0, Math.PI * 1.9, false);
		c.arc(0, 0, 35 + this.shield * 5 / this.maxShield, Math.PI * 1.9, 0, true);
		c.fill();
	}
	
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
