import { addFullscreenFunctionality } from "../configs/main_config";
import { LOCAL_STORAGE_MANAGER } from "../LOCAL_STORAGE_MANAGER";
import { AbstractScene } from "./AbstractScene";
import { Button } from "./in-main-menu/Button";

const PADDING_X = 25;
const CLAIM_BUTTON_X = 700;
const DESCRIPTION_X = -750;
const DISTANCE_BETWEEN_ROWS = 85;
const FIRST_ROW_Y = 75;

export class Achievements extends AbstractScene {
    achievementsData: any[];
    storedAchievementsData: any;
    backButton: Button;
    coins: string;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    mainContainer: Phaser.GameObjects.Container;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;

    constructor() {
        super('Achievements');
    }

    create() {
        super.create();

        this.add.image(0, 0, 'bg-map').setOrigin(0);
        this.createBackButton();
        this.createCoins();
        addFullscreenFunctionality(this, 100, 75);

        this.storedAchievementsData = LOCAL_STORAGE_MANAGER.get('achievements');
        this.achievementsData = [];

        if (this.storedAchievementsData) {
            this.proceedWithStoredData();
        } else {
            throw new Error('no data found')
        }
    }

    proceedWithStoredData() {
        this.mainContainer = this.add.container(0, 0);
        this.storedAchievementsData.forEach((data: any, index: number) => {
            const claimButtonEnabled = data.data.steps[0].progress >= data.data.steps[0].count;
            this.createRow(index, data.type, data.data, claimButtonEnabled);
        });
    }

    createRow(totalRowsSoFar: number, type: string, data: any, claimButtonEnabled: boolean = false) {

        const container = this.add.container(960, FIRST_ROW_Y + totalRowsSoFar * DISTANCE_BETWEEN_ROWS);

        if (totalRowsSoFar % 2 === 0) {
            let overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 0.65);
            overlay.fillRect(DESCRIPTION_X, -8, CLAIM_BUTTON_X - DESCRIPTION_X, DISTANCE_BETWEEN_ROWS - 7);
            // overlay.setInteractive();
            container.add(overlay);
        }

        //description
        const description: Phaser.GameObjects.Text = this.add.text(
            DESCRIPTION_X,
            0,
            `${data.description}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0);
        container.add(description);

        //monster
        const monster = this.add.image(description.x + description.width + PADDING_X, description.y, type).setOrigin(0).setScale(0.25);
        container.add(monster);
        if (!data.hasIMage) {
            monster.visible = false;
        }

        // progress
        const progress: Phaser.GameObjects.Text = this.add.text(
            monster.x + monster.displayWidth + PADDING_X,
            monster.y,
            `(${data.steps[0].progress}/${data.steps[0].count})`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0);
        container.add(progress);

        // claim button
        const claimButton = new Button(this, CLAIM_BUTTON_X, progress.y, 'claim', null, () => {
            claimButton.disableInteractive();


            console.log(this.storedAchievementsData[totalRowsSoFar]);

            const currentAchievementData = this.storedAchievementsData[totalRowsSoFar].data.steps[0];
            console.log(currentAchievementData);

            //add coins reward - also update local storage coins
            const coinsWonFromAchievement = currentAchievementData.rewards.coins;
            this.updateCoinsText(coinsWonFromAchievement);

            // remove currrent step level
            this.storedAchievementsData[totalRowsSoFar].data.steps.shift();
            console.log(this.storedAchievementsData[totalRowsSoFar].data.steps);

            //check if no more levels(steps) - remove this achievement using splice this.storedAchievementsData[totalRowsSoFar])
            if (this.storedAchievementsData[totalRowsSoFar].data.steps.length === 0) {
                this.storedAchievementsData.splice(totalRowsSoFar, 1);
            }

            //set new local storage data
            LOCAL_STORAGE_MANAGER.set('achievements', this.storedAchievementsData);

            //refresh the whole view with new data
            this.mainContainer.destroy(true);
            this.proceedWithStoredData();


        }, true, 0.4);
        claimButtonEnabled ? claimButton.setInteractive() : claimButton.disableInteractive();
        claimButton.bg.setOrigin(1, 0);
        container.add(claimButton);

        //coin reward text
        const coinRewardText = this.add.text(
            claimButton.x - claimButton.bg.displayWidth / 2,
            claimButton.y,
            `${data.steps[0].rewards.coins}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(1, 0);
        container.add(coinRewardText);

        const coinTexture = this.add.image(coinRewardText.x - coinRewardText.displayWidth, coinRewardText.y, 'coin').setScale(0.35).setOrigin(1, 0);
        container.add(coinTexture);

        this.mainContainer.add(container);
    }

    private updateCoinsText(coinsWon: number | string) {
        const playerCoins = (LOCAL_STORAGE_MANAGER.get('coins') as number);
        this.coins = `${+playerCoins + +coinsWon}`;
        LOCAL_STORAGE_MANAGER.set('coins', +this.coins);
        this.coinText.setText(this.coins);
        this.coinTexture.x = this.coinText.x - this.coinText.width;
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
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
}
