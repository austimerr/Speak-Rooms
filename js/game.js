const UP_ARROW = 0;
const RIGHT_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;

var MOVEMENT = 7;

var myPlayerID = -1;

//VARIOUS TOGGLES 
var flip1 = true;
var flip2 = true;
var flip3 = true;
var flip4 = true;
var flip5 = true;
var flip6 = true;



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
    game.load.image('open', 'assets/opentab.png');
    game.load.image('clear', 'assets/clear.png');

    game.load.image('dictionary', 'assets/dictionarymenu.png');
    game.load.image('dictionarylabel', 'assets/dictionarylabel.png');
    game.load.image('symbolspace', 'assets/symbolspace.png');
    game.load.image('checkbox', 'assets/checkbox.png');
    game.load.image('check', 'assets/check.png');

    game.load.audio('grunt', 'assets/grunt.wav');
    game.load.audio('click', 'assets/click.wav');
}

mainGameState.create = function () {
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;
    this.playerList = {};
    mainGameState.phrasetoCompare = [];

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = "#737c93";

    mainGameState.gruntSound = game.add.audio('grunt');
    mainGameState.clickSound = game.add.audio('click');


    game.input.keyboard.addKeyCapture(
      [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.SPACEBAR]);


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

    //UI FUNCTION

    mainGameState.populateSymbols();
    mainGameState.populateDictionary();
    Client.askNewPlayer();

    //TEXT TO BE SEEN WHEN A PLAYER IS UNABLE TO PLAY

    text = game.add.text(game.world.centerX, 250, ' Sorry, this room is full.');
    text.anchor.set(0.5);
    text.align = 'center';

    text.font = 'Arial Black';
    text.fontSize = 50;
    text.fontWeight = 'bold';
    text.fill = '#000000';
};

mainGameState.populateSymbols = function () {

    //THIS FUNCTION FILLS OUT THE MENU ON THE LEFT OF THE SCREEN
    //ACTS AS A KEYBOARD

    mainGameState.phrase = {};
    mainGameState.word = 0;

    mainGameState.symbols = game.add.sprite(-155, 0, 'menu');
    mainGameState.symbols.alpha = 0.8;


    mainGameState.open = mainGameState.symbols.addChild(game.make.sprite(160, 70, 'open'));
    mainGameState.open.inputEnabled = true;
    mainGameState.open.smoothed = false;

    mainGameState.clear = mainGameState.symbols.addChild(game.make.sprite(20, 250, 'clear'));
    mainGameState.clear.inputEnabled = true;
    mainGameState.clear.smoothed = false;

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

    //THIS SYMBOL LENGTH IS USED TO REVERT BACK TO DEFAULT CHILD LENGTH LATER

    mainGameState.symbollength = mainGameState.symbols.children.length - 1;

}

mainGameState.populateDictionary = function () {

    //POPULATES THE DICTIONARY MENU AT THE BOTTOM OF THE SCREEN 

    mainGameState.dictionary = game.add.sprite(0, 690, 'dictionary');
    mainGameState.dictionary.alpha = 0.85;

    mainGameState.dictionarylabel = mainGameState.dictionary.addChild(game.make.sprite(480, 75, 'dictionarylabel'));
    mainGameState.dictionarylabel.inputEnabled = true;
    mainGameState.dictionarylabel.smoothed = false;

    mainGameState.dictionarytext = mainGameState.dictionary.addChild(game.add.text(400, 200, 'Reach Agreement, Define Meaning', {
        font: '32px Georgia',
        fill: '#000000',
        align: 'center'
    }));
    mainGameState.dictionarytext.anchor.setTo(0.5, 0.5);

    //EACH DEFINTION-SYMBOL COMBO REQUIRES THIS BLOCK OF CODE RIGHT NOW. MAYBE SWITCH TO A MORE GENERAL FORMAT?

    mainGameState.definition1 = mainGameState.dictionary.addChild(game.add.text(100, 300, 'Green: ', {
        font: '28px Georgia',
        fill: '#000000',
        align: 'left'
    }));
    mainGameState.definition1.anchor.setTo(0.5, 0.5);
    //PLAYERS CAN CLICK ON SYMBOL SPACE TO FILL IT WITH SYMBOLS

    var symbolspace = mainGameState.definition1.addChild(game.make.sprite(120, -10, 'symbolspace'));
    symbolspace.anchor.setTo(0.5, 0.5);
    symbolspace.inputEnabled = true;
    //PLAYERS CAN CLICK ON CHECKBOX TO SEND SYMBOL COMBO TO SERVER TO COMPARE WITH TEAMMATE

    var checkbox = mainGameState.definition1.addChild(game.make.sprite(250, -10, 'checkbox'));
    checkbox.anchor.setTo(0.5, 0.5);
    checkbox.inputEnabled = true;
    //CHECK WILL APPEAR WHEN CHECKBOX IS CLICKED
    var check = checkbox.addChild(game.make.sprite(15, -10, 'check'));
    check.anchor.setTo(0.5, 0.5);
    check.visible = false;

    //DEFINITION 2 BLOCK
    mainGameState.definition2 = mainGameState.dictionary.addChild(game.add.text(450, 300, 'Red: ', {
        font: '28px Georgia',
        fill: '#000000',
        align: 'left'
    }));
    mainGameState.definition2.anchor.setTo(0.5, 0.5);
    symbolspace = mainGameState.definition2.addChild(game.make.sprite(110, -10, 'symbolspace'));
    symbolspace.anchor.setTo(0.5, 0.5);
    symbolspace.inputEnabled = true;
    checkbox = mainGameState.definition2.addChild(game.make.sprite(250, -10, 'checkbox'));
    checkbox.anchor.setTo(0.5, 0.5);
    checkbox.inputEnabled = true;
    var check = checkbox.addChild(game.make.sprite(15, -10, 'check'));
    check.anchor.setTo(0.5, 0.5);
    check.visible = false;
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

    //PROPERLY LAYERS PLAYERS ON THE Z AXIS
    game.world.swap(mainGameState.playerList[id], mainGameState.symbols);

    if (id == 2) {
        game.world.swap(mainGameState.playerList[id], mainGameState.dictionary);
    }

    if (id == 1) {
        //SETS UP THE SPEECH BUBBLES FOR PLAYER 1
        mainGameState.playerList[id].addChild(game.make.sprite(0, 45, 'bubble1'));
        mainGameState.playerList[id].children[0].visible = false;
        mainGameState.playerList[id].children[0].anchor.setTo(0.5, 0.5);
    }

    if (id == 2) {
        //SETS UP THE SPEECH BUBBLES FOR PLAYER 2
        mainGameState.playerList[id].addChild(game.make.sprite(0, -35, 'bubble2'));
        mainGameState.playerList[id].children[0].visible = false;
        mainGameState.playerList[id].children[0].anchor.setTo(0.5, 0.5);
    }
};

