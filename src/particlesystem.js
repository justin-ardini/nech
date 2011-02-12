// Particles are statically allocated in a big array so that creating a
// new particle doesn't need to allocate any memory (for speed reasons).
// To create one, call Particle(), which will return one of the elements
// in that array with all values reset to defaults.  To change a property
// use the function with the name of that property.  Some property functions
// can take two values, which will pick a random number between those numbers.

// enum ParticleType
var PARTICLE_CIRCLE = 0;
var PARTICLE_TRIANGLE = 1;
var PARTICLE_LINE = 2;
var PARTICLE_CUSTOM = 3;

function randOrTakeFirst(min, max) {
	return (typeof max !== 'undefined') ? randInRange(min, max) : min;
}

function cssRGBA(r, g, b, a) {
	return 'rgba(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ', ' + a + ')';
}

function ParticleInstance() {
}

ParticleInstance.prototype.init = function() {
	// must use 'm_' here because many setting functions have the same name as their property
	this.m_type = 0;
	this.m_radius = 0;
	this.m_expand = 1;
	this.m_position = new Vector(0, 0);
	this.m_velocity = new Vector(0, 0);
	this.m_angle = 0;
	this.m_angularVelocity = 0;
	this.m_drawFunc = null;
};

ParticleInstance.prototype.tick = function(seconds) {
	this.m_radius *= Math.pow(this.m_expand, seconds);
	this.m_position = this.m_position.add(this.m_velocity.mul(seconds));
	return this.m_radius >= 0.5;
};

ParticleInstance.prototype.draw = function(c) {
	switch(this.m_type) {
	case PARTICLE_CIRCLE:
		c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
		c.beginPath();
		c.arc(this.m_position.x, this.m_position.y, this.m_radius, 0, 2 * Math.PI, false);
		c.fill();
		break;

	case PARTICLE_TRIANGLE:
		var v1 = this.m_position.add(this.m_velocity.mul(0.04));
		var v2 = this.m_position.sub(this.m_velocity.flip().mul(0.01));
		var v3 = this.m_position.add(this.m_velocity.flip().mul(0.01));
		c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
		c.beginPath();
		c.moveTo(v1.x, v1.y);
		c.lineTo(v2.x, v2.y);
		c.lineTo(v3.x, v3.y);
		c.closePath();
		c.fill();
		break;
		
	case PARTICLE_LINE:
		var dx = Math.cos(this.m_angle) * this.m_radius;
		var dy = Math.sin(this.m_angle) * this.m_radius;
		c.strokeStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
		c.beginPath();
		c.moveTo(this.m_position.x - dx, this.m_position.y - dy);
		c.lineTo(this.m_position.x + dx, this.m_position.y + dy);
		c.stroke();
		break;
		
	case PARTICLE_CUSTOM:
		c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
		c.save();
		c.translate(this.m_position.x, this.m_position.y);
		c.rotate(this.m_angle);
		this.m_drawFunc(c);
		c.restore();
		break;
	}
};

// all of these functions support chaining to fix constructor with 200 arguments
ParticleInstance.prototype.circle = function() { this.m_type = PARTICLE_CIRCLE; return this; };
ParticleInstance.prototype.triangle = function() { this.m_type = PARTICLE_TRIANGLE; return this; };
ParticleInstance.prototype.line = function() { this.m_type = PARTICLE_LINE; return this; };
ParticleInstance.prototype.custom = function(drawFunc) { this.m_type = PARTICLE_CUSTOM; this.m_drawFunc = drawFunc; return this; };
ParticleInstance.prototype.radius = function(min, max) { this.m_radius = randOrTakeFirst(min, max); return this; };
ParticleInstance.prototype.expand = function(min, max) { this.m_expand = randOrTakeFirst(min, max); return this; };
ParticleInstance.prototype.angle = function(min, max) { this.m_angle = randOrTakeFirst(min, max); return this; };
ParticleInstance.prototype.angularVelocity = function(min, max) { this.m_angularVelocity = randOrTakeFirst(min, max); return this; };
ParticleInstance.prototype.position = function(position) { this.m_position = position; return this; };
ParticleInstance.prototype.velocity = function(velocity) { this.m_velocity = velocity; return this; };

// wrap in anonymous function for private variables
var Particle = (function() {
	// particles is an array of ParticleInstances where the first count are in use
	var particles = new Array(3000);
	var maxCount = particles.length;
	var count = 0;

	for (var i = 0; i < particles.length; i++) {
		particles[i] = new ParticleInstance();
	}

	function Particle() {
		var particle = (count < maxCount) ? particles[count++] : particles[maxCount - 1];
		particle.init();
		return particle;
	}

	Particle.reset = function() {
		count = 0;
	};

	Particle.tick = function(seconds) {
		for (var i = 0; i < count; i++) {
			var isAlive = particles[i].tick(seconds);
			if (!isAlive) {
				// swap the current particle with the last active particle (this will swap with itself if this is the last active particle)
				var temp = particles[i];
				particles[i] = particles[count - 1];
				particles[count - 1] = temp;
				
				// forget about the dead particle that we just moved to the end of the active particle list
				count--;
				
				// don't skip the particle that we just swapped in
				i--;
			}
		}
	};

	Particle.draw = function(c) {
		for (var i = 0; i < count; i++) {
			var particle = particles[i];
			var pos = particle.m_position;
			particle.draw(c);
		}
	};

	return Particle;
})();

function ParticleEmitter(timeBetweenTicks, onEmit) {
	this.timeBetweenTicks = timeBetweenTicks;
	this.onEmit = onEmit;
	this.timer = 0;
}

ParticleEmitter.prototype.tick = function(seconds) {
	this.timer += seconds;
	while (this.timer > 0) {
		this.timer -= this.timeBetweenTicks;
		this.onEmit();
	}
};
