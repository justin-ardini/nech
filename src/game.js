var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;
var KEY_SHOOT_MAIN = 4;
var KEY_SHOOT_ALT = 5;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var classMap = { 
	'TheOne': TheOne,
	'Missile': Missile
};

function Game(id, type, pos) {
	player = new classMap[type](pos);

	this.id = id;
	this.highlightAngle = 0;
	this.locals = [player];
	this.remotes = [];
	this.controller = new PlayerController(this, player);

	// TODO: remove this when locals and remotes are implemented
	this.remotes.push(new TestEnemy(new Vector(400, 400)));
	this.remotes.push(new TestEnemy(new Vector(600, 200)));
	this.paused = false;
}

Game.prototype.tick = function(seconds) {
	if (this.paused) {
		return;
	}
	this.controller.tick(seconds);
	for (var i = 0; i < this.locals.length; i++) {
		var local = this.locals[i];
		local.tick(seconds);
		if (local.position.x + local.radius < 0 || local.position.x - local.radius > GAME_WIDTH ||
			local.position.y + local.radius < 0 || local.position.y - local.radius > GAME_HEIGHT) {
			// remove local from locals while simultaneously making sure we don't skip the next local
			this.locals.splice(i--, 1);
		}
	}
	for (var i = 0; i < this.remotes.length; i++) {
		this.remotes[i].tick(seconds);
	}
	this.highlightAngle += seconds * 0.1;
	Particle.tick(seconds);

	// TODO: broadcast state of this.locals (but not this.remotes, which will instead be broadcast to us)
};

Game.prototype.receiveObject = function(obj) {
    if ('enemies' in obj) {
    }
    if ('dropPlayer' in obj) {
        this.dropPlayer(obj['dropPlayer']);        
    }
};

// Pause the game when a disconnect occurs
Game.prototype.pause = function () {
	this.paused = true;
};

Game.prototype.draw = function(c) {
	c.fillStyle = '#FFFF00';
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);
	this.drawHighlight(c);

	var text = this.locals.length + ' locals, ' + this.remotes.length + ' remotes';
	c.fillStyle = 'black';
	c.fillText(text, c.canvas.width - c.measureText(text).width - 10, c.canvas.height - 20);

	c.fillStyle = 'black';
	c.strokeStyle = 'black';
	if (this.paused) {
		c.textAlign = 'center';
		c.fillText("Sorry, you were disconnected.", c.canvas.width / 2, c.canvas.height / 2);
	}
	for (var i = 0; i < this.locals.length; i++) {
		this.locals[i].draw(c);
	}
	for (var i = 0; i < this.remotes.length; i++) {
		this.remotes[i].draw(c);
	}
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
		case KEY_SHOOT_MAIN: this.controller.shootMainKey = true; break;
		case KEY_SHOOT_ALT: this.controller.shootAltKey = true; break;
	}
};

Game.prototype.keyUp = function(key) {
	switch (key) {
		case KEY_UP: this.controller.upKey = false; break;
		case KEY_DOWN: this.controller.downKey = false; break;
		case KEY_LEFT: this.controller.leftKey = false; break;
		case KEY_RIGHT: this.controller.rightKey = false; break;
		case KEY_SHOOT_MAIN: this.controller.shootMainKey = false; break;
		case KEY_SHOOT_ALT: this.controller.shootAltKey = false; break;
	}
};
