__extends__(Spinner, Entity);

function Spinner(position, angle) {
	Entity.prototype.constructor.call(this, position, 5);
	this.angle = angle || 0; // default angle of 0
	this.velocity = 0;
	var this_ = this;
	this.emitter = new ParticleEmitter(0.10, function() {
		var vel = this_.velocity.add(new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5)).sub(Vector.fromAngle(this_.angle).mul(50));
		Particle().position(this_.position).velocity(vel).circle().radius(3).expand(0.5);
	});
}

Spinner.prototype.tick = function(seconds, game) {
	if (this.velocity === 0) {
		this.velocity = Vector.fromAngle(this.angle).mul(1000 * seconds);
	}
	this.angle = (this.angle + seconds);
	if (this.angle > 2 * Math.PI) {
		this.angle -= 2 * Math.PI;
	}
	this.emitter.tick(seconds);

	Entity.prototype.tick.call(this, seconds);
};

Spinner.prototype.drawImpl = function(c) {
	c.beginPath();
	c.lineTo(-10, 3);
	c.lineTo(5, 3);
	c.lineTo(10, 0);
	c.lineTo(5, -3);
	c.lineTo(-10, -3);
	c.fill();
};

Spinner.prototype.onDie = function(game) {
	for (var i = 0; i < 40; i++) {
		var angle = Math.PI * 2 * Math.random();
		var vel = Vector.fromAngle(angle).mul(200 * Math.random());
		Particle().position(this.position).velocity(vel).line().radius(10).expand(0.001).angle(angle);
	}
};
