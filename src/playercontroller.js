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
	if (this.upKey) this.entity.position.y -= speed * seconds;
	if (this.downKey) this.entity.position.y += speed * seconds;
	if (this.leftKey) this.entity.position.x -= speed * seconds;
	if (this.rightKey) this.entity.position.x += speed * seconds;
	this.entity.position.x = Math.max(this.entity.radius, Math.min(GAME_WIDTH - this.entity.radius, this.entity.position.x));
	this.entity.position.y = Math.max(this.entity.radius, Math.min(GAME_HEIGHT - this.entity.radius, this.entity.position.y));

	if (this.fireMainDelay > 0) {
		this.fireMainDelay -= seconds;
	} else if (this.shootMainKey) {
		this.game.locals.push(new Laser(this.entity.position, new Vector(350 * this.direction, 0)));
		this.fireMainDelay = 0.1;
	}

	if (this.fireAltDelay > 0) {
		this.fireAltDelay -= seconds;
	} else if (this.shootAltKey) {
		this.game.locals.push(new Missile(this.entity.position, new Vector(200 * this.direction, 0)));
		this.fireAltDelay = 1;
	}
};
