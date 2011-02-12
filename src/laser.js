__extends__(Laser, Entity);

function Laser(position, velocity) {
	Entity.prototype.constructor.call(this, position, 5, 0);
	this.position = position;
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
