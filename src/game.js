function Game() {
	this.angle = 0;
}

Game.prototype.tick = function(seconds) {
	this.angle += seconds;
};

Game.prototype.draw = function(c) {
	c.clearRect(0, 0, c.canvas.width, c.canvas.height);
	c.strokeStyle = 'black';
	c.lineWidth = 10;
	c.save();
	c.translate(100, 100);
	c.rotate(this.angle);
	c.beginPath();
	c.lineTo(-100, 0);
	c.lineTo(100, 0);
	c.stroke();
	c.restore();
};
