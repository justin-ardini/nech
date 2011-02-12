__extends__(Missile, Entity);

function Missile(position, angle) {
	Entity.prototype.constructor.call(this, position, 5);
	this.angle = angle || 0; // default angle of 0

	var this_ = this;
	this.emitter = new ParticleEmitter(0.05, function() {
		var vel = this_.velocity.add(new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5)).sub(Vector.fromAngle(this_.angle).mul(50));
		Particle().position(this_.position).velocity(vel).circle().radius(3).expand(0.5);
	});
}

Missile.prototype.tick = function(seconds, game) {
	this.velocity = this.velocity.add(Vector.fromAngle(this.angle).mul(200 * seconds));
	this.emitter.tick(seconds);

	Entity.prototype.tick.call(this, seconds);
};

Missile.prototype.drawImpl = function(c) {
	c.beginPath();
	c.lineTo(-10, 3);
	c.lineTo(5, 3);
	c.lineTo(10, 0);
	c.lineTo(5, -3);
	c.lineTo(-10, -3);
	c.fill();
};

Missile.prototype.onDie = function(game) {
	for (var i = 0; i < 40; i++) {
		var angle = Math.PI * 2 * Math.random();
		var vel = Vector.fromAngle(angle).mul(200 * Math.random());
		Particle().position(this.position).velocity(vel).line().radius(10).expand(0.001).angle(angle);
	}
};
