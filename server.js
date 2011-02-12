var physics = require('./physics');
var sys = require('sys')
	, url = require('url')
	, http = require('http')
	, io = require('socket.io')
	, PORT = 8080 // MAKE SURE THIS IS SAME AS SOCKET.IO

	, static = require('node-static')
	// Create a node-static server to serve the current directory
	, fileServer = new static.Server('./www', { cache: 7200, headers: {'X-Hello':'Starting static server!'} })


var httpServer = http.createServer(function (request, response) {
	/* If we need multiple paths
    var path = url.parse(request.url).pathname;
    switch(path) {
		case '/':
		...
	}); */
	fileServer.serve(request, response, function (err, res) {
		if (err) {
			sys.error('> Error serving ' + request.url + ' - ' + err.message);
			fileServer.serveFile('/404.html', err.headers, err.headers, request, response);
		}
	});
});


httpServer.listen(PORT);
console.log('> Server is listening on http://localhost:' + PORT);


/*****************************************************************/
// All the socket.io
var socket = io.listen(httpServer);
var clients = [];
var NUM_CLIENTS = 2;
// mapping of clients to entities held by that client

// Start a new game, giving the player role to the first one who joined
// Assumes NUM_CLIENTS clients
startGame = function() {
	console.log('Starting the game with ' + NUM_CLIENTS + ' clients.');
	clients[0].send({ playerId: 0, type: 'TheOne', position: [100, 100] });
	clients[1].send({ playerId: 1, type: 'TestEnemy', position: [500, 200] });
	for (var i = 0; i < clients.length; ++i) {
		clients[i].playerId = i;
		clients[i].entities = [];
	}
	var fps = 10;
	setInterval(pushUpdates, 1000 / fps);
}

// Push updates to all clients
pushUpdates = function() {
	var len = clients.length;
	var entities = [];
	for (var i = 0; i < len; ++i) {
		for (var index in clients[i].entities) {
			entities.push(clients[i].entities[index]);
		}
	}
	
	physics.doDamage(entities);
	
	for (var i = 0; i < len; ++i) {
		clients[i].send({entities: entities});
	}
}

socket.on('connection', function(client) {
	if (clients.length >= NUM_CLIENTS) {
		return;
	}
	clients.push(client);
	if (clients.length === NUM_CLIENTS) {
		startGame(this);
	}

	// Update list of entities for that client
	client.on('message', function(message) {
		// console.log('Received message from client ' + this.playerId);
		if (message.entities.length > 0) {
			var playerId = message.entities[0].playerId;
			if (clients[playerId] !== undefined) {
				clients[playerId].entities = message.entities;
			}
		}
	});

	// Remove the client
	client.on('disconnect', function() {
		for (var i = 0; i < clients.length; ++i) {
			if (this === clients[i]) {
				console.log('Removing client #' + i);
				clients.splice(i, 1);
			}
		}
	});
});

