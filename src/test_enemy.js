__extends__(TestEnemy, Entity);

function TestEnemy(position) {
	Entity.prototype.constructor.call(this, position, 90);
	this.maxHealth = 500;
	var this_ = this;
	this.behavior = new ChargeFireBehavior(4.0, function() {
		this_.clientDamage += 50;
		return new BigLaser(this_.position);
	});
	
	this.emitter = new ParticleEmitter(.05, function() {
		for (var i = 0; i < 6; i++) {
			var angle = -Math.PI / 5 + Math.PI * 2/5 * Math.random();
			var vel = Vector.fromAngle(angle).mul(5 + 45 * Math.random());
			Particle().position(this_.position.sub(new Vector(30,0).sub(vel.mul(-1.0)))).velocity(vel).line().radius(6).expand(0.0004).angle(angle);
		}
	});
	this.chargingTimer = 0;
};

TestEnemy.prototype.tick = function(seconds) {
	Entity.prototype.tick.call(this, seconds);

	if (this.behavior.charging) {
		this.emitter.tick(seconds);
		this.chargingTimer += seconds;
		if (this.chargingTimer > 3.4) {
			this.emitter.tick(-seconds);
			if (this.chargingTimer > 4.0) {
				this.chargingTimer -= 4.0;
			}
		}
	} else {
		this.chargingTimer = 0;
	}
};

TestEnemy.prototype.getPrimaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(1.8, function() {
		var toAdd = [];
		for (var i = 0; i < 14; ++i) {
			// 2/3 MATH.PI <= angle <= 4/3 MATH.PI
			var angle = 0.6666 * Math.PI + (i / 14) * (Math.PI * 0.6666);
			toAdd.push(new Laser(this_.position, angle));
		}
		return toAdd;
	});
};

TestEnemy.prototype.getSecondaryFireBehavior = function() {
	return this.behavior;
};

TestEnemy.prototype.getTertiaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(3, function() {
		var toAdd = [];
		for (var i = 0; i < 5; ++i) {
			var angle = (i / 5) * (2 * Math.PI);
			toAdd.push(new Spinner(this_.position, angle));
		}
		return toAdd;
	});
};

TestEnemy.prototype.onFromServer = function(entity) {
	this.behavior.charging = entity.charging;
}

TestEnemy.prototype.onToServer = function(entity) {
	entity.charging = this.behavior.charging;
}

TestEnemy.prototype.onDie = function(game) {
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
