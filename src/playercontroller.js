function PlayerController(entity) {
	this.entity = entity;

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
}

PlayerController.prototype.tick = function(seconds) {
	var speed = 100;
	if (this.upKey) {
		this.entity.center.y -= speed * seconds;
	}
	if (this.downKey) {
		this.entity.center.y += speed * seconds;
	}
	if (this.leftKey) {
		this.entity.center.x -= speed * seconds;
	}
	if (this.rightKey) {
		this.entity.center.x += speed * seconds;
	}
};
