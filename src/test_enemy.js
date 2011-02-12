__extends__(TestEnemy, Entity);

function TestEnemy(position) {
	Entity.prototype.constructor.call(this, position, 90, 2);
	this.charge = 0;
}

TheOne.prototype.getPrimaryFireBehavior = function() {
	var this_ = this;
	return new RepeatedFireBehavior(1.0, function() {
		var toAdd = [];
		for (var i = 0; i < 20; ++i) {
			// -2/3 MATH.PI <= angle <= 2/3 MATH.PI
			var angle = -0.6666 * Math.PI + (i / 20) * (Math.PI * 1.3333);
			toAdd.push(new Laser(this_.position, angle));
		}
		return toAdd;
	});
};

TheOne.prototype.getSecondaryFireBehavior = function() {
	var this_ = this;
	return new ChargeFireBehavior(5.0, function() {
		return new Missile(this_.position, 0);
	});
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
