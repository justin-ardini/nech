function Game() {
	this.entity = new TestEnemy();
}

Game.prototype.tick = function(seconds) {
	this.entity.centerX = 100;
	this.entity.centerY = 100;
	this.entity.angle += seconds;
};

Game.prototype.draw = function(c) {
	c.fillStyle = '#DFDFDF';
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);
	this.entity.draw(c);
};
