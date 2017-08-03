const UP_ARROW = 0;
const RIGHT_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;

var MOVEMENT = 7;

var myPlayerID = -1;
var otherPlayerID = -1;

//VARIOUS TOGGLES 
var flip1 = true;
var flip2 = true;
var flip3 = true;
var flip4 = true;
var flip5 = true;
var flip6 = true;
var flip7 = false;
var flip8 = true;
var flip9 = true;

var dictionaryOpen = false;



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
    game.load.image('background', 'assets/backgroundlarge.png');
    game.load.image('testbackground', 'assets/background2.png');

    game.load.spritesheet('player1', 'assets/redspritesheet.png', 49, 66);
    game.load.image('redmad', 'assets/redmad.png');
    game.load.image('redscared', 'assets/redscared.png');
    game.load.image('redhappy', 'assets/redhappy.png');
    game.load.image('redconfused', 'assets/redconfused.png');
    game.load.image('redpoint', 'assets/redpoint.png');
    game.load.image('indicator', 'assets/indicator.png');


    game.load.spritesheet('player2', 'assets/bluespritesheet.png', 49, 66);
    game.load.image('bluesad', 'assets/bluesad.png');
    game.load.image('bluemad', 'assets/bluemad.png');
    game.load.image('bluescared', 'assets/bluescared.png');
    game.load.image('bluehappy', 'assets/bluehappy.png');
    game.load.image('blueconfused', 'assets/blueconfused.png');
    game.load.image('bluepoint', 'assets/bluepoint.png');
    game.load.image('indicator2', 'assets/indicator2.png');

    game.load.image('line', 'assets/line.png');
    game.load.image('bubble2', 'assets/speechbubble.png');


    //Symbols
    game.load.image('symbol1', 'assets/symbol1.png');
    game.load.image('symbol2', 'assets/symbol2.png');
    game.load.image('symbol3', 'assets/symbol3.png');
    game.load.image('symbol4', 'assets/symbol4.png');
    game.load.image('symbol5', 'assets/symbol5.png');
    game.load.image('symbol6', 'assets/symbol6.png');
    game.load.image('symbol7', 'assets/symbol7.png');
    game.load.image('symbol8', 'assets/symbol8.png');

    game.load.image('menu', 'assets/menu.png');
    game.load.image('open', 'assets/opentab.png');
    game.load.image('space', 'assets/space.png');
    game.load.image('spaceSymbol', 'assets/spaceSymbol.png');
    game.load.image('clear', 'assets/clear.png');

    game.load.image('dictionary', 'assets/dictionarymenu_2.png');
    game.load.image('dictionarylabel', 'assets/dictionarylabel.png');
    game.load.image('one', 'assets/1.png');
    game.load.image('two', 'assets/2.png');
    game.load.image('three', 'assets/3.png');
    game.load.image('four', 'assets/4.png');
    game.load.image('page1', 'assets/page1_2.png');
    game.load.image('page2', 'assets/page2_2.png');
    game.load.image('page3', 'assets/page3.png');
    game.load.image('page4', 'assets/page4.png');
    game.load.image('symbolspace', 'assets/symbolspace.png');
    game.load.image('checkbox', 'assets/checkbox.png');
    game.load.image('check', 'assets/check.png');
    game.load.image('dictionaryopen', 'assets/dictionaryemblem.png');

    game.load.audio('grunt', 'assets/grunt.wav');
    game.load.audio('click', 'assets/click.wav');
    game.load.audio('success', 'assets/success.mp3');
}

mainGameState.create = function () {
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;
    this.playerList = {};
    mainGameState.phrasetoCompare = [];

    game.world.setBounds(0, 0, 2400, 2400);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    }

    var background = game.add.sprite(0, 0, 'background');
    background.inputEnabled = true;
    background.smoothed = false;
    background.scale.setTo(4, 4);
    background.events.onInputDown.add(mainGameState.clickRequest, this);
    game.input.mouse.capture = true;

    mainGameState.gruntSound = game.add.audio('grunt');
    mainGameState.clickSound = game.add.audio('click');
    mainGameState.successSound = game.add.audio('success');

    mainGameState.indicator = game.add.sprite(0, 0, 'indicator');
    mainGameState.indicator.visible = false;

    mainGameState.indicator2 = game.add.sprite(0, 0, 'indicator2');
    mainGameState.indicator2.visible = false;


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

    this.emotions = {
        sad: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
        mad: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
        happy: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
        scared: game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
        neutral: game.input.keyboard.addKey(Phaser.Keyboard.FIVE)
    };

    this.space = {
        spacebar: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    //UI FUNCTION

    mainGameState.populateSymbols();
    mainGameState.populateDictionary();

    //TEXT TO BE SEEN WHEN A PLAYER IS UNABLE TO PLAY
    mainGameState.roomtext = game.add.text(550, 50, 'Room Number: ');
    mainGameState.roomtext.anchor.setTo(0, 0);
    mainGameState.roomtext.align = "center";
    mainGameState.roomtext.fixedToCamera = true;
    mainGameState.roomtext.font = 'Arial Black';
    mainGameState.roomtext.fontSize = 20;
    mainGameState.roomtext.fill = '#000000';

};

mainGameState.requestNewPlayer = function () {
    if (flip9) {
        Client.askNewPlayer();
        flip9 = false;
    }
}

mainGameState.roomNumberText = function (room) {
    console.log("your room in game" + room);
    mainGameState.roomtext.setText('Room Number: ' + room);
}

mainGameState.clickRequest = function (sprite, pointer) {
    if (pointer.rightButton.isDown) {
        Client.clickRequest({
            id: myPlayerID,
            x: pointer.positionDown.x + game.camera.x,
            y: pointer.positionDown.y + game.camera.y
        });
    }
}

