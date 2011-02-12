function Entity() {
	this.position = new Vector(0, 0);
	this.angle = 0;
}

Entity.prototype.draw = function(c) {
	c.save();
	c.translate(this.position.x, this.position.y);
	c.rotate(this.angle);
	this.drawImpl(c);
	c.restore();
};

Entity.prototype.tick = function(seconds) {
};
