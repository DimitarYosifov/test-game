import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { addFullscreenFunctionality, getAllMonsterTypes, getMonsterDataConfig } from '../configs/main_config';
import { Monster } from './in-game/Monster';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';

const MONSTER_SIZE = 165;
const START_X = 960;
const START_Y = 540;
const HORIZONTAL_DISTANCE_BETWEEN_MONSTERS = 40;
const VERTICAL_DISTANCE_BETWEEN_MONSTERS = 20;
const MAX_TOTAL_WIDTH = 1640;

export class MonstersInfo extends AbstractScene {

    coins: string | null;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    backButton: Button;
    totalProgress: number;
    mainContainer: Phaser.GameObjects.Container;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;

    constructor() {
        super('MonstersInfo');
    }

    create() {
        super.create();
        this.createCoins();
        this.createBackButton();
        addFullscreenFunctionality(this, 100, 75);

        this.mainContainer = this.add.container(0, 0);

        const container = this.add.container(START_X, START_Y);
        let totalWidth = 0;
        let totalHeight = 0;
        getAllMonsterTypes().forEach((monsterType: string, monsterTypeIndex: number) => {
            // [...getAllMonsterTypes(), ...getAllMonsterTypes()].slice(0, 11).forEach((monsterType: string, monsterTypeIndex: number) => { // test
            for (let index = 0; index < 5; index++) {
                const config = getMonsterDataConfig(+monsterType, index);
                const x = monsterTypeIndex * (MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS);
                const y = (MONSTER_SIZE + VERTICAL_DISTANCE_BETWEEN_MONSTERS) * index;
                const monster = new Monster(this, x, y, MONSTER_SIZE, MONSTER_SIZE, config, 0, true);
                monster.starsContainer.x = MONSTER_SIZE / -4 + 10;
                monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 13;
                container.add(monster);
                if (monsterTypeIndex === 0) {
                    totalHeight += MONSTER_SIZE + VERTICAL_DISTANCE_BETWEEN_MONSTERS;
                }
            }
            totalWidth += MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;
        });


        container.x = START_X - (totalWidth / 2) + (MONSTER_SIZE) - HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;
        container.y = START_Y - (totalHeight / 2) + (MONSTER_SIZE / 2);
        //SCALE MONSTERS CONTAINER TO FIT THE SCREEN
        const scale = MAX_TOTAL_WIDTH / totalWidth;
        if (scale < 1) {
            container.setScale(scale);
            const newWidth = totalWidth * scale;
            const newHeight = totalHeight * scale;
            container.x = START_X - (newWidth / 2) + (MONSTER_SIZE * scale) - HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;
            container.y = START_Y - (newHeight / 2) + (MONSTER_SIZE / 2);
        }
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
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

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
    }
}
