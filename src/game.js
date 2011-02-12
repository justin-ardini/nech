var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;
var KEY_SHOOT_MAIN = 4;
var KEY_SHOOT_ALT = 5;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var classMap = { 
	'Laser': Laser,
	'TheOne': TheOne,
	'Missile': Missile,
	'TestEnemy': TestEnemy,
	'BigLaser': BigLaser
};

function Game(playerId, type, pos) {
	this.nextNetId = 0;
	this.playerId = playerId;
	this.highlightAngle = 0;
	this.entities = [];
	this.paused = false;

	var player = new classMap[type](pos);
	this.controller = new PlayerController(this, player);
	this.addEntity(player);
}

Game.prototype.addEntity = function(entity) {
	entity.playerId = this.playerId;
	entity.netId = this.nextNetId++;
	this.entities.push(entity);
};

Game.prototype.removeEntity = function(entity) {
	for (var i = 0; i < this.entities.length; ++i) {
		if (entity == this.entities[i]) {
			this.entities[i].splice(i, 1);
		}
	}
};

Game.prototype.tick = function(seconds) {
	if (this.paused) return;

	// update entities
	this.controller.tick(seconds);
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		entity.tick(seconds);
		
		// keep players within bounds
		if (entity.maxHealth > 0) {
			entity.position.x = Math.max(entity.radius, Math.min(GAME_WIDTH - entity.radius, entity.position.x));
			entity.position.y = Math.max(entity.radius, Math.min(GAME_HEIGHT - entity.radius, entity.position.y));
		}
	}

	// update the visuals
	this.highlightAngle += seconds * 0.1;
	Particle.tick(seconds);
};

Game.prototype.getMessageForServer = function() {
	var entities = [];
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (entity.playerId != this.playerId) continue;
		var type = '<not in classMap>';
		for (var className in classMap) {
			if (entity instanceof classMap[className]) {
				type = className;
				break;
			}
		}
		entities.push({
			playerId: this.playerId,
			netId: entity.netId,
			type: type,
			position: { x: entity.position.x, y: entity.position.y },
			velocity: { x: entity.velocity.x, y: entity.velocity.y },
			angle: entity.angle,
			health: entity.health
		});
	}
	return { playerId: this.playerId, entities: entities };
};

Game.prototype.setRemotesFromMessage = function(message) {
	// create maps of playerId:netId to the respective objects
	var oldMap = {}, newMap = {};
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		oldMap[entity.playerId + ':' + entity.netId] = entity;
	}
	for (var i = 0; i < message.entities.length; i++) {
		var entity = message.entities[i];
		newMap[entity.playerId + ':' + entity.netId] = entity;
	}

	// update all existing entities
	for (var id in oldMap) {
		if (id in newMap) {
			var oldEntity = oldMap[id];
			var newEntity = newMap[id];
			if (oldEntity.playerId != this.playerId) {
				oldEntity.position.x = newEntity.position.x;
				oldEntity.position.y = newEntity.position.y;
				oldEntity.velocity.x = newEntity.velocity.x;
				oldEntity.velocity.y = newEntity.velocity.y;
				oldEntity.angle = newEntity.angle;
			}
			oldEntity.health = newEntity.health;
			oldEntity.seenFromServer = true;
		}
	}

	// remove entities that were removed
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		var id = entity.playerId + ':' + entity.netId;
		if (!(id in newMap) && entity.seenFromServer) {
			// remove entity from entities while simultaneously making sure we don't skip the next entity
			this.entities.splice(i--, 1);
		}
	}

	// add new entities
	for (var id in newMap) {
		if (!(id in oldMap)) {
			var e = newMap[id];
			var entity = new classMap[e.type](new Vector(e.position.x, e.position.y));
			entity.playerId = e.playerId;
			entity.netId = e.netId;
			entity.velocity = new Vector(e.velocity.x, e.velocity.y);
			entity.angle = e.angle;
			entity.health = e.health;
			entity.seenFromServer = true;
			this.entities.push(entity);
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

	c.fillStyle = 'black';
	c.strokeStyle = 'black';
	if (this.paused) {
		c.textAlign = 'center';
		c.fillText("Sorry, you were disconnected.", c.canvas.width / 2, c.canvas.height / 2);
	}
	var locals = 0, remotes = 0;
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (entity.playerId == this.playerId) locals++;
		else remotes++;
		entity.draw(c);
	}
	Particle.draw(c);

	c.fillStyle = 'black';
	c.textAlign = 'right';
	c.fillText(locals + ' locals, ' + remotes + ' remotes', c.canvas.width - 10, c.canvas.height - 10);
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
