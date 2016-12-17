var socket = io.connect();

var player;
var turn;

socket.on('welcome', function () {
	$('.warning-message').html('Welcome to the game!');
});

socket.on('full', function () {
	//$('.warning-message').html('The room is currently full.');
	window.alert('The room is currently full');
});

socket.on('wait', function () {
	$('.warning-message').html(" Please hold while we get another player to join the game...");
});

socket.on('initialize-player', function (playerId) {
	player = playerId;
	if (player === 1) {
		$('.symbol').html('Your symbol is: x');
	} else if (player === 2) {
		$('.symbol').html('Your symbol is: o');
	}
});


socket.on('update-turn', function (playerId) {
	if (playerId === player) {
		turn = true;
		$('.turn').html('Your turn!');
	} else {
		turn = false;
		$('.turn').html('Opponent\'s turn!');
	}
	$('.element').click( function () {
		if (turn) {
			var id = $(this).attr('id');
			socket.emit('update-board', id, player);
		} else {
			$('.warning-message').html('It\'s not your turn yet!');
		}
	});
});

socket.on('update-state', function (index, player) {
	var sampleSrc;
	if (player === 1) {
		sampleSrc = $('.sample-x img').attr('src');
	} else if (player === 2) {
		sampleSrc = $('.sample-o img').attr('src');
	}
	$('#'+index).css('background-image', 'url(' + sampleSrc + ')');
});


$('.enter-room').click(function () {
	var roomId = $('#room-input').val();
	if (roomId === undefined || roomId === "") {
		window.alert('Please enter a non-empty room name');
	} else {
		socket.emit('join-room', roomId);
		$('.room').html('Room: ' + roomId);
	}
	$('#room-input').val('');
});

socket.on('ready', function () {
	$('.warning-message').html('Your game is ready to be played!');
	socket.emit('in-game');
});

socket.on('end-game', function (winner) {
	var winner = winner;
	if (winner === player) {
		$('.warning-message').html('Congratulations, you have won! Play again to get even better!');
	} else {
		$('.warning-message').html('You have lost. But there\'s always a next time, play again!');
	}
	socket.disconnect();
});

socket.on('error', function () {
	window.alert('There has been an error. Please refresh your page.');
});
