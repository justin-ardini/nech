(function() {
	var c;
	var game = null;
	var lastTime;
	var fps = 0;

	function tick() {
		var currentTime = new Date();
		var seconds = (currentTime - lastTime) / 1000;
		lastTime = currentTime;

		// if the computer goes to sleep, act like the game was paused
		if (seconds > 0 && seconds < 1) {
			game.tick(seconds);
			fps = fps * 0.9 + 0.1 / seconds;
		}

		game.draw(c);

		var text = fps.toFixed() + ' FPS';
		c.fillStyle = 'black';
		c.fillText(text, c.canvas.width - c.measureText(text).width - 10, c.canvas.height - 10);
	}


	$(document).ready(function() {
		c = document.getElementById('canvas').getContext('2d');
		c.canvas.width = GAME_WIDTH;
		c.canvas.height = GAME_HEIGHT;
		lastTime = new Date();
		// TODO: Remove once networking works
		game = new Game(0, 'TheOne', new Vector(200, 200));
		tick();
		setInterval(tick, 1000 / 60);
		var socket = new io.Socket(null, { port: 80 }); // IMPORTANT. HAVE THE PORT CORRECT.
		socket.connect(); // Player joins a lobby

		socket.on('message', function(obj) {
			if (game === null) {
				var id = game['playerId']
				var type = game['type']
				var pos = new Vector(game['position'][0], game['position'][1]);
				// playerid, type, position
				if ('type' in obj) {
					// make a new game from netid
					game = new Game(id, type, pos);
				}
			} else {
				// netid, type, position, velocity
				game.receiveObject(obj);
			}
		});

		socket.on('disconnect', function(obj) {
			if (game !== null) {
				game.pause();
			}
		});
	});

	var JS_KEY_UP = 38;
	var JS_KEY_DOWN = 40;
	var JS_KEY_LEFT = 37;
	var JS_KEY_RIGHT = 39;
	var JS_KEY_SHOOT_MAIN = 'Z'.charCodeAt(0);
	var JS_KEY_SHOOT_ALT = 'X'.charCodeAt(0);

	$(document).keydown(function(e) {
		switch (e.which) {
			case JS_KEY_UP: game.keyDown(KEY_UP); break;
			case JS_KEY_DOWN: game.keyDown(KEY_DOWN); break;
			case JS_KEY_LEFT: game.keyDown(KEY_LEFT); break;
			case JS_KEY_RIGHT: game.keyDown(KEY_RIGHT); break;
			case JS_KEY_SHOOT_MAIN: game.keyDown(KEY_SHOOT_MAIN); break;
			case JS_KEY_SHOOT_ALT: game.keyDown(KEY_SHOOT_ALT); break;
			default: return;
		}

		// if we processed the key, don't let the browser use it too
		e.preventDefault();
	});

	$(document).keyup(function(e) {
		switch (e.which) {
			case JS_KEY_UP: game.keyUp(KEY_UP); break;
			case JS_KEY_DOWN: game.keyUp(KEY_DOWN); break;
			case JS_KEY_LEFT: game.keyUp(KEY_LEFT); break;
			case JS_KEY_RIGHT: game.keyUp(KEY_RIGHT); break;
			case JS_KEY_SHOOT_MAIN: game.keyUp(KEY_SHOOT_MAIN); break;
			case JS_KEY_SHOOT_ALT: game.keyUp(KEY_SHOOT_ALT); break;
			default: return;
		}

		// if we processed the key, don't let the browser use it too
		e.preventDefault();
	});
})();
