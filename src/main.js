var c;
var game;
var lastTime;

function tick() {
	var currentTime = new Date();
	var seconds = (currentTime - this.lastTime) / 1000;
	lastTime = currentTime;

	// if the computer goes to sleep, act like the game was paused
	if (seconds > 0 && seconds < 1) game.tick(seconds); 

	game.draw(c);
}

$(document).ready(function() {
	c = document.getElementById('canvas').getContext('2d');
	c.canvas.width = 800;
	c.canvas.height = 600;
	game = new Game();
	tick();
	setInterval(tick, 1000 / 60);
});

$(document).keydown(function(e) {
});

$(document).keyup(function(e) {
});
