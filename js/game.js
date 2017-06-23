const UP_ARROW = 0;
const RIGHT_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;

var MOVEMENT = 7;

var myPlayerID = -1;

var flip1 = true;
var flip2 = true;
var flip3 = true;


var game = new Phaser.Game(
    800,
    800,
    Phaser.AUTO,
    document.getElementById("game"),
    this,
    false,
    false
);

var mainGameState = {};

mainGameState.preload = function () {
    game.load.image('player', 'assets/redguy.png');
    game.load.image('line', 'assets/line.png');
    game.load.image('bubble', 'assets/speechbubble.png');
    game.load.image('symbol1', 'assets/symbol1.png');
    game.load.image('symbol2', 'assets/symbol2.png');
    game.load.image('menu', 'assets/menu.png');
}

mainGameState.create = function () {
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;
    this.playerList = {};

    //Start the physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Player Initialization has moved to addNewPlayer

    //Nice dusty lavender background, instead of black.
    game.stage.backgroundColor = "#737c93";

    // Arrow keys and spacebar only affect game.
    game.input.keyboard.addKeyCapture(
      [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.SPACEBAR]);

    //Allow arrow key inputs
    this.cursor = game.input.keyboard.createCursorKeys();
    //Allow WASD inputs
    this.wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S)
    };

    this.space = {
        spacebar: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    mainGameState.line = game.add.sprite(400, 400, 'line');
    mainGameState.line.anchor.setTo(0.5, 0.5);

    mainGameState.populateDictionary();
    Client.askNewPlayer();
};

mainGameState.populateDictionary = function () {

    mainGameState.phrase = {};
    mainGameState.word = 0;

    mainGameState.dictionary = game.add.sprite(0, 0, 'menu');

    mainGameState.symbol1 = mainGameState.dictionary.addChild(game.make.sprite(0, 30, 'symbol1'));
    mainGameState.symbol1.inputEnabled = true;
    mainGameState.symbol1.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol1);
    mainGameState.symbol1.body.setCircle(32);



    mainGameState.symbol2 = mainGameState.dictionary.addChild(game.make.sprite(70, 30, 'symbol2'));
    mainGameState.symbol2.inputEnabled = true;
    mainGameState.symbol2.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol2);
    mainGameState.symbol2.body.setCircle(32);

}

mainGameState.addNewPlayer = function (id, x, y) {
    // --- Player Initialization ---
    mainGameState.playerList[id] = game.add.sprite(x, y, 'player');
    mainGameState.playerList[id].anchor.setTo(.5, .5);
    mainGameState.playerList[id].scale.setTo(2, 2);
    mainGameState.playerList[id].smoothed = false;
    game.physics.arcade.enable(mainGameState.playerList[id]);
    mainGameState.playerList[id].body.collideWorldBounds = true;
    mainGameState.playerList[id].inputEnabled = true;

    //Add speechbubble

    mainGameState.playerList[id].addChild(game.make.sprite(0, -70, 'bubble'));
    mainGameState.playerList[id].children[0].visible = false;

    //add symbols to the speech bubble
    mainGameState.symbolBubble1 = mainGameState.playerList[id].children[0].addChild(game.make.sprite(0, 0, 'symbol1'));
    mainGameState.symbolBubble1.visible = false;

    mainGameState.symbolBubble2 = mainGameState.playerList[id].children[0].addChild(game.make.sprite(0, 0, 'symbol2'));
    mainGameState.symbolBubble2.visible = false;
    // --- End Player Initialization ---
};

mainGameState.update = function () {
    this.movePlayer();
    this.speakTest();

    mainGameState.dictionary.children[0].events.onInputDown.add(mainGameState.OnSymbolDown, this);
    mainGameState.dictionary.children[1].events.onInputDown.add(mainGameState.OnSymbolDown, this);

    mainGameState.dictionary.children[0].events.onInputUp.add(mainGameState.OnSymbolUp, this);
    mainGameState.dictionary.children[1].events.onInputUp.add(mainGameState.OnSymbolUp, this);

    if (myPlayerID >= 0) {

        mainGameState.playerList[myPlayerID].events.onInputDown.add(mainGameState.OnPlayerDown, this);
        mainGameState.playerList[myPlayerID].events.onInputUp.add(mainGameState.OnPlayerUp, this);

    };
}

mainGameState.OnSymbolDown = function (touchedbutton) {

    if (flip2) {
        touchedbutton.visible = false;
        mainGameState.phrase[mainGameState.word] = touchedbutton.key;
        mainGameState.word++;
        flip2 = false;
    }
    //the touched button should be added to an array
    //this array will be sent to all the players and reassembled as needed 
}

mainGameState.OnSymbolUp = function (touchedbutton) {
    touchedbutton.visible = true;
    flip2 = true;
}

mainGameState.OnPlayerDown = function () {
    if (flip3) {
        console.log(mainGameState.phrase);
        Client.sendPhrase(mainGameState.phrase);
        mainGameState.word = 0;
        mainGameState.phrase = [];
        flip3 = false;
    }

}

mainGameState.OnPlayerUp = function () {
    flip3 = true;
}


mainGameState.speakTest = function () {
    if (myPlayerID >= 0) {
        if (this.space.spacebar.isDown && flip1 == true) {
            Client.speak();
            flip1 = false;
        } else if (!this.space.spacebar.isDown) {
            flip1 = true;
        }
    }
};

