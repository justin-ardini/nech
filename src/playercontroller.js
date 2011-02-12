function PlayerController(game, entity) {
	this.game = game;
	this.entity = entity;
	this.fireMainDelay = 0;
	this.fireAltDelay = 0;
	this.direction = (entity instanceof TheOne) ? 1 : -1;

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
	this.shootMainKey = false;
	this.shootAltKey = false;
}

PlayerController.prototype.tick = function(seconds) {
	var speed = 200;
	this.entity.velocity.x = speed * (this.rightKey - this.leftKey);
	this.entity.velocity.y = speed * (this.downKey - this.upKey);
	this.entity.position.x = Math.max(this.entity.radius, Math.min(GAME_WIDTH - this.entity.radius, this.entity.position.x));
	this.entity.position.y = Math.max(this.entity.radius, Math.min(GAME_HEIGHT - this.entity.radius, this.entity.position.y));

	if (this.fireMainDelay > 0) {
		this.fireMainDelay -= seconds;
	} else if (this.shootMainKey) {
		this.game.addEntity(new Laser(this.entity.position, new Vector(350 * this.direction, 0)));
		this.fireMainDelay = 0.1;
	}

	if (this.fireAltDelay > 0) {
		this.fireAltDelay -= seconds;
	} else if (this.shootAltKey) {
		this.game.addEntity(new Missile(this.entity.position, new Vector(200 * this.direction, 0)));
		this.fireAltDelay = 1;
	}
};
