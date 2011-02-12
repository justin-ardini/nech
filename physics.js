var damageMap = {
	'Laser': 1,
	'Missile': 5
};

function damageCollidesWithPlayer(damage, player) {
	// TODO
	return true;
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
