// Shot type enum
var SHOT_REPEATED1 = 0;
var SHOT_REPEATED2 = 1;
var SHOT_CHARGE = 2;

function PlayerController(game, entity) {
	this.game = game;
	this.entity = entity;
	this.primaryFireBehavior = entity.getPrimaryFireBehavior();
	this.secondaryFireBehavior = entity.getSecondaryFireBehavior();

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
	this.shootMainKey = false;
	this.shootAltKey = false;
	// these aren't set automatically
	this.prevShootMainKey = false;
	this.prevShootAltKey = false;
}

PlayerController.prototype.tick = function(seconds) {
	var speed = 200;
	this.entity.velocity.x = speed * (this.rightKey - this.leftKey);
	this.entity.velocity.y = speed * (this.downKey - this.upKey);
	this.entity.position.x = Math.max(this.entity.radius, Math.min(GAME_WIDTH - this.entity.radius, this.entity.position.x));
	this.entity.position.y = Math.max(this.entity.radius, Math.min(GAME_HEIGHT - this.entity.radius, this.entity.position.y));

	this.primaryFireBehavior.tick(seconds, this.game);
	this.secondaryFireBehavior.tick(seconds, this.game);
	if (this.shootMainKey) {
		this.primaryFireBehavior.keydown(this.game);
	}
	if (this.shootAltKey) {
		this.secondaryFireBehavior.keydown(this.game);
	}

	if (this.prevShootMainKey && !this.shootMainKey) {
		this.primaryFireBehavior.keyup(this.game);
	}
	if (this.prevShootAltKey && !this.shootAltKey) {
		this.secondaryFireBehavior.keyup(this.game);
	}

	this.prevShootMainKey = this.shootMainKey;
	this.prevShootAltKey = this.shootAltKey;
};
