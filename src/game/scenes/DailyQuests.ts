import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { DailyQuestItem } from './in-daily-quest/DailyQuestItem';

const QUEST_START_TIME_KEY = 'questStartTime';
const LAST_RESET_TIME_KEY = 'lastResetTime';

export class DailyQuests extends AbstractScene {

    coins: string | null;
    timeLeftText: Phaser.GameObjects.Text;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    backButton: Button;

    constructor() {
        super('DailyQuests');
    }

    create() {

        super.create();
        this.createCoins();
        this.createBackButton();
        this.createTimeLeftText();
        this.createQuests();

        const startTime = this.getOrCreateStartTime();
        if (this.shouldResetQuests(startTime)) {
            this.resetQuests();
            this.setLastResetTime();
        }

        // Update timer every second
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const updatedStartTime = this.getStoredStartTime();
                const timeLeft = this.getTimeUntilNextReset(updatedStartTime);
                this.timeLeftText.setText(`Time left: ${this.formatTime(timeLeft)}`);
            },
        });
    }

    //region QUESTS
    createQuests() {
        this.createQuest();
    }

    createQuest() {

        const quest = new DailyQuestItem(this, 960, 540);
    }

    // region TIME
    private setLastResetTime(): void {
        localStorage.setItem(LAST_RESET_TIME_KEY, Date.now().toString());
    }

    private getLastResetTime(): number {
        return parseInt(localStorage.getItem(LAST_RESET_TIME_KEY) || '0', 10);
    }

    private createTimeLeftText() {
        this.timeLeftText = this.add.text(
            1650,
            1000,
            ``,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private getOrCreateStartTime(): number {
        const stored = localStorage.getItem(QUEST_START_TIME_KEY);
        if (stored) return parseInt(stored, 10);

        const now = Date.now();
        localStorage.setItem(QUEST_START_TIME_KEY, now.toString());
        return now;
    }

    private getStoredStartTime(): number {
        return parseInt(localStorage.getItem(QUEST_START_TIME_KEY) || `${Date.now()}`, 10);
    }

    private setNewStartTime(): void {
        const now = Date.now();
        localStorage.setItem(QUEST_START_TIME_KEY, now.toString());
    }

    private shouldResetQuests(startTime: number): boolean {
        const now = new Date();
        const lastReset = new Date(this.getLastResetTime());

        const baseTime = new Date(startTime);
        const todayReset = new Date(now);
        todayReset.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0);

        // If now is after today’s reset time and we haven’t reset yet today
        return now >= todayReset && lastReset < todayReset;
    }

    private getTimeUntilNextReset(startTime: number): number {
        const now = new Date();
        const baseTime = new Date(startTime);

        const nextReset = new Date(now);
        nextReset.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0);
        nextReset.setMilliseconds(0);

        if (now >= nextReset) {
            // If current time is past today's reset time, next reset is tomorrow
            nextReset.setDate(nextReset.getDate() + 1);
        }

        return nextReset.getTime() - now.getTime();
    }

    private formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }

    private resetQuests(): void {
        console.log('%c[Quest Reset] Daily quests have been reset.', 'color: #00ff00');

        // Example: reset quest progress
        localStorage.setItem('questProgress', '0');
    }

    //region UI
    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
        this.add.existing(this.backButton);
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
}
