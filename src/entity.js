function Entity(position, radius) {
	this.position = position;
	this.velocity = new Vector(0, 0);
	this.radius = radius;
	this.health = 0;
	this.maxHealth = 0;
	this.angle = 0;
	
	// this is necessary to prevent a race condition:
	// 1. server sends client the entity list
	// 2. client creates entity
	// 3. client gets what server sent, which of course doesn't contain entity
	// 4. client deletes new entity
	// solution: only delete something when it's been seen from the server first
	this.seenFromServer = false;

	this.playerId = null;
	this.netId = null;
}

Entity.prototype.tick = function(seconds) {
	this.position = this.position.add(this.velocity.mul(seconds));
};

// Shots should be added with game.addEntity()
Entity.prototype.primaryShot = function(game) {
	return;
}

// Shots should be added with game.addEntity()
Entity.prototype.secondaryShot = function(game) {
	return;
}

Entity.prototype.draw = function(c) {
	c.save();
	c.translate(this.position.x, this.position.y);
	c.rotate(this.angle);
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
