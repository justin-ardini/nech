// Shot type enum

function PlayerController(game, entity) {
	this.game = game;
	this.entity = entity;
	this.primaryFireBehavior = entity.getPrimaryFireBehavior();
	this.secondaryFireBehavior = entity.getSecondaryFireBehavior();
	this.tertiaryFireBehavior = entity.getTertiaryFireBehavior();

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
	this.shootMainKey = false;
	this.shootAltKey = false;
	this.shieldKey = false;
	this.shootAlt2Key = false;

	// these aren't set automatically
	this.prevShootMainKey = false;
	this.prevShootAltKey = false;
	this.prevShootAlt2Key = false;
}

PlayerController.prototype.tick = function(seconds) {
	if (!this.game.containsEntity(this.entity)) {
		return;
	}
	
	var speed = this.entity instanceof TheOne ? 200 : 75;
	this.entity.velocity.x = speed * (this.rightKey - this.leftKey);
	this.entity.velocity.y = speed * (this.downKey - this.upKey);

	// shield
	this.entity.usingShield = this.shieldKey;
	if (this.shieldKey) this.entity.shield = Math.max(0, this.entity.shield - 10 * seconds);

	this.primaryFireBehavior.tick(seconds, this.game);
	this.secondaryFireBehavior.tick(seconds, this.game);
	if (this.tertiaryFireBehavior !== null) {
		this.tertiaryFireBehavior.tick(seconds, this.game);
	}
	if (this.shootMainKey) {
		this.primaryFireBehavior.keydown(this.game);
	}
	if (this.shootAltKey) {
		this.secondaryFireBehavior.keydown(this.game);
	}
	console.log(this.shootAlt2Key);
	if (this.shootAlt2Key && this.tertiaryFireBehavior !== null) {
		this.tertiaryFireBehavior.keydown(this.game);
	}

	if (this.prevShootMainKey && !this.shootMainKey) {
		this.primaryFireBehavior.keyup(this.game);
	}
	if (this.prevShootAltKey && !this.shootAltKey) {
		this.secondaryFireBehavior.keyup(this.game);
	}
	if (this.prevShootAlt2Key && !this.shootAlt2Key && this.tertiaryFireBehavior !== null) {
		this.tertiaryFireBehavior.keyup(this.game);
	}

	this.prevShootMainKey = this.shootMainKey;
	this.prevShootAltKey = this.shootAltKey;
	this.prevShootAlt2Key = this.shootAlt2Key;
};
