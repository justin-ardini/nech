__extends__(BigLaser, Entity);

function BigLaser(position) {
	Entity.prototype.constructor.call(this, position, 15);
}

BigLaser.prototype.draw = function(c) {
	var n = 10;
	c.beginPath();
	for (var i = 0; i < n; i++) {
		var x = i * GAME_WIDTH / (n - 1);
		c.lineTo(x + Math.random() * 50 - 25, this.position.y + Math.random() * 50 - 25);
	}
	c.fill();
};
