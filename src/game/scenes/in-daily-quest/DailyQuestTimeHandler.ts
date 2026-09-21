import { Scene } from 'phaser';
import { getRandomMonsterType, main_config } from '../../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../../LOCAL_STORAGE_MANAGER';

const QUEST_START_TIME_KEY = 'questStartTime';
const QUEST_PERIOD_START_KEY = 'questPeriodStart';
const QUEST_PROGRESS_KEY = 'questProgress';
const CHESTS_KEY = 'chests';

export class DailyQuestTimeHandler {

    scene: Scene;

    /* -------------------------------------------------------------------------- */
    /*                              RESET DAILY QUESTS                            */
    /* -------------------------------------------------------------------------- */

    // static RESET_INTERVAL = 60 * 1000; // TEST MODE: 1 minute
    static RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    /* -------------------------------------------------------------------------- */
    /*                                  BOOTSTRAP                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * Called when the player enters the game / daily quests.
     *
     * The first-ever login establishes the permanent daily reset time.
     *
     * Example:
     *
     * First login:
     * 08:00
     *
     * Daily reset:
     * 08:00 every day
     */
    static initialCheck(): void {

        const startTime = this.getOrCreateStartTime();

        if (this.shouldResetQuests(startTime)) {
            this.resetQuests();
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               STORAGE HELPERS                              */
    /* -------------------------------------------------------------------------- */

    /**
     * Gets the original quest start time.
     *
     * This timestamp NEVER changes after the first login.
     *
     * If the player first logs in at 08:37:42,
     * the daily reset will happen at approximately
     * 08:37:42 every day.
     */
    static getOrCreateStartTime(): number {

        const stored = LOCAL_STORAGE_MANAGER.get(
            QUEST_START_TIME_KEY
        );

        if (stored !== null && stored !== undefined && stored !== '') {
            return parseInt(stored, 10);
        }

        const now = Date.now();

        LOCAL_STORAGE_MANAGER.set(
            QUEST_START_TIME_KEY,
            now.toString()
        );

        return now;
    }

    /**
     * Returns the original quest start timestamp.
     */
    static getStartTime(): number {

        const stored = LOCAL_STORAGE_MANAGER.get(
            QUEST_START_TIME_KEY
        );

        if (stored === null || stored === undefined || stored === '') {
            return this.getOrCreateStartTime();
        }

        return parseInt(stored, 10);
    }

    /**
     * Returns the stored quest period start.
     *
     * This represents the daily period for which the current
     * questProgress belongs.
     */
    static getStoredQuestPeriodStart(): number | null {

        const stored = LOCAL_STORAGE_MANAGER.get(
            QUEST_PERIOD_START_KEY
        );

        if (stored === null || stored === undefined || stored === '') {
            return null;
        }

        const parsed = parseInt(stored, 10);

        if (isNaN(parsed)) {
            return null;
        }

        return parsed;
    }

    /**
     * Stores the period for which the current quests were created.
     */
    static setQuestPeriodStart(periodStart: number): void {

        LOCAL_STORAGE_MANAGER.set(
            QUEST_PERIOD_START_KEY,
            periodStart.toString()
        );
    }

    /* -------------------------------------------------------------------------- */
    /*                             RESET TIME LOGIC                               */
    /* -------------------------------------------------------------------------- */

    /**
     * Gets the reset timestamp that started the CURRENT
     * quest period.
     *
     * Example:
     *
     * Original login:
     * September 21 at 08:00
     *
     * Current time:
     * September 24 at 14:00
     *
     * Returns:
     * September 24 at 08:00
     */
    static getResetTimeForCurrentPeriod(
        startTime: number
    ): number {

        const startDate = new Date(startTime);
        const now = new Date();

        const currentReset = new Date(now);

        currentReset.setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds()
        );

        /**
         * If today's reset time has not happened yet,
         * the current quest period started yesterday.
         */
        if (currentReset.getTime() > now.getTime()) {
            currentReset.setDate(
                currentReset.getDate() - 1
            );
        }

        return currentReset.getTime();
    }

    /**
     * Returns the timestamp for the NEXT daily reset.
     *
     * Example:
     *
     * Original login:
     * 08:00
     *
     * Current time:
     * 11:00
     *
     * Returns:
     * tomorrow at 08:00
     */
    static getNextResetTime(startTime: number): number {

        const startDate = new Date(startTime);
        const now = new Date();

        const nextReset = new Date(now);

        nextReset.setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds()
        );

        /**
         * If today's reset time has already passed,
         * the next reset is tomorrow.
         *
         * If today's reset time is still in the future,
         * that is the next reset.
         */
        if (nextReset.getTime() <= now.getTime()) {
            nextReset.setDate(
                nextReset.getDate() + 1
            );
        }

        return nextReset.getTime();
    }

