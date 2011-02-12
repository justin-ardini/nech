__extends__(Laser, Entity);

function Laser(position, angle) {
	Entity.prototype.constructor.call(this, position, 5, 0);
	this.angle = angle || 0; // default angle of 0
}

Laser.prototype.tick = function(seconds) {
	this.velocity = Vector.fromAngle(this.angle).mul(350);
	Entity.prototype.tick.call(this, seconds);
};

Laser.prototype.drawImpl = function(c) {
	c.beginPath();
	c.lineTo(-5, 0);
	c.lineTo(5, 0);
	c.stroke();
};
