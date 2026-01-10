import { Scene } from 'phaser';
import { getRandomMonsterType, main_config } from '../../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../../LOCAL_STORAGE_MANAGER';

const QUEST_START_TIME_KEY = 'questStartTime';
const LAST_RESET_TIME_KEY = 'lastResetTime';

export class DailyQuestTimeHandler {

    scene: Scene;

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
    /*                               STORAGE HELPERS                               */
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
    /*                             RESET TIME LOGIC                                */
    /* -------------------------------------------------------------------------- */

    /** Returns today's scheduled reset time (anchored to first launch clock) */
    static getTodayResetTime(startTime: number): Date {
        const now = new Date();
        const base = new Date(startTime);

        const reset = new Date(now);
        reset.setHours(
            base.getHours(),
            base.getMinutes(),
            base.getSeconds(),
            0
        );

        return reset;
    }

    /** Returns the most recent reset that should have occurred */
    static getMostRecentScheduledReset(startTime: number): Date {
        const now = new Date();
        const todayReset = this.getTodayResetTime(startTime);

        // If today's reset hasn't happened yet, the most recent was yesterday
        if (now < todayReset) {
            todayReset.setDate(todayReset.getDate() - 1);
        }

        return todayReset;
    }

    /** Determines whether quests must be reset */
    static shouldResetQuests(startTime: number): boolean {
        const lastResetTime = this.getLastResetTime();

        // First launch → reset immediately
        if (lastResetTime === 0) return true;

        const lastReset = new Date(lastResetTime);
        const mostRecentReset = this.getMostRecentScheduledReset(startTime);

        return lastReset < mostRecentReset;
    }

    /** Returns milliseconds until the next scheduled reset */
    static getTimeUntilNextReset(startTime: number): number {
        const now = new Date();
        const base = new Date(startTime);

        const nextReset = new Date(now);
        nextReset.setHours(
            base.getHours(),
            base.getMinutes(),
            base.getSeconds(),
            0
        );
        nextReset.setMilliseconds(0);

        // If today's reset already passed, next reset is tomorrow
        if (now >= nextReset) {
            nextReset.setDate(nextReset.getDate() + 1);
        }

        return nextReset.getTime() - now.getTime();
    }

    /* -------------------------------------------------------------------------- */
    /*                                FORMATTING                                   */
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
    /*                                QUEST LOGIC                                  */
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