mainGameState.sayPhrase = function (id, phrase) {
    var size = Object.keys(phrase).length;
    mainGameState.playerList[id].children[0].visible = true;
    console.log(size);
    for (var i = 0; i <= size - 1; i++) {
        var n = 1;
        for (var k = mainGameState.playerList[id].children[0].children.length - 1; k >= 0; k--) {
            var symbolSprite = mainGameState.playerList[id].children[0].children[k];
            if (phrase[i] == symbolSprite.key) {
                console.log("found match" + symbolSprite.key);
                symbolSprite.visible = true;
                symbolSprite.x = (i * 30) + 20;
                symbolSprite.y = 10;
                symbolSprite.z = 50;
                symbolSprite.scale.setTo(.3, .3);
            } else {
                n++
            }

        }

    }
}


mainGameState.updateSpeak = function (id) {
    mainGameState.playerList[id].children[0].visible = !mainGameState.playerList[id].children[0].visible;
};

//This function is intended to be able to move our circle.
mainGameState.movePlayer = function () {

    // If the id is not received by the client, then do nothing
    if (myPlayerID >= 0) {
        var player = this.playerList[myPlayerID];
        var moved = false;
        var speed = 7;

        if (myPlayerID == 1) {
            if (this.playerList[myPlayerID].y > 400) {
                this.playerList[myPlayerID].y = 400;
            }
        } else if (myPlayerID == 2) {
            if (this.playerList[myPlayerID].y < 400) {
                this.playerList[myPlayerID].y = 400;
            }
        }

        //RIGHT first movement

        if ((this.cursor.right.isDown || this.wasd.right.isDown) && (this.cursor.up.isDown || this.wasd.up.isDown)) {
            player.x += speed / 2;
            player.y -= speed / 2;
            moved = true;
        } else if ((this.cursor.right.isDown || this.wasd.right.isDown) && (this.cursor.down.isDown || this.wasd.down.isDown)) {
            player.x += speed / 2;
            player.y += speed / 2;
            moved = true;
        } else if ((this.cursor.right.isDown || this.wasd.right.isDown) && !this.cursor.up.isDown && !this.wasd.up.isDown && !this.cursor.down.isDown && !this.wasd.down.isDown) {
            player.x += speed;
            moved = true;
        }

        //Left first movement

        if ((this.cursor.left.isDown || this.wasd.left.isDown) && (this.cursor.up.isDown || this.wasd.up.isDown)) {
            player.x -= speed / 2;
            player.y -= speed / 2;
            moved = true;
        } else if ((this.cursor.left.isDown || this.wasd.left.isDown) && (this.cursor.down.isDown || this.wasd.down.isDown)) {
            player.x -= speed / 2;
            player.y += speed / 2;
            moved = true;
        } else if ((this.cursor.left.isDown || this.wasd.left.isDown) && !this.cursor.up.isDown && !this.wasd.up.isDown && !this.cursor.down.isDown && !this.wasd.down.isDown) {
            player.x -= speed;
            moved = true;
        }

        //UP first movement

        if ((this.cursor.up.isDown || this.wasd.up.isDown) && (this.cursor.right.isDown || this.wasd.right.isDown)) {
            player.x += speed / 2;
            player.y -= speed / 2;
            moved = true;
        } else if ((this.cursor.up.isDown || this.wasd.up.isDown) && (this.cursor.left.isDown || this.wasd.left.isDown)) {
            player.x -= speed / 2;
            player.y -= speed / 2;
            moved = true;
        } else if ((this.cursor.up.isDown || this.wasd.up.isDown) && !this.cursor.right.isDown && !this.wasd.right.isDown && !this.cursor.left.isDown && !this.wasd.left.isDown) {
            player.y -= speed;
            moved = true;
        }

        //DOWN first movement

        if ((this.cursor.down.isDown || this.wasd.down.isDown) && (this.cursor.right.isDown || this.wasd.right.isDown)) {
            player.x += speed / 2;
            player.y += speed / 2;
            moved = true;
        } else if ((this.cursor.down.isDown || this.wasd.down.isDown) && (this.cursor.left.isDown || this.wasd.left.isDown)) {
            player.x -= speed / 2;
            player.y += speed / 2;
            moved = true;
        } else if ((this.cursor.down.isDown || this.wasd.down.isDown) && !this.cursor.right.isDown && !this.wasd.right.isDown && !this.cursor.left.isDown && !this.wasd.left.isDown) {
            player.y += speed;
            moved = true;
        }

        if (moved) {
            // Send the id and position of the player
            Client.updatePosition({
                x: player.x,
                y: player.y,
            });
        }

    }

};

mainGameState.updateOtherPlayer = function (id, x, y) {
    // Get the player with incoming id from the list
    var player = this.playerList[id];

    // Update its local position
    if (player != null) {
        player.x = x;
        player.y = y;
    }
}

mainGameState.setID = function (id) {
    myPlayerID = id;
}

//When receiving data of dot ot be received the group will be looped through finding the matching dot. then that dot will be destroyed

mainGameState.removePlayer = function (id) {
    this.playerList[id].destroy();
    delete this.playerList[id];
};

mainGameState.render = function () {
    //    if (myPlayerID > -1) {
    //        var player = this.playerList[myPlayerID];
    //        game.debug.body(player);
    //    };
};

game.state.add("Game", mainGameState);
game.state.start("Game");