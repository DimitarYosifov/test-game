import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { addFullscreenFunctionality, addUICurrencies, getAllMonsterTypes, getMonsterDataConfig } from '../configs/main_config';
import { Monster } from './in-game/Monster';
import { LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';

const MONSTER_SIZE = 165;
const START_X = 960;
const START_Y = 480;
const HORIZONTAL_DISTANCE_BETWEEN_MONSTERS = 40;
const VERTICAL_DISTANCE_BETWEEN_MONSTERS = 20;
const MAX_TOTAL_WIDTH = 1640;
const MONSTER_TYPE_DESCRIPTION = {
    // TODO - replace 'monster N4' with image or monster name...
    "1": "+1 permanent move when enemy 'monster N5' dies. immune to poison spell",
    "2": "+1 helath if this monster attacks magic monster. immune to magic ball spell",
    "3": "+1 attack for every adjusting enemy magic monster. immune to magic ball spell",
    "5": "+1 permanent move when enemy 'monster N1' dies",
    "6": "if this monster kills an enemy +50% attack(rounded up) for the next turn in current round",
    "7": "20% chance to freeze enemy monster. immune to freeze spell",
    "8": "+1 attack if health is below 3",
    // "8": "+50% attack if health goes below 35%",
    "9": "+1 move(current round) when enemy monster dies"
}

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

        // addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
        // addFullscreenFunctionality(this, 100, 75);

        this.mainContainer = this.add.container(0, 0);

        const container = this.add.container(START_X, START_Y);
        let totalWidth = 0;
        let totalHeight = 0;
        const monstersLevelsCount = 5;

        getAllMonsterTypes().forEach((monsterType: string, monsterTypeIndex: number) => {
            // [...getAllMonsterTypes(), ...getAllMonsterTypes()].slice(0, 11).forEach((monsterType: string, monsterTypeIndex: number) => { // test
            // TODO - the loop below should not be monstersLevelsCount, but all monster levels count
            for (let index = 0; index < monstersLevelsCount; index++) {
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

            // description
            const description = this.add.text(
                monsterTypeIndex * (MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS),
                ((MONSTER_SIZE + VERTICAL_DISTANCE_BETWEEN_MONSTERS) * (monstersLevelsCount)) - 25,
                // `${(MONSTER_TYPE_DESCRIPTION as any)[monsterType]}`,
                `${(MONSTER_TYPE_DESCRIPTION as any)[Object.keys(MONSTER_TYPE_DESCRIPTION)[monsterTypeIndex]]}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 17, color: '#ffffff',
                    wordWrap: { width: MONSTER_SIZE + 30 }, stroke: '#000000', letterSpacing: 2,
                    align: 'center'
                }).setOrigin(0.5, 0.5);
            container.add(description);

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
