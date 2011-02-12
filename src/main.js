var c;
var game;
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
	c.canvas.width = 800;
	c.canvas.height = 600;
	game = new Game();
	lastTime = new Date();
	tick();
	setInterval(tick, 1000 / 60);
});

var JS_KEY_UP = 38;
var JS_KEY_DOWN = 40;
var JS_KEY_LEFT = 37;
var JS_KEY_RIGHT = 39;

$(document).keydown(function(e) {
	switch (e.which) {
		case JS_KEY_UP: game.keyDown(KEY_UP); break;
		case JS_KEY_DOWN: game.keyDown(KEY_DOWN); break;
		case JS_KEY_LEFT: game.keyDown(KEY_LEFT); break;
		case JS_KEY_RIGHT: game.keyDown(KEY_RIGHT); break;
	}
});

$(document).keyup(function(e) {
	switch (e.which) {
		case JS_KEY_UP: game.keyUp(KEY_UP); break;
		case JS_KEY_DOWN: game.keyUp(KEY_DOWN); break;
		case JS_KEY_LEFT: game.keyUp(KEY_LEFT); break;
		case JS_KEY_RIGHT: game.keyUp(KEY_RIGHT); break;
	}
});
