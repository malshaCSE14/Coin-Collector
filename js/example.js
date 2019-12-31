class example extends Phaser.Scene {
    constructor() {
        super({ key: "example", active: true });
        this.speed;
        this.levelSpeed = 3;
    }

    preload() {
        this.load.image('GFS', 'assets/Background.jpg');
        this.load.image('player', 'assets/player.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {
        //background
        this.background = this.add.tileSprite(0, 0, 240, 320, 'GFS');
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        //player
        this.player = this.physics.add.sprite(120, 260, 'player');
        this.player.displayWidth = 30;
        this.player.displayHeight = 30;

        this.rect = new Phaser.Geom.Rectangle(50, 0, 150, 4000);

        this.coinGroup = this.physics.add.group({ key: 'coin', frameQuantity: 100 });
        Phaser.Actions.RandomRectangle(this.coinGroup.getChildren(), this.rect);
        this.bombGroup = this.physics.add.group({ key: 'bomb', frameQuantity: 10 });
        Phaser.Actions.RandomRectangle(this.bombGroup.getChildren(), this.rect);

        //key handle
        this.keys_handle = this.input.keyboard.createCursorKeys();

        this.data.set('lives', 3);
        this.data.set('score', 0);

        this.text = this.add.text(10, 300, '', { font: '14px Courier', fill: '#000000' });
        this.gameOverText = this.add.text(30, 120, '', { font: '25px Courier', fill: '#000000' });
    }

    collectCoin(player, coin) {
        coin.destroy();
        var currentScore =this.data.get('score');
        if (this.data.get('lives') !== 0) {
            this.data.set('score', currentScore+=100);
        }
    }
    bombBlast(player, bomb) {
        var lives = this.data.get('lives');
        if (lives >= 1) {
            bomb.destroy();
            this.data.set('lives', lives-1);
        }

    }

    update(time, delta) {
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.bombGroup, this.bombBlast, null, this);

        this.text.setText([
            'Score: ' + parseInt(this.data.get('score'),10) + ' \t ' +
            'Lives: ' + this.data.get('lives')
        ]);

        if (this.data.get('lives') === 0) {
            this.coinGroup.clear();
            this.bombGroup.clear();
            this.gameOverText.setText([
                'Game Over!!!'
            ]);
        } else if (this.bombGroup.getLength() === 0) {
            this.gameOverText.setText([
                'You Won!!!'
            ]);
        } else {
            this.background.tilePositionY -= (2 * this.levelSpeed);
            var currentScore =this.data.get('score');
            this.data.set('score', currentScore+=0.1);
        }

        //key handle
        if (this.keys_handle.left.isDown) {
            this.player.x -=(this.levelSpeed);
        }

        if (this.keys_handle.right.isDown) {
            this.player.x+=(this.levelSpeed);
        }

        if (this.keys_handle.up.isDown) {
            this.player.y-=(this.levelSpeed);
        }

        if (this.keys_handle.down.isDown) {
            this.player.y+=(2*this.levelSpeed);
        }

        // coins falling
        this.fallingCoins = this.coinGroup.getChildren();
        Phaser.Actions.IncXY(this.fallingCoins, 0, (this.levelSpeed));
        Phaser.Actions.WrapInRectangle(this.fallingCoins, this.rect);

        //bomb falling
        this.fallingBombs = this.bombGroup.getChildren();
        Phaser.Actions.IncXY(this.fallingBombs, 0, (this.levelSpeed));
        Phaser.Actions.WrapInRectangle(this.fallingBombs, this.rect);
    }

}