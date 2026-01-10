import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { addFullscreenFunctionality, addUICurrencies, main_config } from '../configs/main_config';
import { DataHandler } from './in-daily-quest/DataHandler';
import { StartOverConfirm } from './in-main-menu/StartOverConfirm';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';
import { defeat_giants_level_config } from '../configs/level_config';

export class MainMenu extends AbstractScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    deckButton: Button;
    confirmPopupOpen: boolean;
    shopButton: Button;
    mapButton: Button;
    dailyQuestsButton: Button;
    achievementsButton: Button;
    deleteButton: Button;
    infoButton: Button;
    gambleButton: Button;
    defeatMonstersButton: Button;

    constructor() {
        super('MainMenu');
    }

    create() {

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
        this.createDefeatGiantsButton();

        const fullscreenImg = this.add.image(250, 75, 'fullscreen').setOrigin(0.5).setScale(0.85);
        if (!(window as any).userHasInteracted) {
            (window as any).userHasInteracted = true;
            this.input.once('pointerdown', () => {
                addFullscreenFunctionality(this, 250, 75, fullscreenImg);
            });
        } else {
            addFullscreenFunctionality(this, 250, 75, fullscreenImg);
        }

        const playerMonstersData = LOCAL_STORAGE_MANAGER.get('playerMonstersData');
        (playerMonstersData as []).every((x: any) => x.row === null) || (playerMonstersData as []).length === 0 || (playerMonstersData as []).every((x: any) => Number.isNaN(x.row)) ?
            this.mapButton.disableInteractive().setAlpha(0.4) :
            this.mapButton.setInteractive().setAlpha(1);

        (playerMonstersData as []).every((x: any) => x.row === null) || (playerMonstersData as []).length === 0 || (playerMonstersData as []).every((x: any) => Number.isNaN(x.row)) ?
            this.mapButton.disableInteractive().setAlpha(0.4) :
            this.mapButton.setInteractive().setAlpha(1);

        this.checkDefeatGiantsButtonEnabled((playerMonstersData as []));

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

        addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
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
    private createDefeatGiantsButton() {
        const defeatMonstersButtonClick = () => {
            this.defeatMonstersButton.disableInteractive();
            this.changeScene('DefeatGiants');
        }
        this.defeatMonstersButton = new Button(this, 1550, 825, 'attack', null, defeatMonstersButtonClick.bind(this), false, 1.65);
        const defeatMonstersTitle = this.add.text(
            this.defeatMonstersButton.x,
            this.defeatMonstersButton.y + 150,
            `defeat\ngiants`,
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

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    createBackButton(): void { };

    checkDefeatGiantsButtonEnabled(playerMonstersData: []) {
        const defeatGiantsLevel = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel') as number);
        const allGiantLevelsComplete = defeatGiantsLevel > defeat_giants_level_config.length;
        if (
            (playerMonstersData.every((x: any) => x.row === null) ||
                playerMonstersData.length === 0 ||
                playerMonstersData.every((x: any) => Number.isNaN(x.row))
            ) ||
            allGiantLevelsComplete
        ) {
            this.defeatMonstersButton.disableInteractive()
        } else {
            this.defeatMonstersButton.setInteractive();
        }

        if (allGiantLevelsComplete) {
            const levelCompletedText: Phaser.GameObjects.Text = this.add.text(
                this.defeatMonstersButton.x,
                this.defeatMonstersButton.y,
                `completed`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ff0000',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0).setScale(1.5);
            levelCompletedText.angle = -25;
            this.tweens.add({
                targets: levelCompletedText,
                alpha: 1,
                scale: 1,
                duration: 300,
                delay: 200
            })
        }
    }
}
