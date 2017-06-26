const UP_ARROW = 0;
const RIGHT_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;

var MOVEMENT = 7;

var myPlayerID = -1;

var flip1 = true;
var flip2 = true;
var flip3 = true;
var flip4 = true;


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
    game.load.image('bubble1', 'assets/bubble1.png');
    game.load.image('bubble2', 'assets/speechbubble.png');

    //Symbols
    game.load.image('symbol1', 'assets/symbol1.png');
    game.load.image('symbol2', 'assets/symbol2.png');
    game.load.image('symbol3', 'assets/symbol3.png');
    game.load.image('symbol4', 'assets/symbol4.png');
    game.load.image('menu', 'assets/menu.png');
    game.load.image('dictionary', 'assets/dictionarymenu.png');
    game.load.image('dictionarylabel', 'assets/dictionarylabel.png');
    game.load.image('open', 'assets/opentab.png');

    game.load.audio('grunt', 'assets/grunt.wav');
    game.load.audio('click', 'assets/click.wav');
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

    mainGameState.gruntSound = game.add.audio('grunt');
    mainGameState.clickSound = game.add.audio('click');

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

    mainGameState.populateSymbols();
    mainGameState.populateDictionary();
    Client.askNewPlayer();

    text = game.add.text(game.world.centerX, 250, ' Sorry, this room is full.');
    text.anchor.set(0.5);
    text.align = 'center';

    text.font = 'Arial Black';
    text.fontSize = 50;
    text.fontWeight = 'bold';
    text.fill = '#000000';
};

mainGameState.populateSymbols = function () {

    mainGameState.phrase = {};
    mainGameState.word = 0;

    mainGameState.symbols = game.add.sprite(-155, 0, 'menu');
    mainGameState.symbols.alpha = 0.8;


    mainGameState.open = mainGameState.symbols.addChild(game.make.sprite(160, 70, 'open'));
    mainGameState.open.inputEnabled = true;
    mainGameState.open.smoothed = false;

    mainGameState.symbol1 = mainGameState.symbols.addChild(game.make.sprite(0, 30, 'symbol1'));
    mainGameState.symbol1.inputEnabled = true;
    mainGameState.symbol1.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol1);
    mainGameState.symbol1.body.setCircle(32);

    mainGameState.symbol2 = mainGameState.symbols.addChild(game.make.sprite(70, 30, 'symbol2'));
    mainGameState.symbol2.inputEnabled = true;
    mainGameState.symbol2.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol2);
    mainGameState.symbol2.body.setCircle(32);

    mainGameState.symbol3 = mainGameState.symbols.addChild(game.make.sprite(0, 100, 'symbol3'));
    mainGameState.symbol3.inputEnabled = true;
    mainGameState.symbol3.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol3);
    mainGameState.symbol3.body.setCircle(32);

    mainGameState.symbol4 = mainGameState.symbols.addChild(game.make.sprite(70, 100, 'symbol4'));
    mainGameState.symbol4.inputEnabled = true;
    mainGameState.symbol4.smoothed = false;
    game.physics.arcade.enable(mainGameState.symbol4);
    mainGameState.symbol4.body.setCircle(32);

}

mainGameState.populateDictionary = function () {
    mainGameState.dictionary = game.add.sprite(0, 690, 'dictionary');
    mainGameState.dictionary.alpha = 0.85;

    mainGameState.dictionarylabel = mainGameState.dictionary.addChild(game.make.sprite(150, 75, 'dictionarylabel'));
    mainGameState.dictionarylabel.inputEnabled = true;
    mainGameState.dictionarylabel.smoothed = false;
}

mainGameState.addNewPlayer = function (id, x, y) {
    text.visible = false;
    // --- Player Initialization ---
    mainGameState.playerList[id] = game.add.sprite(x, y, 'player');
    mainGameState.playerList[id].anchor.setTo(.5, .5);
    mainGameState.playerList[id].scale.setTo(2, 2);
    mainGameState.playerList[id].smoothed = false;
    game.physics.arcade.enable(mainGameState.playerList[id]);
    mainGameState.playerList[id].body.collideWorldBounds = true;
    mainGameState.playerList[id].inputEnabled = true;

    game.world.swap(mainGameState.playerList[id], mainGameState.symbols);

    if (id == 1) {

        mainGameState.playerList[id].addChild(game.make.sprite(0, 45, 'bubble1'));
        mainGameState.playerList[id].children[0].visible = false;
        mainGameState.playerList[id].children[0].anchor.setTo(0.5, 0.5);
    }

    if (id == 2) {

        mainGameState.playerList[id].addChild(game.make.sprite(0, -35, 'bubble2'));
        mainGameState.playerList[id].children[0].visible = false;
        mainGameState.playerList[id].children[0].anchor.setTo(0.5, 0.5);
    }
};

mainGameState.update = function () {
    this.movePlayer();

    for (var i = 0; i <= mainGameState.symbols.children.length - 1; i++) {
        mainGameState.symbols.children[i].events.onInputDown.add(mainGameState.OnSymbolDown, this);
        mainGameState.symbols.children[i].events.onInputUp.add(mainGameState.OnSymbolUp, this);
    }

    if (mainGameState.dictionary.children) {

        mainGameState.dictionary.children[0].events.onInputDown.add(mainGameState.OnSymbolDown, this);
        mainGameState.dictionary.children[0].events.onInputUp.add(mainGameState.OnSymbolUp, this);
    }

    if (myPlayerID >= 0) {

        mainGameState.playerList[myPlayerID].events.onInputDown.add(mainGameState.OnPlayerDown, this);
        mainGameState.playerList[myPlayerID].events.onInputUp.add(mainGameState.OnPlayerUp, this);

    };

    //    if (game.time.now - mainGameState.timeCheck >= 4500 && mainGameState.destroytext) {
    //        this.endSpeech();
    //    }
}

