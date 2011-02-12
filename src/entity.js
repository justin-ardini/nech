function Entity() {
	this.centerX = 0;
	this.centerY = 0;
	this.angle = 0;
}

Entity.prototype.draw = function(c) {
	c.save();
	c.translate(this.centerX, this.centerY);
	c.rotate(this.angle);
	this.drawImpl(c);
	c.restore();
};