mainGameState.update = function () {
    this.movePlayer();

    //DIRECT MOUSE IMPUT TO VARIOUS FUNCTIONS. SHORTEN LATER THROUGH LOOPS

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

    mainGameState.definition1.children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
    mainGameState.definition1.children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
    mainGameState.definition1.children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
    mainGameState.definition1.children[1].events.onInputUp.add(mainGameState.OnDefineUp, this);

    mainGameState.definition2.children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
    mainGameState.definition2.children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
    mainGameState.definition2.children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
    mainGameState.definition2.children[1].events.onInputUp.add(mainGameState.OnDefineUp, this);
}

mainGameState.OnDefineDown = function (touchedbutton) {
    //WHEN A PLAYER PRESSES EITHER CHECKBOX OR SYMBOLSPACE THIS FUNCTION IS CALLED
    if (flip5) {
        if (touchedbutton.key == 'checkbox') {
            mainGameState.clickSound.play();

            //MAKES GREEN CHECK APPEAR ON TOGGLE
            if (touchedbutton == mainGameState.definition1.children[1]) {
                touchedbutton.children[0].visible = !touchedbutton.children[0].visible;
                if (touchedbutton.children[0].visible) {
                    Client.sendForCompare({
                        id: myPlayerID,
                        phrase: mainGameState.phrasetoCompare,
                        word: "definition1"
                    });
                }

            }

            if (touchedbutton == mainGameState.definition2.children[1]) {
                touchedbutton.children[0].visible = !touchedbutton.children[0].visible;
                if (touchedbutton.children[0].visible) {
                    Client.sendForCompare({
                        id: myPlayerID,
                        phrase: mainGameState.phrasetoCompare,
                        word: "definition2"
                    });
                }
            }
        }

        if (touchedbutton.key == 'symbolspace') {
            mainGameState.clickSound.play();
            //CLEARS OUT CHILDREN ARRAY OF THE SYMBOLSPACE YOU HIT
            touchedbutton.children = [];
            mainGameState.phrasetoCompare = [];
            //FILLS OUT CHILDREN ARRAY OF SYMBOLSPACE YOU HIT BASED ON CURRENT PHRASE IN SYMBOL MENU
            for (var i = 0; i <= Object.keys(mainGameState.phrase).length - 1; i++) {
                if (i < 5) {
                    var symbolInBlank = touchedbutton.addChild(game.make.sprite(((i * 35) - 50), 0, mainGameState.phrase[i]));
                    mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                    symbolInBlank.anchor.setTo(0.5, 0.5);
                    symbolInBlank.scale.setTo(0.6, 0.6);
                }

            }

            if (touchedbutton == mainGameState.definition1.children[0]) {
                mainGameState.definition1.children[1].children[0].visible = false;
            } else if (touchedbutton == mainGameState.definition2.children[0]) {
                mainGameState.definition2.children[1].children[0].visible = false;
            }
        }
        flip5 = false;

    }
}


mainGameState.OnDefineUp = function (touchedbutton) {
    flip5 = true;
}

mainGameState.match = function (word, phrase) {
    console.log("match with " + word + " of phrase " +
        phrase);
}

