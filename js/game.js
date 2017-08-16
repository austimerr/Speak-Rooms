var game = new Phaser.Game(
    800,
    800,
    Phaser.AUTO,
    document.getElementById("game"),
    this,
    false,
    false
);


game.state.add('boot', bootState);
game.state.add('menu', menuState);
game.state.add('load', loadState);
game.state.add('play', mainGameState);
// Start the 'boot' state
game.state.start('boot');