import { Scene } from 'phaser';

export class DailyQuestDataHandler {
    scene: Scene;

    static checkDataOnMonsterDeath(monsterType: string) {
        const dailyQuestsInfo = JSON.parse(localStorage.getItem('questProgress') ?? "null");
        const monterFoundInDailyQuest = dailyQuestsInfo.find((x: any) => +x.monsterType === +monsterType && x.questType === 'kill')
        if (monterFoundInDailyQuest) {
            const killedMonsters = monterFoundInDailyQuest.progress.split('/')[0];
            const totalMonstersCount = monterFoundInDailyQuest.progress.split('/')[1];
            if (+killedMonsters < +totalMonstersCount) {
                monterFoundInDailyQuest.progress = `${+killedMonsters + 1}/${+totalMonstersCount}`;
            }
            localStorage.setItem('questProgress', JSON.stringify(dailyQuestsInfo));
        }
    }

    static hasDailyQuestRewardPending(): boolean {
        const dailyQuestsInfo = JSON.parse(localStorage.getItem('questProgress') ?? "null");
        const chestsInfo = JSON.parse(localStorage.getItem('chests') ?? "null");
        let pendingReward = false;

        const totalProgress = dailyQuestsInfo.filter((p: any) => p.progress.split('/')[0] === p.progress.split('/')[1]).length / dailyQuestsInfo.length;

        for (let index = 0; index < 3; index++) {
            const isReached = totalProgress > (index + 1) * 0.33;
            const isClaimed = chestsInfo[index];
            if (isReached && !isClaimed) {
                pendingReward = true;
                break;
            }
        }
        return pendingReward;
    }

    static onMonsterUpgrade() {
        const dailyQuestsInfo = JSON.parse(localStorage.getItem('questProgress') ?? "null");
        const monterFoundInDailyQuest = dailyQuestsInfo.find((x: any) => x.questType === 'upgrade')
        if (monterFoundInDailyQuest) {
            const upgradedMonsters = monterFoundInDailyQuest.progress.split('/')[0];
            const totalMonstersCount = monterFoundInDailyQuest.progress.split('/')[1];
            if (+upgradedMonsters < +totalMonstersCount) {
                monterFoundInDailyQuest.progress = `${+upgradedMonsters + 1}/${+totalMonstersCount}`;
            }
            localStorage.setItem('questProgress', JSON.stringify(dailyQuestsInfo));
        }
    }
}
