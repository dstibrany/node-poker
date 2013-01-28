var http        = require('http');
var express     = require('express');
var app         = express();
var server      = http.createServer(app);
var game_server = require('./game_server');

game_server.init(server);

app.use(express.logger());
app.use(express.static('public'));

server.listen(3000, function() {
    console.log('Listening on port 3000');
});
