var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(game.width / 2, game.height / 2, 'loading...', {
            font: '50px Arial',
            fill: '#ffffff'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = game.add.sprite(game.width / 2, (game.height / 2) + 45, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        progressBar.scale.setTo(1.5, 1.5);
        game.load.setPreloadSprite(progressBar);

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

        game.load.image('redSquareObject', 'assets/objects/redsquare.png');
        game.load.image('blueSquareObject', 'assets/objects/bluesquare.png');
        game.load.image('redObject', 'assets/objects/red.png');
        game.load.image('poleObject', 'assets/objects/pole.png');
        game.load.image('noObject', 'assets/objects/no.png');
        game.load.image('circleObject', 'assets/objects/circle.png');
        game.load.image('followObject', 'assets/objects/follow.png');
        game.load.image('billboardObject', 'assets/objects/billboard.png');
        game.load.image('andObject', 'assets/objects/and.png');


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

    },

    create: function () {
        game.state.start('play');
    },
};