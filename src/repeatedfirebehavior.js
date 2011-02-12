__extends__(RepeatedFireBehavior, FireBehavior);

function RepeatedFireBehavior(repeatTime, createEntityFunction) {
	FireBehavior.prototype.constructor.call(this);
	this.maxRepeatTime = repeatTime;
	this.repeatTime = repeatTime;
	this.createEntity = createEntityFunction;
};

RepeatedFireBehavior.prototype.tick = function(game) {
	if (this.repeatTime > 0) {
		this.repeatTime -= seconds;
	}
};

RepeatedFireBehavior.prototype.keydown = function(game) {
	if (this.repeatTime <= 0) {
		var toAdd = this.createEntity();
		for (var i = 0; i < toAdd.length; ++i) {
			game.addEntity(toAdd[i]);
		}
		this.repeatTime = this.maxRepeatTime;
	}
};
