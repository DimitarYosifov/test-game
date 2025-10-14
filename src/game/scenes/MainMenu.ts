import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { main_config } from '../configs/main_config';
import { DataHandler } from './in-daily-quest/DataHandler';
import { StartOverConfirm } from './in-main-menu/StartOverConfirm';

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

    constructor() {
        super('MainMenu');
    }

    create() {

        // add monster manually - for debugging!
        const addMonster = (type: number, stars: number) => {
            const STORAGE_KEY = 'playerMonstersData';
            const storedData = localStorage.getItem(STORAGE_KEY);
            const dataArray = storedData ? JSON.parse(storedData) : [];
            const newObject = { type, stars, row: NaN, col: 11 };
            dataArray.push(newObject);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
        }
        // addMonster(9,1);
        // addMonster(9,1);


        super.create();
        this.createDeckbutton();
        this.createShopbutton();
        this.createMapbutton();
        this.createDailyQuestsButton();
        this.createAchievementsButton();
        this.createInfoButton();
        this.createDeleteButton();
        this.createCoins();

        const playerSelectedMonsters = (JSON.parse(localStorage.getItem('playerMonstersData') ?? "null") || []).filter((x: any) => x.row !== null).length;
        playerSelectedMonsters === 0 ? this.mapButton.disableInteractive().setAlpha(0.4) : this.mapButton.setInteractive().setAlpha(1);

        const coins = localStorage.getItem('coins') || null;
        const playerMonstersData = (JSON.parse(localStorage.getItem('playerMonstersData') ?? "null") || []);

        if (coins === null) {
            //TODO - MOVE THIS TO PRELOADER!!!!!!!!!!!!!!!!
            //new game is started
            this.coins = main_config.playerStartingCoins.toString();
            this.updateCoinsText(this.coins);
            localStorage.setItem('coins', JSON.stringify(main_config.playerStartingCoins));
            localStorage.setItem('mapLevel', JSON.stringify(1));
            localStorage.setItem('levelsWon', JSON.stringify([]));
            localStorage.setItem('freeCommonPacks', JSON.stringify(main_config.playerStartingFreeCommonPacks));
            localStorage.setItem('freeSilverPacks', JSON.stringify(0));
            localStorage.setItem('freeGoldPacks', JSON.stringify(0));
        }

        if (playerMonstersData.length === 0) {
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

        } else if (playerMonstersData.filter((x: any) => x.row !== null).length === 0) {
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
        this.infoButton = new Button(this, 960, 725, 'info', null, infoButtonClick.bind(this), false, 0.65);
        const infoTitle = this.add.text(
            960,
            900,
            `monsters info`,
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
        this.shopButton = new Button(this, 960, 350, 'shop-icon', null, shopButtonClick.bind(this), false, 1);
        const shopTitle = this.add.text(
            960,
            480,
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
        this.deckButton = new Button(this, 1650, 700, 'deck', null, deckButtonClick.bind(this), false, 0.5);
        const deckTitle = this.add.text(
            1650,
            880,
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
        this.dailyQuestsButton = new Button(this, 1650, 300, 'clock', null, dailyQuestsButtonClick.bind(this), false, 0.5);
        const dailyQuestsTitle = this.add.text(
            1650,
            450,
            `daily quests`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        if (DataHandler.hasDailyQuestRewardPending()) {
            let exclaimation = this.add.image(this.dailyQuestsButton.x + 75, this.dailyQuestsButton.y - 75, 'mark').setScale(0.5);
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
            let exclaimation = this.add.image(this.achievementsButton.x + 75, this.dailyQuestsButton.y - 90, 'mark').setScale(0.5);
        }

    }

    createCoins() {
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

    createBackButton(): void { };

}
