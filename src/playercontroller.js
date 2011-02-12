function PlayerController(entity) {
	this.entity = entity;

	// these will automatically be set by Game
	this.upKey = false;
	this.downKey = false;
	this.leftKey = false;
	this.rightKey = false;
}

PlayerController.prototype.tick = function(seconds) {
	var speed = 300;
	if (this.upKey) {
		this.entity.position.y -= speed * seconds;
	}
	if (this.downKey) {
		this.entity.position.y += speed * seconds;
	}
	if (this.leftKey) {
		this.entity.position.x -= speed * seconds;
	}
	if (this.rightKey) {
		this.entity.position.x += speed * seconds;
	}
};
