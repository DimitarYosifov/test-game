import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { addFullscreenFunctionality, addUICurrencies, getAllMonsterTypes, getMonsterDataConfig } from '../configs/main_config';
import { Monster } from './in-game/Monster';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';

const MONSTER_SIZE = 165;
const START_X = 960;
const START_Y = 540;
const HORIZONTAL_DISTANCE_BETWEEN_MONSTERS = 40;
const VERTICAL_DISTANCE_BETWEEN_MONSTERS = 20;
const MAX_TOTAL_WIDTH = 1640;

export class MonstersInfo extends AbstractScene {

    backButton: Button;
    totalProgress: number;
    mainContainer: Phaser.GameObjects.Container;

    constructor() {
        super('MonstersInfo');
    }

    create() {
        super.create();
        this.createBackButton();

        addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
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

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
    }
}
