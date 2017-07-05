// For server, need to add + ":8081" to address until we figure
// out WTF is going on with socket.io
var address = window.location.origin + ":8090";

var Client = {};
Client.socket = io.connect(address);

Client.askNewPlayer = function () {
    Client.socket.emit('newplayer');
    //console.log("Sending new player");
};

Client.updatePosition = function (data) {
    Client.socket.emit('move', data);
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
    console.log("phrase received for compare" + data.page);
    if (data.id == 1) {
        Client.socket.emit('1compare', data);
    } else if (data.id == 2) {
        Client.socket.emit('2compare', data);
    }
};

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


Client.socket.on('newplayer', function (data) {
    mainGameState.addNewPlayer(data.id, data.x, data.y);
});


Client.socket.on('allplayers', function (data) {
    for (var i = 0; i < data.length; i++) {
        mainGameState.addNewPlayer(data[i].id, data[i].x, data[i].y)
    }
});


Client.socket.on('you', function (data) {
    mainGameState.setID(data);
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
    mainGameState.match(data.word, data.phrase, data.page);
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