mainGameState.click = function (id, x, y) {
    if (id == 1) {
        if (mainGameState.pointer1) {
            mainGameState.pointer1.destroy();
        }
        mainGameState.pointer1 = game.add.sprite(x - 70, y - 20, 'redpoint');
        game.world.swap(mainGameState.pointer1, mainGameState.symbols);
        game.world.swap(mainGameState.pointer1, mainGameState.dictionary);
        mainGameState.pointer1.scale.setTo(2, 2);
    };
    if (id == 2) {
        if (mainGameState.pointer2) {
            mainGameState.pointer2.destroy();
        }
        mainGameState.pointer2 = game.add.sprite(x - 35, y - 20, 'bluepoint');
        mainGameState.pointer2.scale.setTo(2, 2);
        game.world.swap(mainGameState.pointer2, mainGameState.symbols);
        game.world.swap(mainGameState.pointer2, mainGameState.dictionary);
    };
}

mainGameState.populateSymbols = function () {

    //THIS FUNCTION FILLS OUT THE MENU ON THE LEFT OF THE SCREEN

    //ACTS AS A KEYBOARD

    mainGameState.phrase = {};
    mainGameState.word = 0;

    mainGameState.symbols = game.add.sprite(-155, 0, 'menu');
    mainGameState.symbols.fixedToCamera = true;
    mainGameState.symbols.alpha = 0.8;


    mainGameState.open = mainGameState.symbols.addChild(game.make.sprite(160, 70, 'open'));
    mainGameState.open.inputEnabled = true;
    mainGameState.open.smoothed = false;

    mainGameState.space = mainGameState.symbols.addChild(game.make.sprite(5, 360, 'space'));
    mainGameState.spacebarposition = mainGameState.space.x;
    mainGameState.space.inputEnabled = true;
    mainGameState.space.smoothed = false;

    mainGameState.clear = mainGameState.symbols.addChild(game.make.sprite(82.5, 360, 'clear'));
    mainGameState.clearposition = mainGameState.clear.x;
    mainGameState.clear.inputEnabled = true;
    mainGameState.clear.smoothed = false;

    var symbolarray = ['symbol1', 'symbol2', 'symbol3', 'symbol4', 'symbol5', 'symbol6', 'symbol7', 'symbol8']
    mainGameState.leftsymbolposition = 0;
    mainGameState.rightsymbolposition = 70;

    for (var i = 0; i <= symbolarray.length - 1; i++) {
        if (i % 2 == 0) {
            var currentsymbol = mainGameState.symbols.addChild(game.make.sprite(0, ((i * 35) + 30), symbolarray[i]));
        } else if (Math.abs(i % 2) == 1) {
            var currentsymbol = mainGameState.symbols.addChild(game.make.sprite(70, ((i * 35) - 5), symbolarray[i]));
        }
        currentsymbol.inputEnabled = true;
        currentsymbol.smoothed = false;
        game.physics.arcade.enable(currentsymbol);
        currentsymbol.body.setCircle(32);
    }
    //    //THIS SYMBOL LENGTH IS USED TO REVERT BACK TO DEFAULT CHILD LENGTH LATER

    mainGameState.symbollength = mainGameState.symbols.children.length - 1;

}

