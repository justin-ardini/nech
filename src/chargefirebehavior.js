__extends__(ChargeFireBehavior, FireBehavior);

function ChargeFireBehavior(chargeTime, createEntityFunction) {
	FireBehavior.prototype.constructor.call(this);
	this.maxChargeTime = this.chargeTime = chargeTime;
	this.charging = false;
	this.createEntity = createEntityFunction;
};

ChargeFireBehavior.prototype.tick = function(seconds, game) {
	if (this.charging) {
		this.chargeTime += seconds;
	} else {
		this.chargeTime = 0;
	}
	if (this.chargeTime >= this.maxChargeTime) {
		game.addEntity(this.createEntity());
		this.chargeTime = 0;
	}
};

ChargeFireBehavior.prototype.keydown = function(game) {
	this.charging = true;
	var toAdd = this.createEntity();
	for (var i = 0; i < toAdd.length; ++i) {
		game.addEntity(toAdd[i]);
	}
};

ChargeFireBehavior.prototype.keyup = function(game) {
	this.charging = false;
};
