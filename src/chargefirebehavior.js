__extends__(ChargeFireBehavior, FireBehavior);

function ChargeFireBehavior(chargeTime, createEntityFunction) {
	FireBehavior.prototype.constructor.call(this);
	this.maxChargeTime = chargeTime;
	this.chargeTime = chargeTime;
	this.createEntity = createEntityFunction;
};

RepeatedFireBehavior.prototype.tick = function(game) {
	if (this.chargeTime > 0) {
		this.repeatTime -= seconds;
	}
	if (this.charge < TEST_ENEMY_MAX_CHARGE) {
		++this.charge;
	}
	if (this.charge >= TEST_ENEMY_MAX_CHARGE) {
		// TODO: Do super poweful move!
		game.addEntity(new Missile(this.position, new Vector(600, 0)));
		this.charge = -1;
	}
};

RepeatedFireBehavior.prototype.keydown = function(game) {
	var toAdd = this.createEntity();
	for (var i = 0; i < toAdd.length; ++i) {
		game.addEntity(toAdd[i]);
	}
};

