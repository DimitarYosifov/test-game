import { Scene } from 'phaser';
import { getRandomMonsterType, main_config } from '../../configs/main_config';

const QUEST_START_TIME_KEY = 'questStartTime';
const LAST_RESET_TIME_KEY = 'lastResetTime';
// const TEST_DURATION_MS = 3 * 60 * 1000; // 5 minutes in milliseconds


export class DailyQuestTimeHandler {
  
    scene: Scene;

    static initialCheck() {
        const startTime = this.getOrCreateStartTime();
        if (this.shouldResetQuests(startTime)) {
            this.resetQuests();
            DailyQuestTimeHandler.setLastResetTime();
        }
    }

    static setLastResetTime(): void {
        localStorage.setItem(LAST_RESET_TIME_KEY, Date.now().toString());
    }

    static getLastResetTime(): number {
        return parseInt(localStorage.getItem(LAST_RESET_TIME_KEY) || '0', 10);
    }

    static getOrCreateStartTime(): number {
        const stored = localStorage.getItem(QUEST_START_TIME_KEY);
        if (stored) return parseInt(stored, 10);

        const now = Date.now();
        localStorage.setItem(QUEST_START_TIME_KEY, now.toString());
        return now;
    }

    static getStoredStartTime(): number {
        return parseInt(localStorage.getItem(QUEST_START_TIME_KEY) || `${Date.now()}`, 10);
    }

    static setNewStartTime(): void {
        const now = Date.now();
        localStorage.setItem(QUEST_START_TIME_KEY, now.toString());
    }

    static shouldResetQuests(startTime: number): boolean {
        const now = new Date();
        const lastReset = new Date(this.getLastResetTime());

        const baseTime = new Date(startTime);
        const todayReset = new Date(now);
        todayReset.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), 0);

        // If now is after today’s reset time and we haven’t reset yet today
        return now >= todayReset && lastReset < todayReset;
    }

    static getTimeUntilNextReset(startTime: number): number {
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

    static formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }

    static resetQuests(): void {
        console.log('%c[Quest Reset] Daily quests have been reset.', 'color: #00ff00');
        this.createQuests();
    }


    static createQuests() {
        //creates newly random quests and stres them in local storage
        const dailyQuestsInfo = main_config.dailyQuests;
        const quests = [];
        let questsData = [];
        const monsterTypesCreated: number[] = [];

        for (let index = 0; index < dailyQuestsInfo.questsCount; index++) {
            let randomMonsterType = getRandomMonsterType();
            while (monsterTypesCreated.includes(randomMonsterType)) {
                randomMonsterType = getRandomMonsterType();
            }
            monsterTypesCreated.push(randomMonsterType)
            let quest;
            let questData;
            if (index < 4) {
                // first 4 quests are killing certrain amount of monsters
                const randomMonstersCount = Phaser.Math.RND.between(dailyQuestsInfo.monstersKillCountNeededForRewardRange.min, dailyQuestsInfo.monstersKillCountNeededForRewardRange.max);
                // quest = new DailyQuestItem(this, 360 + (index * 300), 200, true, `${randomMonsterType}`, `kill ${randomMonstersCount} monsters`, `0/${randomMonstersCount}`);
                questData = {
                    questType: 'kill',
                    monsterType: randomMonsterType,
                    progress: `0/${randomMonstersCount}`,
                    isClaimed: false
                }
            } else {
                //5-th quest is to update monsters certain times
                const randomMonstersCount = Phaser.Math.RND.between(dailyQuestsInfo.monstersUpgradeCountNeededForRewardRange.min, dailyQuestsInfo.monstersUpgradeCountNeededForRewardRange.max);
                // quest = new DailyQuestItem(this, 360 + (index * 300), 200, false, `${randomMonsterType}`, `upgrade ${randomMonstersCount} monsters`, `0/${randomMonstersCount}`, true);
                questData = {
                    questType: 'upgrade',
                    monsterType: randomMonsterType,
                    progress: `0/${randomMonstersCount}`,
                    isClaimed: false
                }
            }
            quests.push(quest);
            questsData.push(questData);
        }
        localStorage.setItem('questProgress', JSON.stringify(questsData));
        localStorage.setItem('chests', JSON.stringify([false, false, false]));
    }
}
