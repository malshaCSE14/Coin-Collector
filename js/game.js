var config = {
    type: Phaser.AUTO,
    width: 240,
    height: 320,
    // renderer : Phaser.CANVAS,
    // parent : 'game-canvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ example ]
};

var game = new Phaser.Game(config);
