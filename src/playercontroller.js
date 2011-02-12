function PlayerController(game, entity) {
	this.game = game;
	this.entity = entity;
	this.fireDelay = 0;

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
	this.shootKey = false;
}

PlayerController.prototype.tick = function(seconds) {
	var speed = 300;
	if (this.upKey) this.entity.position.y -= speed * seconds;
	if (this.downKey) this.entity.position.y += speed * seconds;
	if (this.leftKey) this.entity.position.x -= speed * seconds;
	if (this.rightKey) this.entity.position.x += speed * seconds;
	this.entity.position.x = Math.max(this.entity.radius, Math.min(GAME_WIDTH - this.entity.radius, this.entity.position.x));
	this.entity.position.y = Math.max(this.entity.radius, Math.min(GAME_HEIGHT - this.entity.radius, this.entity.position.y));

	this.fireDelay -= seconds;
	if (this.fireDelay <= 0 && this.shootKey) {
		this.game.locals.push(new Missile(this.entity.position, new Vector(200, 0)));
		this.fireDelay = 1;
	}
};
