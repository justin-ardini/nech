function Game() {
	this.highlightAngle = 0;
	this.enemies = [];
	this.enemies.push(new TestEnemy());
	this.enemies[0].center = new Vector(400, 400);
}

Game.prototype.tick = function(seconds) {
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].tick(seconds);
	}
	this.highlightAngle += seconds * 0.1;
};

Game.prototype.draw = function(c) {
	c.fillStyle = '#FFFF00';
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);
	this.drawHighlight(c);
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(c);
	}
};

Game.prototype.drawHighlight = function(c) {
	var radius = 1000;
	var n = 10;
	var x = 100;
	var y = 100;

	c.fillStyle = '#FFBF00';
	for (var i = 0; i < n; i++) {
		var angle = i * Math.PI * 2 / n + this.highlightAngle;
		c.beginPath();
		c.lineTo(x, y);
		c.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
		c.lineTo(x + radius * Math.cos(angle + Math.PI / n), y + radius * Math.sin(angle + Math.PI / n));
		c.fill();
	}
};
