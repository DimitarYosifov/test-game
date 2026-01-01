import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg3.jpg');
    }

    resizeGame() {
        const vv = window.visualViewport;

        const width = Math.floor(vv ? vv.width : window.innerWidth);
        const height = Math.floor(vv ? vv.height : window.innerHeight);

        this.game.scale.resize(width, height);
    }

    create() {

        window.addEventListener('resize', this.resizeGame);
        window.addEventListener('orientationchange', this.resizeGame);

        // visualViewport fires when address bar collapses
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.resizeGame);
            window.visualViewport.addEventListener('scroll', this.resizeGame);
        }


        this.scene.start('Preloader');
    }
}
