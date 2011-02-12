var BIG_LASER_LIFE_SPAN = 2;

__extends__(BigLaser, Entity);

function BigLaser(position) {
	Entity.prototype.constructor.call(this, position, 15);
	this.timeLeft = BIG_LASER_LIFE_SPAN;
}

BigLaser.prototype.tick = function(seconds, game) {
	this.timeLeft -= seconds;
	console.log(this.timeLeft);
	if (this.timeLeft <= 0) {
		game.removeEntity(this);
	}
	Entity.prototype.tick.call(this, seconds, game);
}

BigLaser.prototype.draw = function(c) {
	var n = 10;
	c.beginPath();
	for (var i = 0; i < n; i++) {
		var x = i * GAME_WIDTH / (n - 1);
		c.lineTo(x + Math.random() * 50 - 25, this.position.y + (Math.random() * 20 - 10) * this.timeLeft / BIG_LASER_LIFE_SPAN);
	}
	c.fill();
};