mainGameState.populateDictionary = function () {

    //POPULATES THE DICTIONARY MENU AT THE BOTTOM OF THE SCREEN 



    mainGameState.dictionary = game.add.sprite(0, 690, 'dictionary');
    mainGameState.dictionary.fixedToCamera = true;
    mainGameState.dictionary.alpha = 0.85;


    mainGameState.Page1 = mainGameState.dictionary.addChild(game.make.sprite(0, 0, 'page1'));
    mainGameState.Page1.visible = true;
    mainGameState.Page1.alpha = .85;
    mainGameState.activePage = mainGameState.Page1;

    mainGameState.Page2 = mainGameState.dictionary.addChild(game.make.sprite(0, 0, 'page2'));
    mainGameState.Page2.visible = false;
    mainGameState.Page2.alpha = .85;

    mainGameState.Page3 = mainGameState.dictionary.addChild(game.make.sprite(0, 0, 'page3'));
    mainGameState.Page3.visible = false;
    mainGameState.Page3.alpha = .85;

    mainGameState.Page4 = mainGameState.dictionary.addChild(game.make.sprite(0, 0, 'page4'));
    mainGameState.Page4.visible = false;
    mainGameState.Page4.alpha = .85;

    mainGameState.otherCheck1 = mainGameState.dictionary.addChild(game.make.sprite(765, 200, 'check'));
    mainGameState.otherCheck1.anchor.setTo(0.5, 0.5);
    mainGameState.otherCheck1.visible = false;
    mainGameState.otherCheck1.scale.setTo(.6, .6);

    mainGameState.otherCheck2 = mainGameState.dictionary.addChild(game.make.sprite(765, 300, 'check'));
    mainGameState.otherCheck2.anchor.setTo(0.5, 0.5);
    mainGameState.otherCheck2.visible = false;
    mainGameState.otherCheck2.scale.setTo(.6, .6);


    mainGameState.dictionarylabel = mainGameState.dictionary.addChild(game.make.sprite(460, 75, 'dictionarylabel'));
    mainGameState.dictionarylabel.inputEnabled = true;
    mainGameState.dictionarylabel.smoothed = false

    mainGameState.oneButton = mainGameState.dictionary.addChild(game.make.sprite(750, 220, 'one'));
    mainGameState.oneButton.inputEnabled = true;
    mainGameState.twoButton = mainGameState.dictionary.addChild(game.make.sprite(750, 320, 'two'));
    mainGameState.twoButton.inputEnabled = true;
    mainGameState.threeButton = mainGameState.dictionary.addChild(game.make.sprite(750, 420, 'three'));
    mainGameState.threeButton.visible = false;
    mainGameState.threeButton.inputEnabled = true;
    mainGameState.fourButton = mainGameState.dictionary.addChild(game.make.sprite(750, 520, 'four'));
    mainGameState.fourButton.visible = false;
    mainGameState.fourButton.inputEnabled = true;

    mainGameState.dictionarytext = mainGameState.dictionary.addChild(game.add.text(400, 200, 'Reach Agreement, Define Meaning', {
        font: '32px Georgia',
        fill: '#000000',
        align: 'center'
    }));
    mainGameState.dictionarytext.anchor.setTo(0.5, 0.5);



    //WHEN YOU WANT TO SEARCH THROUGH THE ACTUAL DEFINED WORDS START WITH I = 2 (INDEX OF GREEN IN CHILDREN)

    //Array featuring all words
    var dictionaryarray = ['Yes: ', 'No: ', 'Follow: ', 'Watch: ', 'Listen: ', 'And: ', '?: ', 'Dictionary: ',
                           'Blue: ', 'Red: ', 'Circle: ', 'Square: ', 'Blue\nPlayer: ', 'Red\nPlayer: ', 'Purple: ', 'Shapes: ',
                           'Page3: ', 'Mean: ', 'Friendly: ', 'Bumpy: ', 'Smooth: ', 'Pointy: ', 'Round: ', 'Throw: ',
                           'Page4: ', 'Eat: ', 'Dangerous: ', 'Helpful: ', 'Monster: ', 'Animal: ', 'Goal: ', 'Team: '];

    for (var i = 0; i <= dictionaryarray.length - 1; i++) {
        //Page 1
        if (i <= 7) {

            if (i % 2 == 0) {

                var dictionaryentry = mainGameState.Page1.addChild(game.add.text(100, ((i * 50) + 300), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            } else if (Math.abs(i % 2) == 1) {

                var dictionaryentry = mainGameState.Page1.addChild(game.add.text(450, ((i * 50) + 250), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            }
            //Page 2
        } else if (i > 7 && i <= 15) {

            if (i % 2 == 0) {
                dictionaryentry = mainGameState.Page2.addChild(game.add.text(100, ((i * 50) - 100), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            } else if (Math.abs(i % 2) == 1) {

                dictionaryentry = mainGameState.Page2.addChild(game.add.text(450, ((i * 50) - 150), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            }
            //Page 3
        } else if (i > 15 && i <= 23) {

            if (i % 2 == 0) {
                dictionaryentry = mainGameState.Page3.addChild(game.add.text(100, ((i * 50) - 500), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            } else if (Math.abs(i % 2) == 1) {
                dictionaryentry = mainGameState.Page3.addChild(game.add.text(450, ((i * 50) - 550), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            }
            //Page 4
        } else if (i > 23 && i <= 32) {

            if (i % 2 == 0) {
                dictionaryentry = mainGameState.Page4.addChild(game.add.text(100, ((i * 50) - 900), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            } else if (Math.abs(i % 2) == 1) {
                dictionaryentry = mainGameState.Page4.addChild(game.add.text(450, ((i * 50) - 950), dictionaryarray[i], {
                    font: '28px Georgia',
                    fill: '#000000',
                    align: 'left'
                }));
            }
        }
        dictionaryentry.anchor.setTo(0.5, 0.5);
        var symbolspace = dictionaryentry.addChild(game.make.sprite(120, -10, 'symbolspace'));
        symbolspace.anchor.setTo(0.5, 0.5);
        symbolspace.inputEnabled = true;
        //PLAYERS CAN CLICK ON CHECKBOX TO SEND SYMBOL COMBO TO SERVER TO COMPARE WITH TEAMMATE
        var checkbox = dictionaryentry.addChild(game.make.sprite(250, -10, 'checkbox'));
        checkbox.anchor.setTo(0.5, 0.5);
        checkbox.inputEnabled = true;
        //CHECK WILL APPEAR WHEN CHECKBOX IS CLICKED
        var check = checkbox.addChild(game.make.sprite(15, -10, 'check'));
        check.anchor.setTo(0.5, 0.5);
        check.visible = false;

    }
}


mainGameState.addNewPlayer = function (id, x, y) {
    if (id == 1 || id == 2) {
        console.log("adding new player" + id + " in game.");
        // --- Player Initialization ---
        if (id == 1) {
            mainGameState.playerList[id] = game.add.sprite(x, y, 'player1');
            mainGameState.playerList[id].animations.add('forward', [0], 8, true);
            mainGameState.playerList[id].animations.add('forwardRight', [1], 8, true);
            mainGameState.playerList[id].animations.add('right', [2], 8, true);
            mainGameState.playerList[id].animations.add('backRight', [3], 8, true);
            mainGameState.playerList[id].animations.add('back', [4], 8, true);
            mainGameState.playerList[id].animations.add('backLeft', [5], 8, true);
            mainGameState.playerList[id].animations.add('left', [6], 8, true);
            mainGameState.playerList[id].animations.add('forwardLeft', [7], 8, true);
            mainGameState.player1x = mainGameState.playerList[id].x;
            mainGameState.player1y = mainGameState.playerList[id].y;
        } else if (id == 2) {
            mainGameState.playerList[id] = game.add.sprite(x, y, 'player2');
            mainGameState.playerList[id].animations.add('forward', [0], 8, true);
            mainGameState.playerList[id].animations.add('forwardRight', [1], 8, true);
            mainGameState.playerList[id].animations.add('right', [2], 8, true);
            mainGameState.playerList[id].animations.add('backRight', [3], 8, true);
            mainGameState.playerList[id].animations.add('back', [4], 8, true);
            mainGameState.playerList[id].animations.add('backLeft', [5], 8, true);
            mainGameState.playerList[id].animations.add('left', [6], 8, true);
            mainGameState.playerList[id].animations.add('forwardLeft', [7], 8, true);
            mainGameState.player2x = mainGameState.playerList[id].x;
            mainGameState.player2y = mainGameState.playerList[id].y;
        }
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

        //SETS UP THE SPEECH BUBBLES FOR PLAYER 2
        mainGameState.playerList[id].addChild(game.make.sprite(0, -45, 'bubble2'));
        mainGameState.playerList[id].children[0].visible = false;
        mainGameState.playerList[id].children[0].anchor.setTo(0.5, 0.5);

        if (id == 1) {
            var eye = mainGameState.playerList[id].addChild(game.add.sprite(-17.5, -31, 'redhappy'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-17.5, -31, 'redconfused'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-17.5, -31, 'redmad'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-17.5, -31, 'redscared'));
            eye.visible = false;
            eye.smoothed = false;
        } else if (id == 2) {
            var eye = mainGameState.playerList[id].addChild(game.add.sprite(-14.5, -4.0, 'bluehappy'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-14.5, -4.0, 'blueconfused'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-14.5, -4.0, 'bluemad'));
            eye.visible = false;
            eye.smoothed = false;
            eye = mainGameState.playerList[id].addChild(game.add.sprite(-14.5, -4.0, 'bluescared'));
            eye.visible = false;
            eye.smoothed = false;
        }

        game.camera.follow(mainGameState.playerList[myPlayerID]);
    }
};

mainGameState.update = function () {

    if (myPlayerID == 1 || myPlayerID == 2) {
        this.movePlayer();
        mainGameState.requestEmote();
        game.camera.follow(mainGameState.playerList[myPlayerID]);

        this.animatePlayers();

        this.playerIndicator();

        //DIRECT MOUSE IMPUT TO VARIOUS FUNCTIONS. SHORTEN LATER THROUGH LOOPS

        for (var i = 0; i <= mainGameState.symbols.children.length - 1; i++) {
            mainGameState.symbols.children[i].events.onInputDown.add(mainGameState.OnSymbolDown, this);
            mainGameState.symbols.children[i].events.onInputUp.add(mainGameState.OnSymbolUp, this);
        }

        if (mainGameState.dictionary.children) {

            mainGameState.dictionary.children[6].events.onInputDown.add(mainGameState.OnSymbolDown, this);
            mainGameState.dictionary.children[6].events.onInputUp.add(mainGameState.OnSymbolUp, this);
        }

        if (myPlayerID >= 0) {

            mainGameState.playerList[myPlayerID].events.onInputDown.add(mainGameState.OnPlayerDown, this);
            mainGameState.playerList[myPlayerID].events.onInputUp.add(mainGameState.OnPlayerUp, this);

        };

        mainGameState.oneButton.events.onInputDown.add(mainGameState.dictionaryButtonPressed, this);
        mainGameState.twoButton.events.onInputDown.add(mainGameState.dictionaryButtonPressed, this);
        //        mainGameState.threeButton.events.onInputDown.add(mainGameState.dictionaryButtonPressed, this);
        //        mainGameState.fourButton.events.onInputDown.add(mainGameState.dictionaryButtonPressed, this);

        //FOR LOOP FOR THE DEFINED WORDS
        if (mainGameState.Page1.children && mainGameState.Page2.children && mainGameState.Page3.children && mainGameState.Page4.children) {
            for (i = 0; i <= mainGameState.Page1.children.length - 1; i++) {
                if (mainGameState.dictionary.children[i]) {
                    mainGameState.Page1.children[i].children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page1.children[i].children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
                    mainGameState.Page1.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page1.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineUp, this);

                    mainGameState.Page2.children[i].children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page2.children[i].children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
                    mainGameState.Page2.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page2.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineUp, this);

                    mainGameState.Page3.children[i].children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page3.children[i].children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
                    mainGameState.Page3.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page3.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineUp, this);

                    mainGameState.Page4.children[i].children[0].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page4.children[i].children[0].events.onInputUp.add(mainGameState.OnDefineUp, this);
                    mainGameState.Page4.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineDown, this);
                    mainGameState.Page4.children[i].children[1].events.onInputDown.add(mainGameState.OnDefineUp, this);
                }
            }
        }

        if (dictionaryOpen && flip8) {
            Client.dictionaryInUse();
            flip8 = false;
            //this needs to take into account only the dictionary that was opened
        } else if (!dictionaryOpen && flip7) {
            console.log("dictionary Open " + dictionaryOpen + "flip7" + flip7);
            mainGameState.dictionaryCloseRequest();
        }
    }
}

mainGameState.playerIndicator = function () {
    if (myPlayerID == 1) {
        var myIndicator = mainGameState.indicator;
    }
    if (myPlayerID == 2) {
        var myIndicator = mainGameState.indicator2;
    }

    if (mainGameState.playerList[otherPlayerID] && mainGameState.playerList[myPlayerID]) {

        var deltaX = mainGameState.playerList[otherPlayerID].x - mainGameState.playerList[myPlayerID].x;
        var deltaY = mainGameState.playerList[otherPlayerID].y - mainGameState.playerList[myPlayerID].y;
        if (!mainGameState.playerList[otherPlayerID].inCamera) {
            myIndicator.visible = true;
            var m = deltaY / deltaX;
            var b = mainGameState.playerList[myPlayerID].y - (mainGameState.playerList[myPlayerID].x * m);
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    //all of this is relative to the camera
                    var x = game.camera.x + 750;
                    var y = x * m + b;
                    myIndicator.x = x;
                    myIndicator.y = y;
                } else if (deltaX < 0) {
                    var x = game.camera.x + 50;
                    var y = x * m + b;
                    myIndicator.x = x;
                    myIndicator.y = y;
                } else if (deltaX == 0) {
                    var x = mainGameState.playerList[myPlayerID].x;
                    var y = game.camera.y + 50;
                    myIndicator.x = x;
                    myIndicator.y = y;
                }
            } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
                if (deltaY > 0) {
                    var y = game.camera.y + 750;
                    var x = (y - b) / m;
                    myIndicator.x = x;
                    myIndicator.y = y;
                } else if (deltaY < 0) {
                    var y = game.camera.y + 50;
                    var x = (y - b) / m;
                    myIndicator.x = x;
                    myIndicator.y = y;
                } else if (deltaY == 0) {
                    var y = mainGameState.playerList[myPlayerID].y;
                    var x = game.camera.x + 50;
                    myIndicator.x = x;
                    myIndicator.y = y;
                }
            } else if (Math.abs(deltaX) == Math.abs(deltaY)) {
                if (deltaX > 0) {
                    var x = game.camera.x + 750;
                    var y = game.camera.y + 750;
                    myIndicator.x = x;
                    myIndicator.y = y;
                } else if (deltaX < 0) {
                    var x = game.camera.x + 50;
                    var y = game.camera.y + 50;
                    myIndicator.x = x;
                    myIndicator.y = y;
                }

            }
        } else {
            myIndicator.visible = false;
        }


    }
}

mainGameState.animatePlayers = function () {

    //Optimize later
    if (mainGameState.playerList[1]) {

        if (mainGameState.playerList[1].x - mainGameState.player1x > 0 && mainGameState.playerList[1].y - mainGameState.player1y == 0) {
            mainGameState.playerList[1].animations.play('right');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x < 0 && mainGameState.playerList[1].y - mainGameState.player1y == 0) {
            mainGameState.playerList[1].animations.play('left');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x == 0 && mainGameState.playerList[1].y - mainGameState.player1y < 0) {
            mainGameState.playerList[1].animations.play('back');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x == 0 && mainGameState.playerList[1].y - mainGameState.player1y > 0) {
            mainGameState.playerList[1].animations.play('forward');
            mainGameState.emote(1, mainGameState.currentEmotion1);
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x > 0 && mainGameState.playerList[1].y - mainGameState.player1y > 0) {
            mainGameState.playerList[1].animations.play('forwardRight');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x > 0 && mainGameState.playerList[1].y - mainGameState.player1y < 0) {
            mainGameState.playerList[1].animations.play('backRight');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x < 0 && mainGameState.playerList[1].y - mainGameState.player1y < 0) {
            mainGameState.playerList[1].animations.play('backLeft');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }
        if (mainGameState.playerList[1].x - mainGameState.player1x < 0 && mainGameState.playerList[1].y - mainGameState.player1y > 0) {
            mainGameState.playerList[1].animations.play('forwardLeft');
            mainGameState.playerList[1].children[1].visible = false;
            mainGameState.playerList[1].children[2].visible = false;
            mainGameState.playerList[1].children[3].visible = false;
            mainGameState.playerList[1].children[4].visible = false;
        }

        mainGameState.player1x = mainGameState.playerList[1].x;
        mainGameState.player1y = mainGameState.playerList[1].y;

    }

    if (mainGameState.playerList[2]) {

        if (mainGameState.playerList[2].x - mainGameState.player2x > 0 && mainGameState.playerList[2].y - mainGameState.player2y == 0) {
            mainGameState.playerList[2].animations.play('right');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x < 0 && mainGameState.playerList[2].y - mainGameState.player2y == 0) {
            mainGameState.playerList[2].animations.play('left');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x == 0 && mainGameState.playerList[2].y - mainGameState.player2y < 0) {
            mainGameState.playerList[2].animations.play('back');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x == 0 && mainGameState.playerList[2].y - mainGameState.player2y > 0) {
            mainGameState.playerList[2].animations.play('forward');
            mainGameState.emote(2, mainGameState.currentEmotion2);
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x > 0 && mainGameState.playerList[2].y - mainGameState.player2y > 0) {
            mainGameState.playerList[2].animations.play('forwardRight');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x > 0 && mainGameState.playerList[2].y - mainGameState.player2y < 0) {
            mainGameState.playerList[2].animations.play('backRight');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x < 0 && mainGameState.playerList[2].y - mainGameState.player2y < 0) {
            mainGameState.playerList[2].animations.play('backLeft');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }
        if (mainGameState.playerList[2].x - mainGameState.player2x < 0 && mainGameState.playerList[2].y - mainGameState.player2y > 0) {
            mainGameState.playerList[2].animations.play('forwardLeft');
            mainGameState.playerList[2].children[1].visible = false;
            mainGameState.playerList[2].children[2].visible = false;
            mainGameState.playerList[2].children[3].visible = false;
            mainGameState.playerList[2].children[4].visible = false;
        }

        mainGameState.player2x = mainGameState.playerList[2].x;
        mainGameState.player2y = mainGameState.playerList[2].y;
    }
}




mainGameState.dictionaryInUse = function (id) {
    flip7 = true;
    console.log("dictionary opened");
    mainGameState.idtoDestroy = id;
    if (id == 1) {
        var emblem = mainGameState.playerList[id].addChild(game.make.sprite(-2, 5, 'dictionaryopen'));
    }
    if (id == 2) {
        var emblem = mainGameState.playerList[id].addChild(game.make.sprite(-1, 23, 'dictionaryopen'));
    }
    //var emblem = mainGameState.playerList[id].children[0].addChild(game.make.sprite(-50, 0, 'dictionaryopen'));
    emblem.anchor.setTo(0.5, 0.5);
    emblem.smoothed = false;
    emblem.scale.setTo(0.4, 0.4);
}

mainGameState.dictionaryButtonPressed = function (touchedbutton) {
    if (touchedbutton == mainGameState.oneButton) {
        mainGameState.Page1.visible = true;
        mainGameState.Page2.visible = false;
        mainGameState.Page3.visible = false;
        mainGameState.Page4.visible = false;
        mainGameState.activePage = mainGameState.Page1;
    } else if (touchedbutton == mainGameState.twoButton) {
        mainGameState.Page1.visible = false;
        mainGameState.Page2.visible = true;
        mainGameState.Page3.visible = false;
        mainGameState.Page4.visible = false;
        mainGameState.activePage = mainGameState.Page2;
    } else if (touchedbutton == mainGameState.threeButton) {
        mainGameState.Page1.visible = false;
        mainGameState.Page2.visible = false;
        mainGameState.Page3.visible = true;
        mainGameState.Page4.visible = false;
        mainGameState.activePage = mainGameState.Page3;
    } else if (touchedbutton == mainGameState.fourButton) {
        mainGameState.Page1.visible = false;
        mainGameState.Page2.visible = false;
        mainGameState.Page3.visible = false;
        mainGameState.Page4.visible = true;
        mainGameState.activePage = mainGameState.Page4;
    }

}

mainGameState.dictionaryCloseRequest = function () {
    console.log("dictionary close request activated");
    flip8 = true;
    Client.requestDictionaryClose();
}

mainGameState.dictionaryClosed = function (id) {
    if (mainGameState.playerList[id].children[5]) {
        mainGameState.playerList[id].children[5].destroy();
    }
}

mainGameState.OnDefineDown = function (touchedbutton) {
    //WHEN A PLAYER PRESSES EITHER CHECKBOX OR SYMBOLSPACE THIS FUNCTION IS CALLED
    if (flip5) {
        if (touchedbutton.key == 'checkbox') {
            mainGameState.clickSound.play();

            //CHECKS MATCHING WORD SYMBOL COMBO IN YOUR DICTIONARY
            //SENDS SAID MATCH TO THE SERVER
            var checkOnPage;
            for (var i = 0; i <= mainGameState.activePage.children.length - 1; i++) {
                //searches all word checkmarks
                if (touchedbutton == mainGameState.activePage.children[i].children[1]) {
                    touchedbutton.children[0].visible = !touchedbutton.children[0].visible;
                    if (touchedbutton.children[0].visible) {
                        checkOnPage = true;
                        console.log(mainGameState.phrasetoCompare);
                        Client.sendForCompare({
                            id: myPlayerID,
                            page: mainGameState.activePage.key,
                            phrase: mainGameState.phrasetoCompare,
                            word: i
                        });
                    } else if (!touchedbutton.children[0].visible) {
                        Client.sendForCompare({
                            id: myPlayerID,
                            page: mainGameState.activePage.key,
                            phrase: "",
                            word: i
                        });
                        for (var i = 0; i <= mainGameState.activePage.children.length - 1; i++) {
                            if (mainGameState.activePage.children[i].children[1].children[0].visible) {
                                checkOnPage = true;
                            }
                            if (!mainGameState.activePage.children[i].children[1].children[0].visible && !checkOnPage) {
                                checkOnPage = false;
                            }
                        }
                    }

                }
            }
            console.log("check on page" + checkOnPage);
            if (checkOnPage) {
                console.log("checkonpage" + checkOnPage);
                Client.otherCheckBox({
                    page: mainGameState.activePage.key,
                    active: true
                });
            } else if (!checkOnPage) {
                console.log("checkonpage" + checkOnPage);
                Client.otherCheckBox({
                    page: mainGameState.activePage.key,
                    active: false
                });
            }
        }

        if (touchedbutton.key == 'symbolspace') {
            for (var i = 0; i <= mainGameState.activePage.children.length - 1; i++) {
                if (touchedbutton == mainGameState.activePage.children[i].children[0]) {
                    if (mainGameState.activePage.children[i].children[1].visible) {
                        var edit = true;
                    } else {
                        edit = false;
                    }
                }
            }
            if (edit) {
                mainGameState.clickSound.play();
                //CLEARS OUT CHILDREN ARRAY OF THE SYMBOLSPACE YOU HIT
                touchedbutton.children = [];
                mainGameState.phrasetoCompare = [];
                mainGameState.decreaseIndex = 0;
                //FILLS OUT CHILDREN ARRAY OF SYMBOLSPACE YOU HIT BASED ON CURRENT PHRASE IN SYMBOL MENU
                for (var i = 0; i <= Object.keys(mainGameState.phrase).length - 1; i++) {
                    //input of symbols needs to only be allowed when checkbox is visible 
                    if (touchedbutton.children[i - 1]) {
                        if (mainGameState.phrase[i - 1] != 'spaceSymbol' && mainGameState.phrase[i] != 'spaceSymbol') {
                            var n = touchedbutton.children[i - 1].x;
                            var symbolInBlank = touchedbutton.addChild(game.make.sprite((n + 25), 0, mainGameState.phrase[i]));
                            symbolInBlank.scale.setTo(.25, .25);
                            mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                            symbolInBlank.anchor.setTo(0.5, 0.5);
                            symbolInBlank.scale.setTo(0.4, 0.4);
                            console.log("nonspace placed after nonspace");
                        } else if (mainGameState.phrase[i - 1] == 'spaceSymbol' && mainGameState.phrase[i] != 'spaceSymbol') {
                            var n = touchedbutton.children[i - 1].x;
                            var symbolInBlank = touchedbutton.addChild(game.make.sprite((n + 15), 0, mainGameState.phrase[i]));
                            symbolInBlank.scale.setTo(.25, .25);
                            mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                            symbolInBlank.anchor.setTo(0.5, 0.5);
                            symbolInBlank.scale.setTo(0.4, 0.4);
                            console.log("nonspace placed after space");
                        }
                        if (mainGameState.phrase[i - 1] == 'spaceSymbol' && mainGameState.phrase[i] == 'spaceSymbol') {
                            var n = touchedbutton.children[i - 1].x;
                            var symbolInBlank = touchedbutton.addChild(game.make.sprite((n + 10), 0, mainGameState.phrase[i]));
                            symbolInBlank.scale.setTo(.25, .25);
                            mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                            symbolInBlank.anchor.setTo(0.5, 0.5);
                            symbolInBlank.scale.setTo(0.4, 0.4);
                            console.log("space placed after space");
                        } else if (mainGameState.phrase[i - 1] != 'spaceSymbol' && mainGameState.phrase[i] == 'spaceSymbol') {
                            var n = touchedbutton.children[i - 1].x;
                            var symbolInBlank = touchedbutton.addChild(game.make.sprite((n + 15), 0, mainGameState.phrase[i]));
                            symbolInBlank.scale.setTo(.25, .25);
                            mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                            symbolInBlank.anchor.setTo(0.5, 0.5);
                            symbolInBlank.scale.setTo(0.4, 0.4);
                            console.log("space placed after nonspace");
                        }

                    } else {
                        var symbolInBlank = touchedbutton.addChild(game.make.sprite(((i * 25) - 65), 0, mainGameState.phrase[i]));
                        symbolInBlank.scale.setTo(.25, .25);
                        mainGameState.phrasetoCompare[i] = mainGameState.phrase[i];
                        symbolInBlank.anchor.setTo(0.5, 0.5);
                        symbolInBlank.scale.setTo(0.4, 0.4);
                        console.log("first symbol placed");

                    }
                }

            }

            for (i = 0; i <= mainGameState.activePage.children.length - 1; i++) {
                if (touchedbutton == mainGameState.activePage.children[i].children[0]) {
                    if (mainGameState.activePage.children[i].children[1].children[0].visible) {
                        Client.sendForCompare({
                            id: myPlayerID,
                            page: mainGameState.activePage.key,
                            phrase: mainGameState.phrasetoCompare,
                            word: i
                        });
                    }
                }
            }
        }
    }
    flip5 = false;

}

mainGameState.otherCheck = function (page, check) {
    if (page == "page1") {
        console.log("other check " + check + " on page 1");
        mainGameState.otherCheck1.visible = check;
        console.log(mainGameState.otherCheck1.visible);
    } else if (page == "page2") {
        mainGameState.otherCheck2.visible = check;
    } else if (page == "page3") {
        active = mainGameState.Page3;
    } else if (page == "page4") {
        active = mainGameState.Page4;
    }

}


mainGameState.OnDefineUp = function (touchedbutton) {
    flip5 = true;
}

mainGameState.match = function (word, phrase, page) {
    var play = true;
    if (page == "page1") {
        active = mainGameState.Page1;
    } else if (page == "page2") {
        active = mainGameState.Page2;
    } else if (page == "page3") {
        active = mainGameState.Page3;
    } else if (page == "page4") {
        active = mainGameState.Page4;
    }
    active.children[word].children[1].visible = false;
    if (play == true) {
        mainGameState.successSound.play();
        mainGameState.successSound.volume = .5;
        play = false;
    }
}

mainGameState.OnSymbolDown = function (touchedbutton) {

    if (flip2) {
        mainGameState.clickSound.play();

        //ANIMATES THE SYMBOL YOU CLICKED AND ADDS THE KEY OF SAID SYMBOL TO AN OBJECT CALLED PHRASE 
        if (touchedbutton.key != 'open' && touchedbutton.key != 'dictionarylabel' && touchedbutton.key != 'clear' && touchedbutton.key != 'space') {
            //SHOWS THE SYMBOLS YOU ARE TYPING IN THE SYMBOL MENU AS YOU TYPE
            if (mainGameState.symbols.children[mainGameState.symbols.children.length - 1].x < 110) {
                touchedbutton.visible = false;
                mainGameState.phrase[mainGameState.word] = touchedbutton.key;
                mainGameState.word++;
                var typedsprite = mainGameState.symbols.addChild(game.make.sprite(0, 310, touchedbutton.key));
                var n = mainGameState.symbols.children.length - 2;
                console.log(mainGameState.symbols.children.length - 2);
                if (n > 10 && (mainGameState.symbols.children[n].key != 'spaceSymbol')) {
                    typedsprite.x = (mainGameState.symbols.children[n].x + 20);
                    typedsprite.scale.setTo(.33, .33);
                } else if (n > 10 && (mainGameState.symbols.children[n].key == 'spaceSymbol')) {
                    typedsprite.x = (mainGameState.symbols.children[n].x + 5);
                    typedsprite.scale.setTo(.33, .33);
                } else if (n == 10) {
                    typedsprite.x = 0;
                    typedsprite.scale.setTo(.33, .33);
                }
            }


            //REDIRECTS THE SPECIAL BUTTONS TO THEIR OWN FUNCTIONS 
        } else if (touchedbutton.key == 'open') {
            touchedbutton.visible = false;
            mainGameState.expandSymbols();
        } else if (touchedbutton.key == 'dictionarylabel') {
            touchedbutton.visible = false;
            mainGameState.expandDictionary();
        } else if (touchedbutton.key == 'space') {
            touchedbutton.visible = false;
            if (mainGameState.symbols.children[mainGameState.symbols.children.length - 1].x < 125) {
                mainGameState.phrase[mainGameState.word] = 'spaceSymbol';
                mainGameState.word++;
                var typedsprite = mainGameState.symbols.addChild(game.make.sprite(0, 310, 'spaceSymbol'));
                var n = mainGameState.symbols.children.length - 2;
                if (n > 10 && (mainGameState.symbols.children[n].key != 'spaceSymbol')) {
                    typedsprite.x = (mainGameState.symbols.children[n].x + 25);
                    typedsprite.scale.setTo(.33, .33);
                } else if (n > 10 && (mainGameState.symbols.children[n].key == 'spaceSymbol')) {
                    typedsprite.x = (mainGameState.symbols.children[n].x + 10);
                    typedsprite.scale.setTo(.33, .33);
                } else if (n == 10) {
                    typedsprite.x = 3;
                    typedsprite.scale.setTo(.33, .33);
                }

            }
        } else if (touchedbutton.key == 'clear') {
            touchedbutton.visible = false;
            mainGameState.Clear(touchedbutton);
        }
        flip2 = false;
    }
}


mainGameState.OnSymbolUp = function (touchedbutton) {
    touchedbutton.visible = true;
    flip2 = true;
    flip6 = true;
}


mainGameState.expandSymbols = function () {
    if (flip1) {

        //ANIMATES THE EXPANSION AND COMPRESSION OF THE SYMBOL MENU ON CLICK "OPEN"
        game.add.tween(mainGameState.symbols.cameraOffset).to({
            x: 0
        }, 700, Phaser.Easing.Bounce.Out, true);
        flip1 = false;
    } else if (!flip1) {

        game.add.tween(mainGameState.symbols.cameraOffset).to({
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
        game.add.tween(mainGameState.dictionary.cameraOffset).to({
            y: 150
        }, 600, Phaser.Easing.Bounce.Out, true);
        dictionaryOpen = true;
        flip4 = false;
    } else if (!flip4) {

        game.add.tween(mainGameState.dictionary.cameraOffset).to({
            y: 690
        }, 400, Phaser.Easing.Elastic.Out, true);
        dictionaryOpen = false;
        //this is affecting other player
        flip4 = true;
    }
}

mainGameState.OnPlayerDown = function () {
    if (flip3 && !dictionaryOpen) {
        //REMOVES THE PREVIOUS MESSAGE BEING SAID BY PLAYER SPRITE
        if (((mainGameState.symbols.children.length - 1) - mainGameState.symbollength) != 0) {
            for (var i = mainGameState.symbols.children.length - 1; i > mainGameState.symbollength; i--) {
                // mainGameState.symbols.children[i].destroy();
            }
        }

        //ENDS YOUR SPEECH BY CLICKING ON YOURSELF 
        if (mainGameState.playerList[mainGameState.idtoDestroy]) {
            if (mainGameState.idtoDestroy == myPlayerID) {
                if (!dictionaryOpen) {

                    if (mainGameState.playerList[mainGameState.idtoDestroy].children[0].visible) {
                        Client.requestEndSpeech();
                    }
                }
            }
        }

        //SENDS CLIENT THE PHRASE ON CLICKING SELF
        Client.sendPhrase(mainGameState.phrase);

        //RESETS PHRASE 
        //        mainGameState.word = 0;
        //        mainGameState.phrase = [];
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
        if (mainGameState.playerList[id].children[0].children[mainGameState.playerList[id].children[0].children.length - 1]) {
            if (mainGameState.playerList[id].children[0].children[mainGameState.playerList[id].children[0].children.length - 1].x < 1000) {
                console.log("for loop activated");
                if (phrase[i - 1] != 'spaceSymbol' && phrase[i] != 'spaceSymbol') {
                    var n = mainGameState.playerList[id].children[0].children[i - 1].x;
                    var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite(n + 12.5, -17, phrase[i]));
                    symbolSprite.scale.setTo(.25, .25);
                    console.log("nonspace placed after nonspace");
                } else if (phrase[i - 1] == 'spaceSymbol' && phrase[i] != 'spaceSymbol') {
                    var n = mainGameState.playerList[id].children[0].children[i - 1].x;
                    var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite(n + 2, -17, phrase[i]));
                    symbolSprite.scale.setTo(.25, .25);
                    console.log("nonspace placed after space");
                }


                if (phrase[i - 1] == 'spaceSymbol' && phrase[i] == 'spaceSymbol') {
                    var n = mainGameState.playerList[id].children[0].children[i - 1].x;
                    var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite(n + 2, -17, phrase[i]));
                    symbolSprite.scale.setTo(.25, .25);
                    console.log("space placed after space");
                } else if (phrase[i - 1] != 'spaceSymbol' && phrase[i] == 'spaceSymbol') {
                    var n = mainGameState.playerList[id].children[0].children[i - 1].x;
                    var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite(n + 15, -17, phrase[i]));
                    symbolSprite.scale.setTo(.25, .25);
                    console.log("space placed after nonspace");
                }
            }
        } else {
            var symbolSprite = mainGameState.playerList[id].children[0].addChild(game.make.sprite((i * 17) - 47, -17, phrase[i]));
            symbolSprite.scale.setTo(.25, .25);
            console.log("symbol placed");
        }
    }

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

mainGameState.requestEmote = function () {
    if (this.emotions.happy.isDown) {
        Client.requestEmote({
            id: myPlayerID,
            emotion: "happy"
        });

    }
    if (this.emotions.sad.isDown) {
        Client.requestEmote({
            id: myPlayerID,
            emotion: "confused"
        });
    }
    if (this.emotions.mad.isDown) {
        Client.requestEmote({
            id: myPlayerID,
            emotion: "mad"
        });
    }
    if (this.emotions.scared.isDown) {
        Client.requestEmote({
            id: myPlayerID,
            emotion: "scared"
        });
    }
    if (this.emotions.neutral.isDown) {
        Client.requestEmote({
            id: myPlayerID,
            emotion: "neutral"
        });
    }
}

mainGameState.emote = function (id, emotion) {
    if (id == 1) {
        mainGameState.currentEmotion1 = emotion;
        if (mainGameState.playerList[id].animations.frame == 0) {
            if (mainGameState.currentEmotion1 == "happy") {
                mainGameState.playerList[id].children[1].visible = true;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion1 == "confused") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = true;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion1 == "mad") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = true;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion1 == "scared") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = true;
            }
            if (mainGameState.currentEmotion1 == "neutral") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
        } else {
            mainGameState.playerList[id].children[1].visible = false;
            mainGameState.playerList[id].children[2].visible = false;
            mainGameState.playerList[id].children[3].visible = false;
            mainGameState.playerList[id].children[4].visible = false;
        }
    }

    if (id == 2) {
        mainGameState.currentEmotion2 = emotion;
        if (mainGameState.playerList[id].animations.frame == 0) {
            if (mainGameState.currentEmotion2 == "happy") {
                mainGameState.playerList[id].children[1].visible = true;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion2 == "confused") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = true;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion2 == "mad") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = true;
                mainGameState.playerList[id].children[4].visible = false;
            }
            if (mainGameState.currentEmotion2 == "scared") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = true;
            }
            if (mainGameState.currentEmotion2 == "neutral") {
                mainGameState.playerList[id].children[1].visible = false;
                mainGameState.playerList[id].children[2].visible = false;
                mainGameState.playerList[id].children[3].visible = false;
                mainGameState.playerList[id].children[4].visible = false;
            }
        } else {
            mainGameState.playerList[id].children[1].visible = false;
            mainGameState.playerList[id].children[2].visible = false;
            mainGameState.playerList[id].children[3].visible = false;
            mainGameState.playerList[id].children[4].visible = false;
        }
    }
}


//THIS FUNCTION MOVES THE PLAYERS
mainGameState.movePlayer = function () {

    if (myPlayerID >= 0) {
        var player = this.playerList[myPlayerID];
        var moved = false;
        var speed = 7;

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
    if (myPlayerID == 1) {
        otherPlayerID = 2;
    } else if (myPlayerID == 2) {
        otherPlayerID = 1;
    }
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