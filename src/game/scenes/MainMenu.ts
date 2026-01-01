import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { main_config } from '../configs/main_config';
import { DataHandler } from './in-daily-quest/DataHandler';
import { StartOverConfirm } from './in-main-menu/StartOverConfirm';
import { SpriteAnimation } from './SpriteAnimation';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';

export class MainMenu extends AbstractScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    deckButton: Button;
    confirmPopupOpen: boolean;
    coinTexture: Phaser.GameObjects.Image;
    coinText: Phaser.GameObjects.Text;
    coins: string | null;
    shopButton: Button;
    mapButton: Button;
    dailyQuestsButton: Button;
    achievementsButton: Button;
    deleteButton: Button;
    infoButton: Button;
    gems: string;
    gemsTexture: Phaser.GameObjects.Image;
    gemsText: Phaser.GameObjects.Text;
    gambleButton: Button;

    constructor() {
        super('MainMenu');
    }

    create() {

        this.input.once('pointerdown', () => {
            window.scrollTo(0, 100);

        });
        this.add.image(0, 0, 'bg-main-menu').setOrigin(0);

        // add monster manually - for debugging!
        const addMonster = (type: number, stars: number) => {
            const STORAGE_KEY = 'playerMonstersData';
            const storedData = LOCAL_STORAGE_MANAGER.get(STORAGE_KEY);
            const dataArray = storedData ? storedData : [];
            const newObject = { type, stars, row: NaN, col: 11 };
            dataArray.push(newObject);
            LOCAL_STORAGE_MANAGER.set(STORAGE_KEY, dataArray);
        }
        // addMonster(7,3);
        // addMonster(9,4);


        super.create();
        this.createDeckbutton();
        this.createShopbutton();
        this.createMapbutton();
        this.createDailyQuestsButton();
        this.createAchievementsButton();
        this.createInfoButton();
        this.createDeleteButton();
        this.createGambleButton();
        this.createCoins();

        const playerMonstersData = LOCAL_STORAGE_MANAGER.get('playerMonstersData');
        (playerMonstersData as []).length === 0 ? this.mapButton.disableInteractive().setAlpha(0.4) : this.mapButton.setInteractive().setAlpha(1);

        if ((playerMonstersData as []).length === 0) {
            // no player monsters
            const pointer = this.add.image(this.shopButton.x, this.shopButton.y, 'pointer').setScale(1).setOrigin(0, 0.5).setAlpha(0);
            this.time.delayedCall(2000, () => {
                pointer.setAlpha(1);
                this.tweens.add({
                    targets: pointer,
                    scale: 0.85,
                    yoyo: true,
                    repeat: -1,
                    duration: 500,
                    ease: 'Cubic.easeInOut',
                });
            })

        } else if ((playerMonstersData as []).filter((x: any) => x.row !== null).length === 0) {
            // no player monsters selected
            const pointer = this.add.image(this.deckButton.x, this.deckButton.y, 'pointer').setScale(1).setOrigin(0, 0.5).setAlpha(0);
            this.time.delayedCall(2000, () => {
                pointer.setAlpha(1);
                this.tweens.add({
                    targets: pointer,
                    scale: 0.85,
                    yoyo: true,
                    repeat: -1,
                    duration: 500,
                    ease: 'Cubic.easeInOut',
                });
            })
        }
    }

    private createInfoButton() {
        const infoButtonClick = () => {
            this.infoButton.disableInteractive();
            this.changeScene('MonstersInfo');
        }
        this.infoButton = new Button(this, 750, 625, 'info', null, infoButtonClick.bind(this), false, 0.65);
        const infoTitle = this.add.text(
            750,
            800,
            `monsters info`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createGambleButton() {
        const gambleButtonClick = () => {
            this.gambleButton.disableInteractive();
            this.changeScene('Gamble');
        }
        this.gambleButton = new Button(this, 1200, 575, 'slot-machine', null, gambleButtonClick.bind(this), false, 0.65);
        const gambleTitle = this.add.text(
            1200,
            700,
            `gamble`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createDeleteButton() {
        const deleteButtonClick = () => {
            this.deleteButton.disableInteractive();
            const startOverPopupConfirm = new StartOverConfirm(this, 960, 540);
            startOverPopupConfirm.once('start-again-declined', () => {
                this.deleteButton.setInteractive();
                startOverPopupConfirm.destroy(true);
            })
        }
        this.deleteButton = new Button(this, 100, 75, 'button', 'start\nagain', deleteButtonClick.bind(this), false, 1);
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
        this.mapButton = new Button(this, 250, 700, 'map', null, mapButtonClick.bind(this), false, 0.5);
        const mapTitle = this.add.text(
            250,
            880,
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
            this.changeScene('BuyPacks');
        }
        this.shopButton = new Button(this, 790, 220, 'shop-icon', null, shopButtonClick.bind(this), false, 1);
        const shopTitle = this.add.text(
            790,
            350,
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
        this.deckButton = new Button(this, 1650, 450, 'deck', null, deckButtonClick.bind(this), false, 0.5);
        const deckTitle = this.add.text(
            1650,
            630,
            `edit monsters`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private createDailyQuestsButton(): void {
        const dailyQuestsButtonClick = () => {
            this.dailyQuestsButton.disableInteractive();
            this.changeScene('DailyQuests');
        }
        this.dailyQuestsButton = new Button(this, 1300, 100, 'clock', null, dailyQuestsButtonClick.bind(this), false, 0.5);
        const dailyQuestsTitle = this.add.text(
            1300,
            250,
            `daily quests`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        if (DataHandler.hasDailyQuestRewardPending()) {
            let exclaimation = this.add.image(this.dailyQuestsButton.x + 75, this.dailyQuestsButton.y - 45, 'mark').setScale(0.5);
        }

    }

    private createAchievementsButton() {
        const achievementsButtonClick = () => {
            this.achievementsButton.disableInteractive();
            this.changeScene('Achievements');
        }
        this.achievementsButton = new Button(this, 300, 300, 'achievements', null, achievementsButtonClick.bind(this), false, 1);
        const achievementsTitle = this.add.text(
            300,
            450,
            `achievements`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        if (DataHandler.hasAchievementRewardPending()) {
            let exclaimation = this.add.image(this.achievementsButton.x + 75, this.achievementsButton.y - 100, 'mark').setScale(0.5);
        }

    }

    createCoins() {
        this.coins = (LOCAL_STORAGE_MANAGER.get('coins') as number).toString();
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
        this.gems = (LOCAL_STORAGE_MANAGER.get('gems') as number).toString();
        this.gemsText = this.add.text(
            this.coinTexture.x - this.coinTexture.displayWidth - 25,
            30,
            `${this.gems}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.gemsTexture = this.add.image(this.gemsText.x - this.gemsText.displayWidth, 30, 'gem').setScale(0.1).setOrigin(1, 0.5);
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    createBackButton(): void { };

}
