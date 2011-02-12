__extends__(Missile, Entity);

function Missile(position, acceleration) {
	Entity.prototype.constructor.call(this, position, 5, 0);

	this.acceleration = acceleration;
	if (this.acceleration.x < 0) this.angle = Math.PI;

	var this_ = this;
	var direction = this.acceleration.unit().mul(50);
	this.emitter = new ParticleEmitter(0.05, function() {
		var vel = this_.velocity.add(new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5)).sub(direction);
		Particle().position(this_.position).velocity(vel).circle().radius(3).expand(0.5);
	});
}

Missile.prototype.tick = function(seconds) {
	this.velocity = this.velocity.add(this.acceleration.mul(seconds));
	this.position = this.position.add(this.velocity.mul(seconds));
	this.emitter.tick(seconds);
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