    /**
     * Determines whether the daily quest should be reset.
     *
     * We compare the daily period that the stored quests belong to
     * against the current daily period.
     *
     * This is much safer than simply checking whether the reset time
     * has passed because the player may be offline for several days.
     */
    static shouldResetQuests(startTime: number): boolean {

        const currentPeriodStart =
            this.getResetTimeForCurrentPeriod(startTime);

        const storedPeriodStart =
            this.getStoredQuestPeriodStart();

        const questProgress =
            LOCAL_STORAGE_MANAGER.get(QUEST_PROGRESS_KEY);

        /**
         * No quests exist.
         *
         * This happens on the player's first login.
         */
        if (!questProgress) {
            return true;
        }

        /**
         * We have quests but don't know which period they belong to.
         *
         * This can happen when upgrading from the old version
         * of the quest system.
         *
         * Treat them as needing a reset.
         */
        if (storedPeriodStart === null) {
            return true;
        }

        /**
         * If the current period is different from the period
         * in which the quests were created, reset them.
         */
        return currentPeriodStart !== storedPeriodStart;
    }

    /**
     * Returns milliseconds until the NEXT reset.
     */
    static getTimeUntilNextReset(
        startTime: number = this.getStartTime()
    ): number {

        const nextResetTime =
            this.getNextResetTime(startTime);

        return Math.max(
            0,
            nextResetTime - Date.now()
        );
    }

    /* -------------------------------------------------------------------------- */
    /*                                FORMATTING                                  */
    /* -------------------------------------------------------------------------- */

    static formatTime(ms: number): string {

        const totalSeconds = Math.floor(ms / 1000);

        const hours = Math.floor(
            totalSeconds / 3600
        );

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const seconds =
            totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }

    /* -------------------------------------------------------------------------- */
    /*                                QUEST LOGIC                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * Resets the quests for the CURRENT daily period.
     *
     * Important:
     *
     * We store the period AFTER determining it.
     *
     * Therefore, if this method gets called again during the same
     * period, shouldResetQuests() will return false.
     */
    static resetQuests(): void {

        const startTime =
            this.getOrCreateStartTime();

        const currentPeriodStart =
            this.getResetTimeForCurrentPeriod(startTime);

        console.log(
            '%c[Quest Reset] Daily quests have been reset.',
            'color: #00ff00'
        );

        this.createQuests();

        /**
         * Remember which daily period these quests belong to.
         */
        this.setQuestPeriodStart(
            currentPeriodStart
        );
    }

    /**
     * Creates a new set of daily quests.
     */
    static createQuests(): void {

        const dailyQuestsInfo =
            main_config.dailyQuests;

        const questsData: any[] = [];

        const monsterTypesCreated: number[] = [];

        for (
            let index = 0;
            index < dailyQuestsInfo.questsCount;
            index++
        ) {

            let randomMonsterType =
                getRandomMonsterType() as number;

            /**
             * Make sure the same monster type isn't selected
             * twice for the daily quests.
             */
            while (
                monsterTypesCreated.includes(
                    randomMonsterType
                )
            ) {
                randomMonsterType =
                    getRandomMonsterType() as number;
            }

            monsterTypesCreated.push(
                randomMonsterType
            );

            /* ------------------------------------------------------------------ */
            /*                              KILL QUEST                             */
            /* ------------------------------------------------------------------ */

            if (index < 4) {

                const count =
                    Phaser.Math.RND.between(
                        dailyQuestsInfo
                            .monstersKillCountNeededForRewardRange
                            .min,

                        dailyQuestsInfo
                            .monstersKillCountNeededForRewardRange
                            .max
                    );

                questsData.push({
                    questType: 'kill',
                    monsterType: randomMonsterType,
                    progress: `0/${count}`,
                    isClaimed: false
                });
            }

            /* ------------------------------------------------------------------ */
            /*                            UPGRADE QUEST                            */
            /* ------------------------------------------------------------------ */

            else {

                const count =
                    Phaser.Math.RND.between(
                        dailyQuestsInfo
                            .monstersUpgradeCountNeededForRewardRange
                            .min,

                        dailyQuestsInfo
                            .monstersUpgradeCountNeededForRewardRange
                            .max
                    );

                questsData.push({
                    questType: 'upgrade',
                    monsterType: randomMonsterType,
                    progress: `0/${count}`,
                    isClaimed: false
                });
            }
        }

        LOCAL_STORAGE_MANAGER.set(
            QUEST_PROGRESS_KEY,
            questsData
        );

        LOCAL_STORAGE_MANAGER.set(
            CHESTS_KEY,
            [false, false, false]
        );
    }
}