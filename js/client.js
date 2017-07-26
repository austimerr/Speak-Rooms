// For server, need to add + ":8081" to address until we figure
// out WTF is going on with socket.io
var address = window.location.origin + ":8005";

var roomname = "";
var myID = -1;

var Client = {};
Client.socket = io.connect(address);

Client.askNewPlayer = function () {
    console.log("new player in " + roomname + " in client.");
    Client.socket.emit('newplayer', roomname);
};

Client.updatePosition = function (data) {
    Client.socket.emit('move', {
        x: data.x,
        y: data.y,
        room: roomname

    });
};

Client.clickRequest = function (data) {
    Client.socket.emit('click', data);
}

Client.requestEmote = function (data) {
    Client.socket.emit('emote', data);
};


Client.sendPhrase = function (data) {
    Client.socket.emit('phrase', data);
};

Client.sendForCompare = function (data) {
    console.log("phrase received for compare" + data.phrase);
    Client.socket.emit('onPlayerforCompare', {
        id: data.id,
        page: data.page,
        phrase: data.phrase,
        word: data.word,
        room: roomname
    });
};

Client.otherCheckBox = function (data) {
    console.log("client receives request for other checkbox");
    Client.socket.emit('othercheckbox', data);
}

Client.dictionaryInUse = function () {
    Client.socket.emit('dictionaryopen');
};

Client.requestDictionaryClose = function () {
    console.log("client receives request to close dictionary");
    Client.socket.emit('dictionaryclose');
}

Client.requestEndSpeech = function () {
    console.log("client receives end speech request");
    Client.socket.emit('endspeech');
};

Client.socket.on('yourRoomNum', function (data) {
    roomname = data;
    console.log("your room number is " + data);
    mainGameState.requestNewPlayer();
});

Client.socket.on('newplayer', function (data) {
    if (data.id) {
        mainGameState.addNewPlayer(data.id, data.x, data.y)
    }
});


Client.socket.on('allplayers', function (data) {
    console.log("all players request received in client");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id) {
            mainGameState.addNewPlayer(data[i].id, data[i].x, data[i].y)
        }
    }
});


Client.socket.on('you', function (data) {
    if (myID == -1) {
        console.log("congrats YOU are you");
        myID = data;
        mainGameState.setID(data);
    }
});

Client.socket.on('move', function (data) {
    mainGameState.updateOtherPlayer(data.id, data.x, data.y);
});

Client.socket.on('click', function (data) {
    mainGameState.click(data.id, data.x, data.y);
});

Client.socket.on('emote', function (data) {
    mainGameState.emote(data.id, data.emotion);
});


Client.socket.on('phrase', function (data) {
    console.log("client info " +
        data.id, data.phrase);
    mainGameState.sayPhrase(data.id, data.phrase);
});

Client.socket.on('match', function (data) {
    console.log("match received in client");
    mainGameState.match(data.word, data.phrase, data.page);
});

Client.socket.on('othercheckbox', function (data) {
    mainGameState.otherCheck(data.page, data.word, data.active);
});

Client.socket.on('dictionaryopen', function (data) {
    mainGameState.dictionaryInUse(data);
});

Client.socket.on('dictionaryclose', function (data) {
    mainGameState.dictionaryClosed(data);
});


Client.socket.on('endspeech', function () {
    mainGameState.endSpeech();
});

Client.socket.on('remove', function (id) {
    mainGameState.removePlayer(id);
});