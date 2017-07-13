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
httpServer.definitions = {};
httpServer.definitionIndex = 0;

httpServer.listen(8090, function () {
    console.log('Listening on ' + httpServer.address().port);
});

io.on('connection', function (socket) {
    console.log("Connected!");
    socket.on('newplayer', function () {
        console.log("New player received");
        if (httpServer.lastPlayerID < 2) {
            httpServer.lastPlayerID++;
            if (httpServer.lastPlayerID == 1) {
                var x = 350;
                var y = 300;

                socket.player = {
                    id: httpServer.lastPlayerID,
                    x: x,
                    y: y,
                    phrase: {}
                };
            } else if (httpServer.lastPlayerID == 2) {
                var x = 1100;
                var y = 700;

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

        socket.on('click', function (data) {
            io.emit('click', data);
        });

        socket.on('emote', function (data) {
            io.emit('emote', data);
        });

        socket.on('phrase', function (data) {
            socket.player.phrase = data;
            console.log(socket.player.phrase);
            console.log(socket.player);
            io.emit('phrase', socket.player);
        });

        socket.on('1compare', function (data) {
            console.log("server receives for compare");
            httpServer.p1data = data;
            if (httpServer.p2data) {
                if (httpServer.p1data.word == httpServer.p2data.word) {
                    console.log("word match");
                    var size1 = Object.keys(httpServer.p1data.phrase).length - 1;
                    var size2 = Object.keys(httpServer.p2data.phrase).length - 1;
                    if (size1 >= 0 && size2 >= 0) {
                        console.log("word length acceptable");
                        if (httpServer.p1data.page == httpServer.p2data.page) {
                            if (size1 == size2) {
                                console.log("sizes equal");
                                for (var i = 0; i <= size1; i++) {
                                    if (httpServer.p1data.phrase[i] != "" && httpServer.p2data.phrase[i] != "") {
                                        if (httpServer.p1data.phrase[i] != httpServer.p2data.phrase[i]) {
                                            console.log("no match" + httpServer.p1data.phrase[i] + " " + httpServer.p2data.phrase[i]);
                                            return;
                                        }
                                        if (i == size1) {
                                            console.log("content the same");
                                            compareSimilarity();
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
        });

        socket.on('2compare', function (data) {
            httpServer.p2data = data;
            if (httpServer.p1data) {
                if (httpServer.p2data.word == httpServer.p1data.word) {
                    console.log("word match");

                    var size1 = Object.keys(httpServer.p1data.phrase).length - 1;
                    var size2 = Object.keys(httpServer.p2data.phrase).length - 1;
                    if (size1 >= 0 && size2 >= 0) {
                        console.log("word length acceptable");
                        if (httpServer.p1data.page == httpServer.p2data.page) {
                            if (size1 == size2) {
                                console.log("sizes equal");
                                for (var i = 0; i <= size1; i++) {
                                    if (httpServer.p1data.phrase[i] != "" && httpServer.p2data.phrase[i] != "") {
                                        if (httpServer.p1data.phrase[i] != httpServer.p2data.phrase[i]) {
                                            console.log("no match" + httpServer.p2data.phrase[i] + " " + httpServer.p1data.phrase[i]);
                                            return;
                                        }
                                        if (i == size1) {
                                            console.log("content the same");
                                            compareSimilarity();
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

        });

        socket.on('dictionaryopen', function () {
            io.emit('dictionaryopen', socket.player.id);
        });

        socket.on('dictionaryclose', function () {
            console.log("server receives request to close dictionary");
            io.emit('dictionaryclose', socket.player.id);
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

function compareSimilarity() {
    if (!isEmpty(httpServer.definitions)) {
        console.log("contains definitions");
        var defsize = Object.keys(httpServer.definitions).length - 1;
        console.log(defsize);
        for (var i = 0; i <= defsize; i++) {
            console.log("definition" + httpServer.definitions[i].phrase);
            console.log("phrase " + httpServer.p1data.phrase);
            console.log("for loop to check repeat working..");
            if (httpServer.definitions[i].phrase.toString() == httpServer.p1data.phrase.toString()) {
                console.log("This phrase is already taken");
                return;
            }
            if (i == defsize) {
                console.log("matching phrases");
                httpServer.definitions[httpServer.definitionIndex] = {
                    word: httpServer.p2data.word,
                    phrase: httpServer.p2data.phrase,
                    page: httpServer.p2data.phrase
                };
                httpServer.definitionIndex++;
                console.log(httpServer.definitions);
                io.emit("match", httpServer.p1data);
            }
        }
    } else {
        console.log("contains no definitions");
        console.log("matching phrases");
        httpServer.definitions[httpServer.definitionIndex] = {
            word: httpServer.p2data.word,
            phrase: httpServer.p2data.phrase,
            page: httpServer.p2data.page
        };
        httpServer.definitions[httpServer.definitionIndex];
        httpServer.definitionIndex++;
        console.log(httpServer.definitions);
        io.emit("match", httpServer.p1data);
    }

}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


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