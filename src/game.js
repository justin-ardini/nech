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
	'Missile': Missile,
	'TestEnemy': TestEnemy
};

function Game(playerId, type, pos) {
	this.nextNetId = 0;
	player = new classMap[type](pos);
	player.playerId = playerId;
	player.netId = this.nextNetId++;

	this.playerId = playerId;
	this.highlightAngle = 0;
	this.locals = [player];
	this.remotes = [];
	this.controller = new PlayerController(this, player);
	this.paused = false;
}

Game.prototype.tick = function(seconds) {
	if (this.paused) return;

	// update locals
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

	// update remotes (these changes are just for smoothing over network lag,
	// the changes are discarded when new information comes from the server)
	for (var i = 0; i < this.remotes.length; i++) {
		this.remotes[i].tick(seconds);
	}

	// update the visuals
	this.highlightAngle += seconds * 0.1;
	Particle.tick(seconds);
};

Game.prototype.getMessageForServer = function() {
	var entities = [];
	for (var i = 0; i < this.locals.length; i++) {
		var local = this.locals[i];
		var type = '<not in classMap>';
		for (var className in classMap) {
			if (local instanceof classMap[className]) {
				type = className;
				break;
			}
		}
		entities.push({
			playerId: this.playerId,
			netId: local.netId,
			type: type,
			position: { x: local.position.x, y: local.position.y },
			velocity: { x: local.velocity.x, y: local.velocity.y },
			angle: local.angle
		});
	}
	return { entities: entities };
};

Game.prototype.setRemotesFromMessage = function(message) {
	// create maps of playerId:netId to the respective objects
	var oldMap = {}, newMap = {};
	for (var i = 0; i < this.remotes.length; i++) {
		var remote = this.remotes[i];
		oldMap[remote.playerId + ':' + remote.netId] = remote;
	}
	for (var i = 0; i < message.entities.length; i++) {
		var remote = message.entities[i];
		newMap[remote.playerId + ':' + remote.netId] = remote;
	}

	// update all existing entities
	for (var id in oldMap) {
		if (id in newMap) {
			var oldRemote = oldMap[id];
			var newRemote = newMap[id];
			oldRemote.position.x = newRemote.position.x;
			oldRemote.position.y = newRemote.position.y;
			oldRemote.velocity.x = newRemote.velocity.x;
			oldRemote.velocity.y = newRemote.velocity.y;
			oldRemote.angle = newRemote.angle;
		}
	}

	// remove entities that were removed
	for (var i = 0; i < this.remotes.length; i++) {
		var remote = this.remotes[i];
		var id = remote.playerId + ':' + remote.netId;
		if (!(id in newMap)) {
			// remove remote from remotes while simultaneously making sure we don't skip the next remote
			this.remotes.splice(i--, 1);
		}
	}

	// add new entities
	for (var id in newMap) {
		if (!(id in oldMap)) {
			var r = newMap[id];

			// don't add our own objects to remotes (they are already in locals)
			if (r.playerId == this.playerId) continue;

			var remote = classMap[r.type](new Vector(r.position.x, r.position.y));
			remote.playerId = r.playerId;
			remote.netId = r.netId;
			remote.velocity = new Vector(r.velocity.x, r.velocity.y);
			remote.angle = r.angle;
			this.remotes.push(remote);
		}
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
	c.fillText(text, c.canvas.width - c.measureText(text).width - 10, c.canvas.height - 10);

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
