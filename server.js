const UP_ARROW = 0;
const RIGHT_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;
const MOVEMENT = 7;

var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
//var io = require('socket.io')(httpServer);
var io = require('socket.io').listen(httpServer);
//console.log(io);

//io.set('log level', 1);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

httpServer.lastPlayerID = 0;

httpServer.listen(8081, function () {
    console.log('Listening on ' + httpServer.address().port);
});

io.on('connection', function (socket) {
    console.log("Connected!");
    socket.on('newplayer', function () {
        console.log("New player received");
        if (httpServer.lastPlayerID < 2) {
            httpServer.lastPlayerID++;
            if (httpServer.lastPlayerID == 1) {
                var x = 400;
                var y = 200;

                socket.player = {
                    id: httpServer.lastPlayerID,
                    x: x,
                    y: y,
                    phrase: {}
                };
            } else if (httpServer.lastPlayerID == 2) {
                var x = 400;
                var y = 600;

                socket.player = {
                    id: httpServer.lastPlayerID,
                    x: x,
                    y: y,
                    phrase: {}
                };
            }
            socket.emit('allplayers', getAllPlayers());
            socket.emit('you', socket.player.id);
            //console.log(getAllPlayers());
            socket.broadcast.emit('newplayer', socket.player);

        }

        socket.on('move', function (data) {
            // Update this player's recorded position in server's socket object
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.broadcast.emit('move', socket.player);
        });

        socket.on('phrase', function (data) {
            socket.player.phrase = data;
            console.log(socket.player.phrase);
            console.log(socket.player);
            io.emit('phrase', socket.player);
        });

        socket.on('1compare', function (data) {
            httpServer.p1data = data;
            if (httpServer.p2data) {
                if (httpServer.p1data.word == httpServer.p2data.word) {
                    console.log("word match");
                    //for loop?
                    //this loop has to go through the length of phrase
                    //if index of one does not = index of other exit loop
                    //if loop can successfully check up to length then send match message 
                    var size1 = Object.keys(httpServer.p1data.phrase).length - 1;
                    var size2 = Object.keys(httpServer.p2data.phrase).length - 1;
                    if (size1 && size2 >= 0) {
                        if (size1 == size2) {
                            for (var i = 0; i <= size1; i++) {
                                if (httpServer.p1data.phrase[i] != httpServer.p2data.phrase[i]) {
                                    console.log("no match");
                                    return;
                                }
                                if (i == size1) {
                                    console.log("matching phrases");
                                    io.emit("match", httpServer.p1data);
                                }
                            }

                        } else {
                            console.log("no match");
                        }
                    } else {
                        console.log("no match");
                    }
                }
            }
        });

        socket.on('2compare', function (data) {
            httpServer.p2data = data;
            if (httpServer.p1data) {
                if (httpServer.p2data.word == httpServer.p1data.word) {
                    console.log("word match");

                    var size1 = Object.keys(httpServer.p1data.phrase).length - 1;
                    var size2 = Object.keys(httpServer.p2data.phrase).length - 1;
                    if (size1 && size2 >= 0) {
                        if (size1 == size2) {
                            for (var i = 0; i <= size1; i++) {
                                if (httpServer.p1data.phrase[i] != httpServer.p2data.phrase[i]) {
                                    console.log("no match");
                                    return;
                                }
                                if (i == size1) {
                                    console.log("matching phrases");
                                    io.emit("match", httpServer.p1data);
                                }
                            }

                        } else {
                            console.log("no match");
                        }
                    } else {
                        console.log("no match");
                    }
                }
            }

        });

        socket.on('endspeech', function () {
            io.emit('endspeech');
        });

        socket.on('disconnect', function () {
            if (socket.player) {
                io.emit('remove', socket.player.id);
            }
        });
    });
});


function getAllPlayers() {
    var collectedPlayers = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var currentPlayer = io.sockets.connected[socketID].player;
        if (currentPlayer != null) {
            collectedPlayers.push(currentPlayer);
        }
    });
    return collectedPlayers;
}


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}