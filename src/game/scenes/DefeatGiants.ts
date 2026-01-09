import { defeatGiantsLevelConfig } from "../configs/level_config";
import { addFullscreenFunctionality, getMonsterDataConfig } from "../configs/main_config";
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
    keys: Phaser.GameObjects.Image[] = [];
    keysText: Phaser.GameObjects.Text;
    keysTexture: Phaser.GameObjects.Image;
    UIkeys: string;
    fightButton: Button;

    constructor() {
        super('DefeatGiants');
    }

    create() {

        super.create();

        this.keys = [];
        this.level = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel') as number);
        this.UIkeys = (LOCAL_STORAGE_MANAGER.get('keys') as number).toString();
        const isUnlocked = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevelUnlocked') as boolean);
        const enableUnlock = +this.UIkeys >= defeatGiantsLevelConfig[(this.level as number) - 1].keysNeededToUnlock;

        this.add.image(0, 0, 'bg-test').setOrigin(0);
        // this.add.image(0, 0, 'defeat-giants').setOrigin(0);
        this.createBackButton();
        this.createCoins();
        this.createTitle();
        isUnlocked ? this.showFightButton(true) : this.createUnlockButton();
        this.createEnemyDescription();
        this.createKeys(isUnlocked);

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
                const key = this.keys.shift();
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
                        this.UIkeys = `${Number(this.UIkeys) - 1}`;
                        LOCAL_STORAGE_MANAGER.set('keys', +this.UIkeys);
                        this.keysText.setText(this.UIkeys);
                        this.time.delayedCall(50, () => {
                            if (this.keys.length) {
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

        const enemyData: any = defeatGiantsLevelConfig[(this.level as number) - 1].opponentMonstersData;

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

        this.keysText = this.add.text(
            this.gemsTexture.x - this.gemsTexture.displayWidth - 25,
            30,
            `${this.UIkeys}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.keysTexture = this.add.image(this.keysText.x - this.keysText.displayWidth, 30, 'key').setScale(0.65).setOrigin(1, 0.5);
    }

    createKeys(isUnlocked: boolean) {
        const keysCount: any = defeatGiantsLevelConfig[(this.level as number) - 1].keysNeededToUnlock;
        let totalWidth = 0;
        for (let index = 0; index < keysCount; index++) {
            const key = this.add.image(960 + 260 + totalWidth, 900, 'key').setScale(1.2).setOrigin(0.5);
            this.keys.push(key);
            totalWidth += key.displayWidth;
            key.alpha = isUnlocked ? 1 : 0.6;
        }
    }

    toggleUnlockButton(enable: boolean) {
        enable ? this.unlockButton.setInteractive() : this.unlockButton.disableInteractive();
    }
}
