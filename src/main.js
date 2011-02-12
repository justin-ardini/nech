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

$(document).keydown(function(e) {
});

$(document).keyup(function(e) {
});
