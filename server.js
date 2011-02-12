var sys = require('sys')
	, url = require('url')
	, http = require('http')
	, io = require('socket.io')
	, PORT = 80 // MAKE SURE THIS IS SAME AS SOCKET.IO

	, static = require('node-static')
	// Create a node-static server to serve the current directory
	, fileServer = new static.Server('./public', { cache: 7200, headers: {'X-Hello':'Starting static server!'} })


var httpServer = http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<h1>Welcome!</h1>');

	/* If we need multiple paths
    var path = url.parse(request.url).pathname;

    switch(path) {
		case '/':

			break;
		...
	});
	*/
}

// If page isn't found
send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};


httpServer.listen(PORT);
console.log('> Server is listening on http://127.0.0.1:' + PORT);


/*****************************************************************/
// All the socket.io
var socket = io.listen(httpServer);

socket.on('connection', function(client) {

	client.on('connect', function(message) {
		// Possibly broadcast added client
		// var len = listener.clients.length;
		// for (var i = 0; i < len; ++i) {
		//		if (listener.clients[i] !== null) {
		//			listener.clients[count].send(json({ action: 'fetch' }));
		//		}
		// }

	client.on('message', function(message) {
		// Broadcast message to all clients
		client.broadcast(message);
	});

	client.on('disconnect', function() {
		// Handle disconnected client
	});
});