mainGameState.OnSymbolDown = function (touchedbutton) {

    if (flip2) {
        mainGameState.clickSound.play();

        //ANIMATES THE SYMBOL YOU CLICKED AND ADDS THE KEY OF SAID SYMBOL TO AN OBJECT CALLED PHRASE 
        if (touchedbutton.key != 'open' && touchedbutton.key != 'dictionarylabel' && touchedbutton.key != 'clear') {
            game.add.tween(touchedbutton).to({
                x: touchedbutton.x - 5
            }, 20, Phaser.Easing.Bounce.Out, true);
            mainGameState.phrase[mainGameState.word] = touchedbutton.key;
            mainGameState.word++;

            //SHOWS THE SYMBOLS YOU ARE TYPING IN THE SYMBOL MENU AS YOU TYPE
            if (((mainGameState.symbols.children.length - 1) - mainGameState.symbollength) < 5) {
                var typedsprite = mainGameState.symbols.addChild(game.make.sprite(0, 200, touchedbutton.key));
                typedsprite.x = ((((mainGameState.symbols.children.length - 1) - mainGameState.symbollength) * 28) - 28);
                typedsprite.scale.setTo(.5, .5);
            }

            //REDIRECTS THE SPECIAL BUTTONS TO THEIR OWN FUNCTIONS 
        } else if (touchedbutton.key == 'open') {
            touchedbutton.visible = false;
            mainGameState.expandSymbols();
        } else if (touchedbutton.key == 'dictionarylabel') {
            touchedbutton.visible = false;
            mainGameState.expandDictionary();
        } else if (touchedbutton.key == 'clear') {
            game.add.tween(touchedbutton).to({
                x: touchedbutton.x - 5
            }, 20, Phaser.Easing.Bounce.Out, true);
            mainGameState.Clear(touchedbutton);
        }
        flip2 = false;

    }
}

mainGameState.OnSymbolUp = function (touchedbutton) {
    touchedbutton.visible = true;

    //RETURNS THE SYMBOLS TO THEIR ORIGINAL POSITION FOR FEEDBACK
    if (touchedbutton.key != 'open' && touchedbutton.key != 'dictionarylabel') {
        game.add.tween(touchedbutton).to({
            x: touchedbutton.x + 5
        }, 20, Phaser.Easing.Linear.Out, true);
    }
    flip2 = true;
    flip6 = true;
}


mainGameState.expandSymbols = function () {
    if (flip1) {

        //ANIMATES THE EXPANSION AND COMPRESSION OF THE SYMBOL MENU ON CLICK "OPEN"
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

mainGameState.Clear = function (touchedbutton) {
    if (flip6) {

        //CLEARS OUT THE SYMBOLS SHOWN IN THE SYMBOL MENU AND RESETS PHRASE
        for (i = mainGameState.symbols.children.length - 1; i > mainGameState.symbollength; i--) {
            mainGameState.symbols.children[i].destroy();
        }
        mainGameState.word = 0;
        mainGameState.phrase = [];
        flip6 = false;
    }

};

mainGameState.expandDictionary = function () {
    if (flip4) {
        //ANIMATES EXPANSION AND COMPRESSION OF DICTIONARY MENU
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

mainGameState.OnPlayerDown = function () {
    if (flip3) {
        //REMOVES THE PREVIOUS MESSAGE BEING SAID BY PLAYER SPRITE
        if (((mainGameState.symbols.children.length - 1) - mainGameState.symbollength) != 0) {
            for (var i = mainGameState.symbols.children.length - 1; i > mainGameState.symbollength; i--) {
                mainGameState.symbols.children[i].destroy();
            }
        }

        //ENDS YOUR SPEECH BY CLICKING ON YOURSELF 
        if (mainGameState.playerList[mainGameState.idtoDestroy]) {
            if (mainGameState.idtoDestroy == myPlayerID) {

                if (mainGameState.playerList[mainGameState.idtoDestroy].children[0].visible) {
                    Client.requestEndSpeech();
                }
            }
        }

        //SENDS CLIENT THE PHRASE ON CLICKING SELF
        Client.sendPhrase(mainGameState.phrase);

        //RESETS PHRASE 
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


    //DETERMINES SIZE OF PHRASE
    var size = Object.keys(phrase).length;
    if (size) {

        //PLAY GRUNT SOUND IF THERE IS A PHRASE TO BE DISPLAYED
        mainGameState.playerList[id].children[0].visible = true;
        mainGameState.gruntSound.play();
        mainGameState.gruntSound._sound.playbackRate.value = mainGameState.randomNumFromInterval(.8, 2.5);
    }

    //CREATES THE SYMBOL COMBO FROM THE PHRASE AS A PARENT OF THE PLAYERS SPEECH BUBBLE
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

    //DESTROY THE CURRENT SPEECH 
    if (mainGameState.playerList[mainGameState.idtoDestroy]) {

        var symbols = mainGameState.playerList[mainGameState.idtoDestroy].children[0];
        for (var i = symbols.children.length - 1; i >= 0; i--) {
            symbols.children[i].destroy();
        }
        mainGameState.playerList[mainGameState.idtoDestroy].children[0].visible = false;
    }

}

//THIS FUNCTION MOVES THE PLAYERS
mainGameState.movePlayer = function () {

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