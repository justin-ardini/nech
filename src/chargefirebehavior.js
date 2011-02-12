__extends__(ChargeFireBehavior, FireBehavior);

function ChargeFireBehavior(chargeTime, createEntityFunction, emitter) {
	FireBehavior.prototype.constructor.call(this);
	this.maxChargeTime = this.chargeTime = chargeTime;
	this.charging = false;
	this.createEntity = createEntityFunction;
	this.emitter = emitter;
};

ChargeFireBehavior.prototype.tick = function(seconds, game) {
	if (this.charging) {
		this.emitter.tick(seconds);
		this.chargeTime += seconds;
		if (this.maxChargeTime - this.chargeTime < 0.6) {
			this.emitter.tick(-seconds);
		}
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
};

ChargeFireBehavior.prototype.keyup = function(game) {
	this.charging = false;
};
