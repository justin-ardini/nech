__extends__(TestEnemy, Entity);

function TestEnemy(position) {
	Entity.prototype.constructor.call(this, position, 90);
	this.health = this.maxHealth = 500;
};

TestEnemy.prototype.getPrimaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(1.0, function() {
		var toAdd = [];
		for (var i = 0; i < 16; ++i) {
			// 2/3 MATH.PI <= angle <= 4/3 MATH.PI
			var angle = 0.6666 * Math.PI + (i / 16) * (Math.PI * 0.6666);
			toAdd.push(new Laser(this_.position, angle));
		}
		return toAdd;
	});
};

TestEnemy.prototype.getSecondaryFireBehavior = function() {
	var this_ = this;
	return new ChargeFireBehavior(4.0, function() {
		return new BigLaser(this_.position);
	});
};

TestEnemy.prototype.onFromServer = function(entity) {
	console.log('receiving from server: charging = ' + entity.charging);
	//this.charging = entity.charging;
}

TestEnemy.prototype.onToServer = function(entity) {
	console.log('sending to server: charging = ' + entity.charging);
	entity.charging = true; 
}

TestEnemy.prototype.drawImpl = function(c) {
	for (var i = 0; i < 30; i++) {
		var angle = -Math.PI / 3 + Math.PI * 2/3 * Math.random();
		var vel = Vector.fromAngle(angle).mul(-200 * Math.random());
		Particle().position(this.position.sub(1, 0)).velocity(vel).line().radius(10).expand(0.001).angle(angle);
	}
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
