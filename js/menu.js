var menuState = {

    create: function () {
        var background = game.add.sprite(0, 0, 'mainmenu');
        var playbutton = game.add.sprite(550, 450, 'playbutton');
        playbutton.inputEnabled = true;
        playbutton.events.onInputDown.add(this.start, this);
        game.input.mouse.capture = true;
    },

    update: function () {

    },

    start: function () {
        game.state.start('load');
    },
};