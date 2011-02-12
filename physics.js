var damageMap = {
	Laser: 1,
	Missile: 5
};
var collisionMap = {
	Laser: { type: 'circle', radius: 5 },
	Missile: { type: 'circle', radius: 3 },
	TheOne: { type: 'circle', radius: 20 },
	TestEnemy: { type: 'circle', radius: 90 }
};

function circleCollidesWithCircle(a, b) {
	var dx = a.position.x - b.position.x;
	var dy = a.position.y - b.position.y;
	var dr = collisionMap[a.type].radius + collisionMap[b.type].radius;
	return dx * dx + dy * dy < dr * dr;
}

function damageCollidesWithPlayer(damage, player) {
	// TODO: other types of collisions
	return circleCollidesWithCircle(damage, player);
}

function doDamage(entities) {
	// separate entities into ones that cause damage and ones that have health
	var damages = {}, players = {};
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var id = entity.playerId + ':' + entity.netId;
		if (entity.health) {
			players[id] = entity;
		} else if (entity.type in damageMap) {
			damages[id] = entity;
		}
	}

	// TODO: O(n^2) collision
	for (var damageId in damages) {
		for (var playerId in players) {
			var damage = damages[damageId];
			var player = players[playerId];
			if (damage.playerId != player.playerId && damageCollidesWithPlayer(damage, player)) {
				player.health -= damageMap[damage.type];
			}
		}
	}
}

exports.doDamage = doDamage;