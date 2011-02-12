var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var damageMap = {
	Laser: 1,
	Missile: 5,
	Spinner: 10,
	BigLaser: 100
};
var collisionMap = {
	Laser: { type: 'circle', radius: 5 },
	Missile: { type: 'circle', radius: 3 },
	TheOne: { type: 'circle', radius: 20 },
	TestEnemy: { type: 'circle', radius: 90 },
	Spinner: { type: 'circle', radius: 3 },
	BigLaser: { type: 'line', thickness: 15 }
};
var maxHealth = {
	TheOne: 50,
	TestEnemy: 500
};

function circleCollidesWithCircle(a, b) {
	var dx = a.position.x - b.position.x;
	var dy = a.position.y - b.position.y;
	var dr = collisionMap[a.type].radius + collisionMap[b.type].radius;
	return dx * dx + dy * dy < dr * dr;
}

function lineCollidesWithCircle(a, b) {
	return Math.abs(a.position.y - b.position.y) < collisionMap[a.type].thickness + collisionMap[b.type].radius;
}

function damageCollidesWithPlayer(damage, player) {
	// TODO: other types of collisions
	if (collisionMap[damage.type].type == 'line') {
		return lineCollidesWithCircle(damage, player);
	} else {
		return circleCollidesWithCircle(damage, player);
	}
}

function doDamage(entities) {
	// separate entities into ones that cause damage and ones that have health
	var damages = {}, players = {};
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var id = entity.playerId + ':' + entity.netId;
		if (entity.type in damageMap) {
			damages[id] = entity;
		} else {
			players[id] = entity;
		}
	}

	// TODO: O(n^2) collision
	var idsToRemove = {};
	for (var damageId in damages) {
		for (var playerId in players) {
			var damage = damages[damageId];
			var player = players[playerId];
			if (damage.playerId != player.playerId && damageCollidesWithPlayer(damage, player)) {
				player.serverDamage += damageMap[damage.type];
				var health = maxHealth[player.type] - player.clientDamage - player.serverDamage;
				if (health <= 0) idsToRemove[playerId] = true;
				idsToRemove[damageId] = true;
			}
		}
	}

	// remove dead entities
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var id = entity.playerId + ':' + entity.netId;
		var collision = collisionMap[entity.type];
		var isOffScreen = (collision.type == 'circle' && (
			entity.position.x < 0 || entity.position.x > GAME_WIDTH ||
			entity.position.y < 0 || entity.position.y > GAME_HEIGHT));
		if (id in idsToRemove || isOffScreen) {
			entities.splice(i--, 1);
		}
	}
}

exports.doDamage = doDamage;
