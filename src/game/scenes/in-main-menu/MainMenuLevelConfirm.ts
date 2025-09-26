import { Scene } from "phaser";
import { monsters_power_config } from "../../configs/monsters_power_config";
import { Monster } from "../in-game/Monster";
import { ILevelConfig } from "../../configs/level_config";
import { Button } from "./Button";


const MONSTER_SIZE = 150;
const PADDING = 50;

export class MainMenuLevelConfirm extends Phaser.GameObjects.Container {

    private levelData: ILevelConfig;
    private okButton: Phaser.GameObjects.Image;
    private backButton: Phaser.GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, levelData: ILevelConfig) {
        super(scene, x, y);
        this.scene = scene;
        this.levelData = levelData;
        this.scene.add.existing(this);

        this.createBGOverlay();
        this.createLevelHeader();
        this.createFirstWinReward();
        this.createRepeatLevelWinReward();
        this.createEnemyDescription();
        this.createOkButton();
        this.createBackButton();
    }

    private createBGOverlay() {
        let overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.95);
        overlay.fillRect(0, 0, 1920, 1080);
        overlay.setInteractive();
        this.add(overlay);
    }

    private createLevelHeader() {
        const levelHeader: Phaser.GameObjects.Text = this.scene.add.text(
            960,
            250,
            `Level ${this.levelData.levelName}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 70, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        this.add(levelHeader);
    }

    private createFirstWinReward() {
        const levelHeader: Phaser.GameObjects.Text = this.scene.add.text(
            960,
            350,
            `First Win Reward: ${this.levelData.firstWinReward}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        this.add(levelHeader);

        //completed text
        const levelCompletedText: Phaser.GameObjects.Text = this.scene.add.text(
            levelHeader.x,
            levelHeader.y,
            `completed`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ff0000',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5).setAlpha(0).setScale(1.5);
        levelCompletedText.angle = -25;
        this.scene.tweens.add({
            targets: levelCompletedText,
            alpha: 1,
            scale: 1,
            duration: 300,
            delay: 200
        })
        this.add(levelCompletedText);
    }

    private createRepeatLevelWinReward() {
        const levelHeader: Phaser.GameObjects.Text = this.scene.add.text(
            960,
            450,
            `Repeat Level Win Reward: ${this.levelData.repeatLevelWinReward}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        this.add(levelHeader);
    }

    private createEnemyDescription() {
        const enemies: Phaser.GameObjects.Text = this.scene.add.text(
            960,
            550,
            `Enemies: `,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        this.add(enemies);

        const enemyData = this.levelData.opponentMonstersData;

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
            const config = { ...(monsters_power_config as any)[parsedKey.type][parsedKey.stars - 1] };
            const monster = new Monster(this.scene, x, 700, 150, 150, config, 0, true);
            monster.starsContainer.x = MONSTER_SIZE / -4 + 18;
            monster.movesLeftContainer.x = MONSTER_SIZE / 2 + 18;
            this.add(monster);

            //monsters count text
            const enemiesCount: Phaser.GameObjects.Text = this.scene.add.text(
                x,
                monster.y + (monster.bg.height / 2),
                `x ${count}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.add(enemiesCount);
        }
    }

    private createOkButton() {
        this.okButton = new Button(this.scene, 1800, 950, 'ok-btn', () => this.emit('level-selected', this.levelData.levelName));
        this.add(this.okButton);
    }

    private createBackButton() {
        this.backButton = new Button(this.scene, 100, 950, 'back-btn', () => this.emit('level-unselected'));
        this.add(this.backButton);
    }
}
