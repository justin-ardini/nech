__extends__(Laser, Entity);

function Laser(position, velocity) {
	Entity.prototype.constructor.call(this, position, 5, 0);
	this.position = position;
	this.velocity = velocity;
	this.direction = velocity.unit().mul(5);
}

Laser.prototype.tick = function(seconds) {
	this.position = this.position.add(this.velocity.mul(seconds));
};

Laser.prototype.draw = function(c) {
	var x = this.position.x;
	var y = this.position.y;
	var dx = this.direction.x;
	var dy = this.direction.y;
	c.beginPath();
	c.lineTo(x - dx, y - dy);
	c.lineTo(x + dx, y + dy);
	c.stroke();
};
