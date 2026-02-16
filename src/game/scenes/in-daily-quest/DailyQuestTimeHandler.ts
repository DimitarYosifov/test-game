import { Scene } from 'phaser';
import { getRandomMonsterType, main_config } from '../../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../../LOCAL_STORAGE_MANAGER';

const QUEST_START_TIME_KEY = 'questStartTime';
const LAST_RESET_TIME_KEY = 'lastResetTime';

export class DailyQuestTimeHandler {

    scene: Scene;

    /* -------------------------------------------------------------------------- */
    /*                              RESET DAILY QUESTS                            */
    /* -------------------------------------------------------------------------- */

    // static RESET_INTERVAL = 60 * 1000; // TEST MODE RESET INTERVAL (1 minute)
    static RESET_INTERVAL = 24 * 60 * 60 * 1000; //  🔥  PROD MODE RESET INTERVAL (24 hours)


    /* -------------------------------------------------------------------------- */
    /*                                  BOOTSTRAP                                 */
    /* -------------------------------------------------------------------------- */

    static initialCheck(): void {
        const startTime = this.getOrCreateStartTime();

        if (this.shouldResetQuests(startTime)) {
            this.resetQuests();
            this.setLastResetTime();
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               STORAGE HELPERS                              */
    /* -------------------------------------------------------------------------- */

    static setLastResetTime(): void {
        LOCAL_STORAGE_MANAGER.set(LAST_RESET_TIME_KEY, Date.now().toString());
    }

    static getLastResetTime(): number {
        return parseInt(LOCAL_STORAGE_MANAGER.get(LAST_RESET_TIME_KEY) || '0', 10);
    }

    static getOrCreateStartTime(): number {
        const stored = LOCAL_STORAGE_MANAGER.get(QUEST_START_TIME_KEY);
        if (stored) return parseInt(stored, 10);

        const now = Date.now();
        LOCAL_STORAGE_MANAGER.set(QUEST_START_TIME_KEY, now.toString());
        return now;
    }

    /* -------------------------------------------------------------------------- */
    /*                             RESET TIME LOGIC                               */
    /* -------------------------------------------------------------------------- */

    static shouldResetQuests(startTime: number): boolean {
        const lastResetTime = this.getLastResetTime();

        if (lastResetTime === 0) return true;

        return Date.now() - lastResetTime >= this.RESET_INTERVAL;
    }

    static getTimeUntilNextReset(startTime: number): number {
        const lastResetTime = this.getLastResetTime();

        if (lastResetTime === 0) {
            return this.RESET_INTERVAL;
        }

        const elapsed = Date.now() - lastResetTime;
        const remaining = this.RESET_INTERVAL - elapsed;

        return Math.max(0, remaining);
    }

    /* -------------------------------------------------------------------------- */
    /*                                FORMATTING                                  */
    /* -------------------------------------------------------------------------- */

    static formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }

    /* -------------------------------------------------------------------------- */
    /*                                QUEST LOGIC                                 */
    /* -------------------------------------------------------------------------- */

    static resetQuests(): void {
        console.log('%c[Quest Reset] Daily quests have been reset.', 'color: #00ff00');
        this.createQuests();
    }

    static createQuests(): void {
        const dailyQuestsInfo = main_config.dailyQuests;
        const questsData: any[] = [];
        const monsterTypesCreated: number[] = [];

        for (let index = 0; index < dailyQuestsInfo.questsCount; index++) {

            let randomMonsterType = (getRandomMonsterType() as number);
            while (monsterTypesCreated.includes(randomMonsterType)) {
                randomMonsterType = (getRandomMonsterType() as number);
            }
            monsterTypesCreated.push(randomMonsterType);

            if (index < 4) {
                const count = Phaser.Math.RND.between(
                    dailyQuestsInfo.monstersKillCountNeededForRewardRange.min,
                    dailyQuestsInfo.monstersKillCountNeededForRewardRange.max
                );

                questsData.push({
                    questType: 'kill',
                    monsterType: randomMonsterType,
                    progress: `0/${count}`,
                    isClaimed: false
                });

            } else {
                const count = Phaser.Math.RND.between(
                    dailyQuestsInfo.monstersUpgradeCountNeededForRewardRange.min,
                    dailyQuestsInfo.monstersUpgradeCountNeededForRewardRange.max
                );

                questsData.push({
                    questType: 'upgrade',
                    monsterType: randomMonsterType,
                    progress: `0/${count}`,
                    isClaimed: false
                });
            }
        }

        LOCAL_STORAGE_MANAGER.set('questProgress', questsData);
        LOCAL_STORAGE_MANAGER.set('chests', [false, false, false]);
    }
}
