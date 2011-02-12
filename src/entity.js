function Entity(position, radius, health) {
	this.position = position;
	this.velocity = new Vector(0, 0);
	this.radius = radius;
	this.health = health;
	this.maxHealth = health;
	this.angle = 0;
	this.primaryFireBehavior = new RepeatedFireBehavior(0.1, 'Laser');
	this.secondaryFireBehavior = new RepeatedFireBehavior(1, 'Missile');
	this.playerId = null;
	this.netId = null;
}

Entity.prototype.tick = function(seconds) {
	this.position = this.position.add(this.velocity.mul(seconds));
};

Entity.prototype.draw = function(c) {
	c.save();
	c.translate(this.position.x, this.position.y);
	c.rotate(this.angle);
	this.drawCollisionRadius(c);
	this.drawHealthBar(c);
	this.drawImpl(c);
	c.restore();
};

Entity.prototype.drawHealthBar = function(c) {
	if (this.maxHealth > 0) {
		var r = this.radius;
		var height = 10;
		var padding = 2;
		c.strokeRect(-r, -r - height - padding, 2 * r, height);
		c.fillRect(-r + padding, -r - height, 2 * (r - padding) * this.health / this.maxHealth, height - 2 * padding);
	}
};

// TODO: remove, only for debugging
Entity.prototype.drawCollisionRadius = function(c) {
	c.strokeStyle = 'red';
	c.beginPath();
	c.arc(0, 0, this.radius, 0, Math.PI * 2, false);
	c.stroke();
	c.strokeStyle = 'black';
};
