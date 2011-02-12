function Entity(position, radius) {
	this.position = position;
	this.radius = radius;
	this.angle = 0;
}

Entity.prototype.draw = function(c) {
	c.save();
	c.translate(this.position.x, this.position.y);
	c.rotate(this.angle);
	this.drawCollisionRadius(c);
	this.drawImpl(c);
	c.restore();
};

Entity.prototype.tick = function(seconds) {
};

// TODO: remove, only for debugging
Entity.prototype.drawCollisionRadius = function(c) {
	c.strokeStyle = 'red';
	c.beginPath();
	c.arc(0, 0, this.radius, 0, Math.PI * 2, false);
	c.stroke();
	c.strokeStyle = 'black';
};
