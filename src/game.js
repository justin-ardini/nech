var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;
var KEY_SHOOT_MAIN = 4;
var KEY_SHOOT_ALT = 5;
var KEY_SHIELD = 6;
var KEY_SHOOT_ALT2 = 6;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var classMap = { 
	'Laser': Laser,
	'TheOne': TheOne,
	'Missile': Missile,
	'TestEnemy': TestEnemy,
	'BigLaser': BigLaser,
	'Spinner': Spinner
};

function Game(playerId, type, pos) {
	this.nextNetId = 0;
	this.playerId = playerId;
	this.highlightAngle = 0;
	this.entities = [];
	this.paused = false;
	this.playerAlive = true;
	this.enemyAlive = true;

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
			this.entities.splice(i, 1);
			return;
		}
	}
};

Game.prototype.tick = function(seconds) {
	if (this.paused) return;

	this.playerAlive = false;
	this.enemyAlive = false;
	// update entities
	this.controller.tick(seconds);
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		entity.tick(seconds, this);
		if (entity instanceof TheOne) {
			this.playerAlive = true;
		}
		if (entity instanceof TestEnemy) {
			this.enemyAlive = true;
		}
		
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
		var e = {
			playerId: this.playerId,
			netId: entity.netId,
			type: type,
			position: { x: entity.position.x, y: entity.position.y },
			velocity: { x: entity.velocity.x, y: entity.velocity.y },
			angle: entity.angle,
			clientDamage: entity.clientDamage,
			serverDamage: entity.serverDamage
		};
		entity.onToServer(e);
		entities.push(e);
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
			var entity = oldMap[id];
			var e = newMap[id];
			entity.serverDamage = e.serverDamage;
			entity.seenFromServer = true;
			if (entity.playerId != this.playerId) {
				entity.clientDamage = e.clientDamage;
				entity.position.x = e.position.x;
				entity.position.y = e.position.y;
				entity.velocity.x = e.velocity.x;
				entity.velocity.y = e.velocity.y;
				entity.angle = e.angle;
				entity.onFromServer(e);
			}
		}
	}

	// remove entities that were removed
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		var id = entity.playerId + ':' + entity.netId;
		if (!(id in newMap) && entity.seenFromServer) {
			// let the entity know it's dead (for particles)
			entity.onDie(this);

			// remove entity from entities while simultaneously making sure we don't skip the next entity
			this.entities.splice(i--, 1);
		}
	}

	// add new entities
	for (var id in newMap) {
		if (!(id in oldMap)) {
			var e = newMap[id];

			if (e.playerId == this.playerId) {
				// don't let the server add entities for us (prevents a bug where we would
				// remove one of our entities only to have the server immediately add it back)
				continue;
			}

			var entity = new classMap[e.type](new Vector(e.position.x, e.position.y));
			entity.playerId = e.playerId;
			entity.netId = e.netId;
			entity.velocity = new Vector(e.velocity.x, e.velocity.y);
			entity.angle = e.angle;
			entity.health = e.health;
			entity.seenFromServer = true;
			entity.serverDamage = e.serverDamage;
			entity.clientDamage = e.clientDamage;
			entity.onFromServer(e);
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
		return;
	}
	var locals = 0, remotes = 0;
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (entity.playerId == this.playerId) locals++;
		else remotes++;
		entity.draw(c);
	}
	Particle.draw(c);

	if (!this.playerAlive && !this.enemyAlive) {
		c.textAlign = 'center';
		c.fillText("No one wins!", c.canvas.width / 2, c.canvas.height / 2);
	} else if (!this.playerAlive) {
		c.textAlign = 'center';
		c.fillText("Oh no, the bad guy won!", c.canvas.width / 2, c.canvas.height / 2);
	} else if (!this.enemyAlive) {
		c.textAlign = 'center';
		c.fillText("The good guy won!", c.canvas.width / 2, c.canvas.height / 2);
	}

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
		case KEY_SHIELD: this.controller.shieldKey = true; this.controller.shootAlt2Key = true; break;
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
		case KEY_SHIELD: this.controller.shieldKey = false; break;
		case KEY_SHOOT_ALT2: this.controller.shootAlt2Key = false; this.controller.shootAlt2Key = true; break;
	}
};

Game.prototype.containsEntity = function(entity) {
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] == entity) {
			return true;
		}
	}
	return false;
};
