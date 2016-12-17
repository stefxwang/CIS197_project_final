var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var gameBoard = new Array(9); //boolean array keeping track of which boxes are filled
//var boardSize = 9;
var rooms = new Array();
var currRoom;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
	console.log('Listening on port ' + port);
	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

	socket.emit('welcome');
	socket.on('join-room', function (room) {
		var roomSet = io.sockets.adapter.rooms;
		var roomSize;
		//check if such a room exists, if not create one
		if (roomSet[room]) {
			roomSize = roomSet[room].length;
		} else {
			socket.join(room);
			socket.emit('wait');
			socket.emit('initialize-player', 1);
			var newRoom = {
				roomName: room,
				turn: 1,
			};
			currRoom = newRoom;
			rooms.push(newRoom);
		}
		//check size of room and act accordingly
		if (roomSize === 2) {
			socket.emit('full');
		} else if (roomSize === 1){
			socket.join(room);
			socket.emit('initialize-player', 2);
			io.emit('ready', 'everyone');
			var newRoom = {
				roomName: room,
				player: 1,
			};
			currRoom = newRoom;
			rooms.push(newRoom);
		}
	});
	socket.on('in-game', function () {
		socket.emit('update-turn', currRoom.player);
		currRoom.player = switchPlayer(currRoom.player);
	});
	socket.on('update-board', function (index, player) {
		//check if already filled
		var player = player;
		if (gameBoard[index] === undefined) {
			io.emit('update-state', index, player, 'everyone');
			if (player === 1) {
				gameBoard[index] = 'x';
			} else {
				gameBoard[index] = 'o';
			}
		}
		var winner = winCondition();
		if (winner !== undefined) {
			io.emit('end-game', winner, 'everyone');
			gameBoard = new Array(9);
		}
	});
});

var winCondition = function() {
	var winner;
	if (gameBoard['i0'] !== undefined && gameBoard['i1'] !== undefined && gameBoard['i2'] !== undefined && 
		gameBoard['i0'] === gameBoard['i1'] && gameBoard['i0'] === gameBoard['i2']) {
		if (gameBoard['i0'] === 'x') {
			winner = 1
		} else if (gameBoard['i0'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i0'] !== undefined && gameBoard['i3'] !== undefined && gameBoard['i6'] !== undefined && 
		gameBoard['i0'] === gameBoard['i3'] && gameBoard['i0'] === gameBoard['i6']) {
		if (gameBoard['i0'] === 'x') {
			winner = 1
		} else if (gameBoard['i0'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i0'] !== undefined && gameBoard['i4'] !== undefined && gameBoard['i8'] !== undefined && 
		gameBoard['i0'] === gameBoard['i4'] && gameBoard['i0'] === gameBoard['i8']) {
		if (gameBoard['i0'] === 'x') {
			winner = 1
		} else if (gameBoard['i0'] === 'o'){
			winner = 2;
		}
	}  else if (gameBoard['i2'] !== undefined && gameBoard['i5'] !== undefined && gameBoard['i8'] !== undefined && 
		gameBoard['i2'] === gameBoard['i5'] && gameBoard['i2'] === gameBoard['i8']) {
		if (gameBoard['i2'] === 'x') {
			winner = 1
		} else if (gameBoard['i2'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i6'] !== undefined && gameBoard['i7'] !== undefined && gameBoard['i8'] !== undefined && 
		gameBoard['i6'] === gameBoard['i7'] && gameBoard['i6'] === gameBoard['i8']) {
		if (gameBoard['i6'] === 'x') {
			winner = 1
		} else if (gameBoard['i6'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i2'] !== undefined && gameBoard['i4'] !== undefined && gameBoard['i6'] !== undefined && 
		gameBoard['i2'] === gameBoard['i4'] && gameBoard['i2'] === gameBoard['i6']) {
		if (gameBoard['i2'] === 'x') {
			winner = 1
		} else if (gameBoard['i2'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i1'] !== undefined && gameBoard['i4'] !== undefined && gameBoard['i7'] !== undefined && 
		gameBoard['i1'] === gameBoard['i4'] && gameBoard['i1'] === gameBoard['i7']) {
		if (gameBoard['i1'] === 'x') {
			winner = 1
		} else if (gameBoard['i1'] === 'o'){
			winner = 2;
		}
	} else if (gameBoard['i3'] !== undefined && gameBoard['i4'] !== undefined && gameBoard['i5'] !== undefined && 
		gameBoard['i3'] === gameBoard['i4'] && gameBoard['i3'] === gameBoard['i5']) {
		if (gameBoard['i3'] === 'x') {
			winner = 1
		} else if (gameBoard['i3'] === 'o'){
			winner = 2;
		}
	}  
	return winner;
};

var switchPlayer = function(player) {
	if (player === 1) {
		player = 2;
	} else if (player === 2) {
		player = 1;
	}
	return player;
};

server.listen(port, function () {
	console.log('Listening on port ' + port);
});

module.exports = app;