import { Scene } from 'phaser';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { main_config } from '../configs/main_config';

export class MainMenu extends AbstractScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    deckButton: Phaser.GameObjects.Image;
    confirmPopupOpen: boolean;
    coinTexture: Phaser.GameObjects.Image;
    coinText: Phaser.GameObjects.Text;
    coins: string | null;
    shopButton: Button;
    mapButton: Button;

    constructor() {
        super('MainMenu');
    }

    create() {
        super.create();
        this.createDeckbutton();
        this.createShopbutton();
        this.createMapbutton();
        this.createCoins();

        const playerSelectedMonsters = (JSON.parse(localStorage.getItem('playerMonstersData') ?? "null") || []).filter((x: any) => x.row).length;
        playerSelectedMonsters === 0 ? this.mapButton.disableInteractive() : this.mapButton.setInteractive();

        const coins = localStorage.getItem('coins') || null;
        if (coins === null) {
            //new game is started
            //TODO - add HINT to point to buy packs!
            this.coins = main_config.playerStartingCoins.toString();
            this.updateCoinsText(this.coins);
            localStorage.setItem('coins', JSON.stringify(main_config.playerStartingCoins));
            localStorage.setItem('mapLevel', JSON.stringify(1));
        }
    }

    private updateCoinsText(value: number | string) {
        this.coinText.setText(`${value}`);
        this.coinTexture.x = this.coinText.x - this.coinText.width;
    }

    private createMapbutton(): void {
        const mapButtonClick = () => {
            this.mapButton.disableInteractive();
            this.changeScene('Map');
        }
        this.mapButton = new Button(this, 250, 750, 'map', mapButtonClick.bind(this), false, 0.5);
        const mapTitle = this.add.text(
            250,
            930,
            `adventures`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createShopbutton(): void {
        const shopButtonClick = () => {
            this.shopButton.disableInteractive();
            this.scene.start('BuyPacks');
        }
        this.shopButton = new Button(this, 960, 250, 'shop-icon', shopButtonClick.bind(this), false, 1);
        const shopTitle = this.add.text(
            960,
            380,
            `get new monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createDeckbutton(): void {
        const deckButtonClick = () => {
            this.deckButton.disableInteractive();
            this.changeScene('CardSelection');
        }
        this.deckButton = new Button(this, 1650, 750, 'deck', deckButtonClick.bind(this), false, 0.5);
        const deckTitle = this.add.text(
            1650,
            930,
            `edit monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createCoins() {
        this.coins = localStorage.getItem('coins') || '0';
        this.coinText = this.add.text(
            1900,
            30,
            `${this.coins}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.coinTexture = this.add.image(this.coinText.x - this.coinText.displayWidth, 30, 'coin').setScale(0.35).setOrigin(1, 0.5);
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

}
