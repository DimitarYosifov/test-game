import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { getAllMonsterTypes, getMonsterDataConfig } from '../configs/main_config';
import { Monster } from './in-game/Monster';
import { monsters_power_config } from '../configs/monsters_power_config';

const MONSTER_SIZE = 165;
const START_X = 0;
const START_Y = 0;
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
    "9": "+1 move(current round) when enemy monster dies",
    "11": "N/A",
    "12": "N/A",
    "13": "N/A"
}

export class MonstersInfo extends AbstractScene {

    backButton: Button;
    totalProgress: number;
    mainContainer: Phaser.GameObjects.Container;
    descriptionText: Phaser.GameObjects.Text;
    monsterSelectedTweenInProgress: boolean;
    currentlySelectedMonster: null | Monster;
    infoStar1: Phaser.GameObjects.Image;
    infoStar2: Phaser.GameObjects.Image;
    infoStar3: Phaser.GameObjects.Image;
    infoStar4: Phaser.GameObjects.Image;
    infoStar5: Phaser.GameObjects.Image;
    starsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('MonstersInfo');
    }

    create() {
        super.create();
      
        this.add.image(0, 0, 'info-bg').setOrigin(0);

        this.createBackButton();

        // addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
        // addFullscreenFunctionality(this, 100, 75);

        this.mainContainer = this.add.container(0, 0);

        const container = this.add.container(START_X, START_Y);
        let totalWidth = 0;
        let totalHeight = 0;
        const monstersLevelsCount = 5;

        this.currentlySelectedMonster = null;
        this.monsterSelectedTweenInProgress = false;
        this.descriptionText = this.add.text(
            1375,
            550,
            ``,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 3, wordWrap: { width: 700 },
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);
        container.add(this.descriptionText);

        const addStarInteractionHandler = (target: Phaser.GameObjects.Image, index: number) => {
            target.on('pointerdown', () => {
                (this.currentlySelectedMonster as any).currentInfoIndex = index;

                for (let starIndex = 0; starIndex < 5; starIndex++) {
                    const infoStar = (this as Record<StarKey, unknown>)[`infoStar${starIndex + 1}` as StarKey];
                    (infoStar as Phaser.GameObjects.Image).setAlpha(starIndex <= index ? 1 : 0.5);
                }

                const newMonsterData = (monsters_power_config as any)[this.currentlySelectedMonster.type.toString()][index];
                console.log(newMonsterData);

                if (this.currentlySelectedMonster.unitData.magic > 0) {
                    this.currentlySelectedMonster.magic_text.setText(newMonsterData.magic);
                } else if (this.currentlySelectedMonster.unitData.ranged > 0) {
                    this.currentlySelectedMonster.ranged_text.setText(newMonsterData.ranged);
                } else {
                    this.currentlySelectedMonster.melee_text.setText(newMonsterData.melee);
                }

                // this.currentlySelectedMonster.unitData.moves = newMonsterData.moves;
                const newMoveDots = newMonsterData.moves - this.currentlySelectedMonster.movesLeftContainer.list.length;
                for (let index = 0; index < newMoveDots; index++) {
                    this.currentlySelectedMonster.addMove(false);
                }
                if (this.currentlySelectedMonster.unitData.moves > newMonsterData.moves) {
                    this.currentlySelectedMonster.unitData.moves = newMonsterData.moves
                }
                this.currentlySelectedMonster.resetMoves();

                this.currentlySelectedMonster.health_text.setText(newMonsterData.health);
                this.currentlySelectedMonster.shield_text.setText(newMonsterData.shield);
                this.currentlySelectedMonster.vision_text.setText(newMonsterData.vision);

                const bounds = this.currentlySelectedMonster.movesLeftContainer.getBounds()
                this.currentlySelectedMonster.movesLeftContainer.y = bounds.height / -4;
                if (this.currentlySelectedMonster.isGiant) {

                } else {
                    this.currentlySelectedMonster.movesLeftContainer.x = this.currentlySelectedMonster.bg.displayWidth - this.currentlySelectedMonster.starsContainer.getBounds().width * 1.5 + 5;
                }

                this.currentlySelectedMonster.starsContainer.removeAll();
                for (let index = 0; index < newMonsterData.stars; index++) {
                    const star = this.add.image(0, 0, 'star').setScale(this.currentlySelectedMonster._displayWidth * 0.15 / 100).setOrigin(0, 0.5);
                    this.currentlySelectedMonster.starsContainer.add(star);
                }
                Phaser.Actions.GridAlign(this.currentlySelectedMonster.starsContainer.list, {
                    width: 0,
                    height: this.currentlySelectedMonster.starsContainer.list.length,
                    cellWidth: 0,
                    cellHeight: this.currentlySelectedMonster._displayWidth * 0.1, // spacing between items vertically
                    position: Phaser.Display.Align.CENTER
                });
                this.currentlySelectedMonster.starsContainer.y = this.currentlySelectedMonster.starsContainer.getBounds().height / -4;
                this.currentlySelectedMonster.starsContainer.x = this.currentlySelectedMonster.starsContainer.getBounds().width / -2 - 6.5;
            })
        }

        this.infoStar1 = this.add.image(1210, 400, 'star').setScale(0.65).setOrigin(0, 0.5).setAlpha(0);
        this.infoStar2 = this.add.image(this.infoStar1.x + this.infoStar1.displayWidth, 400, 'star').setScale(0.65).setOrigin(0, 0.5).setAlpha(0);
        this.infoStar3 = this.add.image(this.infoStar2.x + this.infoStar2.displayWidth, 400, 'star').setScale(0.65).setOrigin(0, 0.5).setAlpha(0);
        this.infoStar4 = this.add.image(this.infoStar3.x + this.infoStar3.displayWidth, 400, 'star').setScale(0.65).setOrigin(0, 0.5).setAlpha(0);
        this.infoStar5 = this.add.image(this.infoStar4.x + this.infoStar4.displayWidth, 400, 'star').setScale(0.65).setOrigin(0, 0.5).setAlpha(0);

        addStarInteractionHandler(this.infoStar1, 0);
        addStarInteractionHandler(this.infoStar2, 1);
        addStarInteractionHandler(this.infoStar3, 2);
        addStarInteractionHandler(this.infoStar4, 3);
        addStarInteractionHandler(this.infoStar5, 4);

        this.starsGroup = this.add.group([this.infoStar1, this.infoStar2, this.infoStar3, this.infoStar4, this.infoStar5]);
        container.add([this.infoStar1, this.infoStar2, this.infoStar3, this.infoStar4, this.infoStar5]);

        let giantsCount = 0;
        getAllMonsterTypes(true).forEach((monsterType: string, monsterTypeIndex: number) => {
            // [...getAllMonsterTypes(), ...getAllMonsterTypes()].slice(0, 11).forEach((monsterType: string, monsterTypeIndex: number) => { // test
            // TODO - the loop below should not be monstersLevelsCount, but all monster levels count
            // for (let index = 0; index < monstersLevelsCount; index++) {
            const config = getMonsterDataConfig(+monsterType, 0);
            const x = config.isGiant ? 750 + giantsCount * (MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS) : 235 + monsterTypeIndex * (MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS);
            const y = config.isGiant ? 900 : 200;
            if (config.isGiant) {
                giantsCount++;
            }
            const monster = new Monster(this, x, y, MONSTER_SIZE, MONSTER_SIZE, config, 0, true);

            (monster as any).initialInfoX = x;
            (monster as any).initialInfoY = y;
            (monster as any).currentInfoIndex = 0;

            monster.starsContainer.x = MONSTER_SIZE / -4 + 10;
            monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 13;
            container.add(monster);
            if (monsterTypeIndex === 0) {
                totalHeight += MONSTER_SIZE + VERTICAL_DISTANCE_BETWEEN_MONSTERS;
            }

            monster.setInteraction(true);
            monster.bg.on('pointerdown', () => {

                if (this.monsterSelectedTweenInProgress || this.currentlySelectedMonster === monster) {
                    return;
                }

                if (this.currentlySelectedMonster) {
                    this.tweens.add({
                        targets: this.currentlySelectedMonster,
                        scale: 1,
                        x: (this.currentlySelectedMonster as any).initialInfoX,
                        y: (this.currentlySelectedMonster as any).initialInfoY,
                        duration: 300,
                        onComplete: () => { }
                    })

                    this.currentlySelectedMonster = monster;

                    for (let index = 1; index <= 5; index++) {
                        const infoStar = (this as Record<StarKey, unknown>)[`infoStar${index}` as StarKey];
                        this.tweens.add({
                            targets: infoStar,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => {
                                (infoStar as Phaser.GameObjects.Image).disableInteractive();
                            }
                        })
                        this.tweens.add({
                            targets: infoStar,
                            alpha: index - 1 <= (this.currentlySelectedMonster as any).currentInfoIndex ? 1 : 0.5,
                            duration: 200,
                            delay: 200,
                            onComplete: () => {
                                (infoStar as Phaser.GameObjects.Image).setInteractive();
                            }
                        })
                    }
                }
                else {
                    this.currentlySelectedMonster = monster;
                    for (let index = 1; index <= 5; index++) {
                        const infoStar = (this as Record<StarKey, unknown>)[`infoStar${index}` as StarKey];
                        this.tweens.add({
                            targets: infoStar,
                            alpha: index === 1 ? 1 : 0.5,
                            duration: 200,
                            delay: 200,
                            onComplete: () => {
                                (infoStar as Phaser.GameObjects.Image).setInteractive();
                            }
                        })
                    }
                }

                this.descriptionText.setAlpha(1);

                this.tweens.add({
                    targets: this.descriptionText,
                    alpha: 0,
                    duration: 200,
                    yoyo: true,
                    onYoyo: () => {
                        const descriptioString = (MONSTER_TYPE_DESCRIPTION as any)[monsterType];
                        this.descriptionText.setText(descriptioString);
                    }
                })

                this.monsterSelectedTweenInProgress = true;
                // this.currentlySelectedMonster = monster;
                container.bringToTop(monster);
                this.tweens.add({
                    targets: monster,
                    scale: 2,
                    x: 660,
                    y: 550,
                    duration: 300,
                    onComplete: () => {
                        this.monsterSelectedTweenInProgress = false;
                    }
                })
            })

            // }
            totalWidth += MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;

            // // description
            // const description = this.add.text(
            //     monsterTypeIndex * (MONSTER_SIZE + HORIZONTAL_DISTANCE_BETWEEN_MONSTERS),
            //     ((MONSTER_SIZE + VERTICAL_DISTANCE_BETWEEN_MONSTERS) * (monstersLevelsCount)) - 25,
            //     // `${(MONSTER_TYPE_DESCRIPTION as any)[monsterType]}`,
            //     `${(MONSTER_TYPE_DESCRIPTION as any)[Object.keys(MONSTER_TYPE_DESCRIPTION)[monsterTypeIndex]]}`,
            //     {
            //         fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 17, color: '#ffffff',
            //         wordWrap: { width: MONSTER_SIZE + 30 }, stroke: '#000000', letterSpacing: 2,
            //         align: 'center'
            //     }).setOrigin(0.5, 0.5);
            // container.add(description);

        });

        // container.x = START_X - (totalWidth / 2) + (MONSTER_SIZE) - HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;
        // container.y = START_Y - (totalHeight / 2) + (MONSTER_SIZE / 2);

        //SCALE MONSTERS CONTAINER TO FIT THE SCREEN
        // const scale = MAX_TOTAL_WIDTH / totalWidth;
        // if (scale < 1) {
        //     container.setScale(scale);
        //     const newWidth = totalWidth * scale;
        //     const newHeight = totalHeight * scale;
        //     container.x = START_X - (newWidth / 2) + (MONSTER_SIZE * scale) - HORIZONTAL_DISTANCE_BETWEEN_MONSTERS;
        //     container.y = START_Y - (newHeight / 2) + (MONSTER_SIZE / 2);
        // }
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


type StarKey =
    | 'infoStar1'
    | 'infoStar2'
    | 'infoStar3'
    | 'infoStar4'
    | 'infoStar5';