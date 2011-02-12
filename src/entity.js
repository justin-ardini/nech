function Entity(position, radius) {
	this.position = position;
	this.velocity = new Vector(0, 0);
	this.radius = radius;
	this.clientDamage = 0;
	this.serverDamage = 0;
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

// hook that's called when the entity object, representing this entity, has come from the server
// this is for reading custom properties back from onToServer()
Entity.prototype.onFromServer = function(entity) {
};

// hook that's called when the entity object, representing this entity, is about to be sent to the server
// this is for writing custom properties for onFromServer()
Entity.prototype.onToServer = function(entity) {
};

Entity.prototype.tick = function(seconds, game) {
	this.position = this.position.add(this.velocity.mul(seconds));
};

// called when an entity is removed from the entitiy list, override this in a subclass to customize
Entity.prototype.onDie = function(game) {
};

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
		var health = Math.max(0, this.maxHealth - this.clientDamage - this.serverDamage);
		c.strokeRect(-r, -r - height - padding, 2 * r, height);
		c.fillRect(-r + padding, -r - height, 2 * (r - padding) * health / this.maxHealth, height - 2 * padding);
	}
};
