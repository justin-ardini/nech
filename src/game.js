var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;

function Game() {
	this.highlightAngle = 0;

	this.theOne = new TheOne();
	this.theOne.position = new Vector(300, 300);

	this.enemies = [];
	this.enemies.push(new TestEnemy());
	this.enemies.push(new Missile(new Vector(200, 200), new Vector(200, 0)));
	this.enemies[0].position = new Vector(400, 400);

	this.controller = new PlayerController(this.theOne);
}

Game.prototype.tick = function(seconds) {
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].tick(seconds);
	}
	this.controller.tick(seconds);
	this.theOne.tick(seconds);
	this.highlightAngle += seconds * 0.1;
	Particle.tick(seconds);
};

Game.prototype.draw = function(c) {
	c.fillStyle = '#FFFF00';
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);
	this.drawHighlight(c);

	c.fillStyle = 'black';
	for (var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(c);
	}
	this.theOne.draw(c);
	Particle.draw(c);
};

Game.prototype.drawHighlight = function(c) {
	var radius = 1000;
	var n = 10;
	var x = c.canvas.width / 2;
	var y = c.canvas.height / 2;

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

Game.prototype.keyDown = function(key) {
	switch (key) {
		case KEY_UP: this.controller.upKey = true; break;
		case KEY_DOWN: this.controller.downKey = true; break;
		case KEY_LEFT: this.controller.leftKey = true; break;
		case KEY_RIGHT: this.controller.rightKey = true; break;
	}
};

Game.prototype.keyUp = function(key) {
	switch (key) {
		case KEY_UP: this.controller.upKey = false; break;
		case KEY_DOWN: this.controller.downKey = false; break;
		case KEY_LEFT: this.controller.leftKey = false; break;
		case KEY_RIGHT: this.controller.rightKey = false; break;
	}
};
