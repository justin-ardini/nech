__extends__(Laser, Entity);

function Laser(position, velocity) {
	Entity.prototype.constructor.call(this, position, 5, 0);
	this.position = position;
	this.velocity = velocity || new Vector(0, 0); // default velocity of 0 for remote entities
}

Laser.prototype.draw = function(c) {
	var x = this.position.x;
	var y = this.position.y;
	c.beginPath();
	c.lineTo(x - 5, y);
	c.lineTo(x + 5, y);
	c.stroke();
};
