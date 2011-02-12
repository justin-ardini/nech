__extends__(TestEnemy, Entity);

function TestEnemy() {
	Entity.prototype.constructor.call(this);
}

TestEnemy.prototype.drawImpl = function(c) {
	c.fillStyle = 'black';
	c.beginPath();
	c.lineTo(-20, -20);
	c.lineTo(+20, -20);
	c.lineTo(+20, +20);
	c.lineTo(-20, +20);
	c.fill();
};
