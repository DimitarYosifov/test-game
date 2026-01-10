import { defeat_giants_level_config } from "../configs/level_config";
import { addFullscreenFunctionality, addUICurrencies, getMonsterDataConfig } from "../configs/main_config";
import { LOCAL_STORAGE_MANAGER } from "../LOCAL_STORAGE_MANAGER";
import { AbstractScene } from "./AbstractScene";
import { Monster } from "./in-game/Monster";
import { Button } from "./in-main-menu/Button";

const MONSTER_SIZE = 250;
const PADDING = 50;

export class DefeatGiants extends AbstractScene {
    backButton: any;
    coins: string;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;
    unlockButton: Button;
    giantsDescriptionContainer: any;
    level: number | null;
    fightButton: Button;
    keysArray: Phaser.GameObjects.Image[];

    constructor() {
        super('DefeatGiants');
    }

    create() {

        super.create();

        this.keysArray = [];
        this.level = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel') as number);
        this.keys = (LOCAL_STORAGE_MANAGER.get('keys') as number).toString();
        const isUnlocked = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevelUnlocked') as boolean);
        const enableUnlock = +this.keys >= defeat_giants_level_config[(this.level as number) - 1].keysNeededToUnlock;

        this.add.image(0, 0, 'bg-test').setOrigin(0);
        // this.add.image(0, 0, 'defeat-giants').setOrigin(0);
        this.createBackButton();
        this.createTitle();
        isUnlocked ? this.showFightButton(true) : this.createUnlockButton();
        this.createEnemyDescription();
        this.createKeys(isUnlocked);

        addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
        addFullscreenFunctionality(this, 100, 75);

        if (!isUnlocked) {
            this.toggleUnlockButton(enableUnlock);
        }
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene, {
                isGiantFightLevel: true
            });
        });
    }

    createTitle() {
        const header = this.add.text(
            960,
            150,
            `defeat giants`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 135, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 5,
                align: 'center'
            }).setOrigin(0.5);

        const levelText = this.add.text(
            960,
            header.y + 120,
            `level ${this.level}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 75, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 5,
                align: 'center'
            }).setOrigin(0.5);
    }

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
    }

    createUnlockButton() {
        this.unlockButton = new Button(this, 960, 900, 'unlock', '', () => {
            this.unlockButton.disableInteractive();
            const showKey = () => {
                const key = this.keysArray.shift();
                const startScale = key?.scale;
                // key!.scale = startScale! * 1.25;
                key!.alpha = 0;
                this.tweens.add({
                    targets: key,
                    duration: 250,
                    scale: startScale! * 1.25,
                    alpha: 1,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        this.keys = `${Number(this.keys) - 1}`;
                        LOCAL_STORAGE_MANAGER.set('keys', +this.keys);
                        this.keysText.setText(this.keys);
                        this.time.delayedCall(50, () => {
                            if (this.keysArray.length) {
                                showKey();
                            } else {
                                LOCAL_STORAGE_MANAGER.set('defeatGiantsLevelUnlocked', true);
                                this.showFightButton(false);
                            }
                        })
                    }
                })
            }
            showKey();
        });
    }

    private showFightButton(skipAnimation: boolean) {

        this.fightButton = new Button(this, 960, 900, 'button', 'fight', () => {
            this.fightButton.disableInteractive();
            this.changeScene('Game');
        }).setScale(skipAnimation ? 1 : 0);

        if (skipAnimation) {
            this.fightButton.setInteractive();
            return;
        }

        this.tweens.chain({
            tweens: [
                {
                    targets: this.unlockButton,
                    duration: 350,
                    scale: 0,
                    ease: 'Back.easeIn',
                },
                {
                    targets: this.fightButton,
                    duration: 250,
                    scale: 1,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.fightButton.setInteractive();
                    }
                }
            ]
        })
    }

    private createEnemyDescription() {
        this.giantsDescriptionContainer = this.add.container(0, 0);

        const enemyData: any = defeat_giants_level_config[(this.level as number) - 1].opponentMonstersData;

        const counts = new Map();
        for (const obj of enemyData) {
            const key = JSON.stringify(obj);
            counts.set(key, (counts.get(key) || 0) + 1);
        }

        const countsSize = counts.size
        let index = 0;
        const center = 960;
        const totalWidth = ((countsSize * MONSTER_SIZE) + (countsSize - 1) * PADDING);
        const startX = center - totalWidth / 2 + MONSTER_SIZE / 2;

        for (const [key, count] of counts) {

            const x = startX + index * (MONSTER_SIZE + PADDING);
            index++;

            const parsedKey = JSON.parse(key);
            const config = getMonsterDataConfig(+parsedKey.type, parsedKey.stars - 1);

            const monster = new Monster(this, x, 550, MONSTER_SIZE, MONSTER_SIZE, config, 0, true);
            monster.starsContainer.x = MONSTER_SIZE / -4;
            monster.movesLeftContainer.x = MONSTER_SIZE / 2;
            this.giantsDescriptionContainer.add(monster);

            //monsters count text
            const enemiesCount: Phaser.GameObjects.Text = this.add.text(
                x,
                monster.y + (monster.bg.height / 2) + 30,
                `x ${count}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.giantsDescriptionContainer.add(enemiesCount);
        }
    }

    createKeys(isUnlocked: boolean) {
        // const bg = this.add.image(960 + 110, 900, 'blur-bg').setOrigin(0, 0.5);

        const keysCount: any = defeat_giants_level_config[(this.level as number) - 1].keysNeededToUnlock;
        let totalWidth = 0;
        for (let index = 0; index < keysCount; index++) {
            const key = this.add.image(960 + 260 + totalWidth, 900, 'key').setScale(0.4).setOrigin(0.5);
            this.keysArray.push(key);
            totalWidth += key.displayWidth * 0.6;
            key.alpha = isUnlocked ? 1 : 0.6;
        }
        // bg.scaleX = keysCount * 0.8;
    }

    toggleUnlockButton(enable: boolean) {
        enable ? this.unlockButton.setInteractive() : this.unlockButton.disableInteractive();
    }
}
