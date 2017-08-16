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

httpServer.totalPlayerCount = 0;
httpServer.lastPlayerID = 0;
httpServer.definitions = {};
httpServer.definitionIndex = 0;
httpServer.roomArray = [];

httpServer.listen(8005, function () {
    console.log('Listening on ' + httpServer.address().port);
});

io.on('connection', function (socket) {

    socket.on('inMainGame', function () {
        console.log("Connected!");
        httpServer.totalPlayerCount++;
        var n = httpServer.totalPlayerCount / 2
        var roomnum = Math.ceil(n).toString();
        socket.join(roomnum);
        io.sockets.in(roomnum).emit('yourRoomNum', roomnum);
    });


    socket.on('newplayer', function (roomname) {
        console.log("new player on server");
        httpServer.lastPlayerID++;
        if (httpServer.lastPlayerID % 2 != 0) {
            var x = 350;
            var y = 300;

            socket.player = {
                id: 1,
                x: x,
                y: y,
                phrase: {}
            };
            console.log("should be 1: " + socket.player.id);
        } else if (httpServer.lastPlayerID % 2 == 0) {
            var x = 1100;
            var y = 700;

            socket.player = {
                id: 2,
                x: x,
                y: y,
                phrase: {}
            };
            console.log("should be 2: " + socket.player.id);
        };
        socket.emit('allplayers', getAllPlayers(roomname));
        //you is not only going to the requested client
        socket.emit('you', socket.player.id);
        socket.broadcast.to(roomname).emit('newplayer', socket.player);


        socket.on('move', function (data) {
            // Update this player's recorded position in server's socket object
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.broadcast.to(roomname).emit('move', socket.player);
        });

        socket.on('click', function (data) {
            io.sockets.in(roomname).emit('click', data);
        });

        socket.on('emote', function (data) {
            io.sockets.in(roomname).emit('emote', data);
        });

        socket.on('phrase', function (data) {
            socket.player.phrase = data;
            console.log(socket.player.phrase);
            console.log(socket.player);
            io.sockets.in(roomname).emit('phrase', socket.player);
        });

        socket.on('onPlayerforCompare', function (data) {
            console.log(data.phrase);
            if (httpServer.roomArray[data.room] == undefined) {
                httpServer.roomArray[data.room] = new Room();
                if (data.id == 1) {
                    httpServer.roomArray[data.room].player1 = new Player(data);
                }
                if (data.id == 2) {
                    httpServer.roomArray[data.room].player2 = new Player(data);
                }
            }
            if (httpServer.roomArray[data.room] != undefined) {
                if (data.id == 1) {
                    httpServer.roomArray[data.room].player1 = new Player(data);
                }
                if (data.id == 2) {
                    httpServer.roomArray[data.room].player2 = new Player(data);
                }
            }
            Compare1(data);
        });

        socket.on('othercheckbox', function (data) {
            console.log("server receives for othercheckbox");
            socket.broadcast.to(roomname).emit('othercheckbox', data);
        });

        socket.on('dictionaryopen', function () {
            io.sockets.in(roomname).emit('dictionaryopen', socket.player.id);
        });

        socket.on('dictionaryclose', function () {
            io.sockets.in(roomname).emit('dictionaryclose', socket.player.id);
        });

        socket.on('endspeech', function () {
            io.sockets.in(roomname).emit('endspeech');
        });

        socket.on('disconnect', function () {
            if (socket.player) {
                io.sockets.in(roomname).emit('remove', socket.player.id);
            }
        });
    });
});


function Room() {
    this.player1;
    this.player2;
    this.definitions = {};
    this.definitionindex = 0;
}

function Player(data) {
    this.phrase = data.phrase;
    this.page = data.page;
    this.word = data.word;
    this.room = data.room;
}

function Compare1(data) {
    if (httpServer.roomArray[data.room].player1) {
        var p1data = httpServer.roomArray[data.room].player1
    }
    if (httpServer.roomArray[data.room].player2) {
        var p2data = httpServer.roomArray[data.room].player2
    }
    if (p1data && p2data) {

        if (p1data.word == p2data.word) {
            console.log("word match");
            console.log(p1data.phrase);
            console.log(p2data.phrase);
            var size1 = Object.keys(p1data.phrase).length - 1;
            var size2 = Object.keys(p2data.phrase).length - 1;
            if (size1 >= 0 && size2 >= 0) {
                console.log("word length acceptable");
                if (p1data.page == p2data.page) {
                    if (size1 == size2) {
                        console.log("sizes equal");
                        for (var i = 0; i <= size1; i++) {
                            if (p1data.phrase[i] != "" && p2data.phrase[i] != "") {
                                if (p1data.phrase[i] != p2data.phrase[i]) {
                                    console.log("no match" + p1data.phrase[i] + " " + p2data.phrase[i]);
                                    return;
                                }
                                if (i == size1) {
                                    console.log("content the same");
                                    console.log(p2data.phrase);
                                    compare2(p1data, p2data, httpServer.roomArray[data.room]);
                                }

                            }
                        }

                    } else {
                        console.log("no match, sizes not equal");
                    }
                } else {
                    console.log("not on same page");
                }
            } else {
                console.log("no match, sizes not greater than or equal to 0");
            }
        }
    }

};

function compare2(p1data, p2data, roomobject) {
    if (!isEmpty(roomobject.definitions)) {
        var defsize = Object.keys(roomobject.definitions).length - 1;
        console.log(defsize);
        for (var i = 0; i <= defsize; i++) {
            console.log("definition" + roomobject.definitions[i].phrase);
            console.log("phrase " + p1data.phrase);
            console.log("for loop to check repeat working..");
            if (roomobject.definitions[i].phrase.toString() == p1data.phrase.toString()) {
                console.log("This phrase is already taken");
                return;
            }
            if (i == defsize) {
                console.log("matching phrases");
                roomobject.definitions[roomobject.definitionindex] = {
                    word: p2data.word,
                    phrase: p2data.phrase,
                    page: p2data.phrase
                };
                roomobject.definitionindex++;
                console.log(roomobject.definitions);
                io.sockets.in(p1data.room).emit("match", p1data);
            }
        }
    } else {
        console.log("contains no definitions");
        console.log("matching phrases");
        console.log(p2data.phrase);
        roomobject.definitions[roomobject.definitionindex] = {
            word: p2data.word,
            phrase: p2data.phrase,
            page: p2data.page
        };
        roomobject.definitionindex++;
        console.log("room definitions " + roomobject.definitions[0]);
        console.log(roomobject);
        console.log("room index " + roomobject.definitionindex);
        io.sockets.in(p1data.room).emit("match", p1data);
    }

}



function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function getAllPlayers(room) {
    var collectedPlayers = [];
    console.log(Object.keys(io.nsps['/'].adapter.rooms[room].sockets));
    Object.keys(io.nsps['/'].adapter.rooms[room].sockets).forEach(function (socketID) {
        var player = io.sockets.adapter.nsp.connected[socketID].player;
        if (player != null) {
            collectedPlayers.push(player);
        };
    });
    console.log(collectedPlayers);
    return collectedPlayers;
}


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}