mainGameState.OnSymbolDown = function (touchedbutton) {

    if (flip2) {
        mainGameState.clickSound.play();
        if (touchedbutton.key != 'open' && touchedbutton.key != 'dictionarylabel') {
            game.add.tween(touchedbutton).to({
                x: touchedbutton.x - 5
            }, 20, Phaser.Easing.Bounce.Out, true);
            mainGameState.phrase[mainGameState.word] = touchedbutton.key;
            mainGameState.word++;
        } else if (touchedbutton.key == 'open') {
            touchedbutton.visible = false;
            mainGameState.expandSymbols();
        } else if (touchedbutton.key == 'dictionarylabel') {
            touchedbutton.visible = false;
            mainGameState.expandDictionary();
        }
        flip2 = false;

    }
}

mainGameState.expandSymbols = function () {
    if (flip1) {
        game.add.tween(mainGameState.symbols).to({
            x: 0
        }, 1200, Phaser.Easing.Bounce.Out, true);
        flip1 = false;
    } else if (!flip1) {

        game.add.tween(mainGameState.symbols).to({
            x: -155
        }, 100, Phaser.Easing.Elastic.Out, true);
        flip1 = true;
    }
}

mainGameState.expandDictionary = function () {
    if (flip4) {
        game.add.tween(mainGameState.dictionary).to({
            y: 100
        }, 1000, Phaser.Easing.Bounce.Out, true);
        flip4 = false;
    } else if (!flip4) {

        game.add.tween(mainGameState.dictionary).to({
            y: 690
        }, 400, Phaser.Easing.Elastic.Out, true);
        flip4 = true;
    }
}
mainGameState.OnSymbolUp = function (touchedbutton) {
    touchedbutton.visible = true;
    if (touchedbutton.key != 'open' && touchedbutton.key != 'dictionarylabel') {
        game.add.tween(touchedbutton).to({
            x: touchedbutton.x + 5
        }, 20, Phaser.Easing.Linear.Out, true);
    }
    flip2 = true;
}

mainGameState.OnPlayerDown = function () {
    if (flip3) {
        if (mainGameState.playerList[mainGameState.idtoDestroy]) {
            if (mainGameState.idtoDestroy == myPlayerID) {

                if (mainGameState.playerList[mainGameState.idtoDestroy].children[0].visible) {
                    Client.requestEndSpeech();
                    console.log("request sent by game");
                }
            }
        }
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

mainGameState.sayPhrase = function (id, phrase) {

    mainGameState.idtoDestroy = id;

    var size = Object.keys(phrase).length;
    if (size) {
        mainGameState.playerList[id].children[0].visible = true;
        mainGameState.gruntSound.play();
        mainGameState.gruntSound._sound.playbackRate.value = mainGameState.randomNumFromInterval(.8, 2.5);
        console.log(mainGameState.gruntSound._sound.playbackRate.value);
    }
    for (var i = 0; i <= size - 1; i++) {
        if (mainGameState.playerList[id].children[0].children.length < 5) {
            if (id == 1) {
                var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite((i * 17) - 44, -8, phrase[i]));
            } else if (id == 2) {
                var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite((i * 17) - 44, -18, phrase[i]));
            }
            symbolSprite.scale.setTo(.35, .35);
        }
    }

    mainGameState.timeCheck = game.time.now;
    mainGameState.destroytext = true;
}

mainGameState.endSpeech = function () {
    console.log("request received by game");

    if (mainGameState.playerList[mainGameState.idtoDestroy]) {

        var symbols = mainGameState.playerList[mainGameState.idtoDestroy].children[0];
        for (var i = symbols.children.length - 1; i >= 0; i--) {
            symbols.children[i].destroy();
        }
        mainGameState.playerList[mainGameState.idtoDestroy].children[0].visible = false;
    }

}

//This function is intended to be able to move our circle.
mainGameState.movePlayer = function () {

    // If the id is not received by the client, then do nothing
    if (myPlayerID >= 0) {
        var player = this.playerList[myPlayerID];
        var moved = false;
        var speed = 7;

        if (myPlayerID == 1) {
            if (this.playerList[myPlayerID].y > 350) {
                this.playerList[myPlayerID].y = 350;
            }
        } else if (myPlayerID == 2) {
            if (this.playerList[myPlayerID].y < 450) {
                this.playerList[myPlayerID].y = 450;
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

mainGameState.randomNumFromInterval = function (min, max) {
    return (Math.random() * (max - min) + min);
}

//When receiving data of dot ot be received the group will be looped through finding the matching dot. then that dot will be destroyed

mainGameState.removePlayer = function (id) {
    this.playerList[id].destroy();
    delete this.playerList[id];
};

mainGameState.render = function () {
    //    if (this.playerList[myPlayerID]) {
    //        game.debug.body(this.playerList[myPlayerID]);
    //    }
};

game.state.add("Game", mainGameState);
game.state.start("Game");