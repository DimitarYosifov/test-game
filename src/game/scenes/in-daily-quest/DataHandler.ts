import { Scene } from 'phaser';
import { Monster } from '../in-game/Monster';
import { getAllMonsterTypes, getMonsterDataConfig, main_config } from '../../configs/main_config';
import { LOCAL_STORAGE_MANAGER } from '../../LOCAL_STORAGE_MANAGER';

export class DataHandler {
    scene: Scene;

    static checkDataOnMonsterDeath(monster: Monster) {
        //DAILY QUEST
        const dailyQuestsInfo = (LOCAL_STORAGE_MANAGER.get('questProgress') as []);
        const monterFoundInDailyQuest: any = dailyQuestsInfo.find((x: any) => +x.monsterType === +monster.type && x.questType === 'kill')
        if (monterFoundInDailyQuest) {
            const killedMonsters = monterFoundInDailyQuest?.progress.split('/')[0];
            const totalMonstersCount = monterFoundInDailyQuest.progress.split('/')[1];
            if (+killedMonsters < +totalMonstersCount) {
                monterFoundInDailyQuest.progress = `${+killedMonsters + 1}/${+totalMonstersCount}`;
            }
            LOCAL_STORAGE_MANAGER.set('questProgress', dailyQuestsInfo);
        }

        //ACHIEVEMENTS
        //check monster kill achievement
        const achievements = LOCAL_STORAGE_MANAGER.get('achievements');
        const killMonsterAchievement: any = (achievements as []).find((a: any) => a.type === monster.type);

        if (killMonsterAchievement) {
            const currentAchievementLevel = killMonsterAchievement.data.steps[0];
            const killCountSoFar = currentAchievementLevel.progress;
            const totalCountForAchievementReward = currentAchievementLevel.count;
            if (killCountSoFar < totalCountForAchievementReward) {
                //add 1 to monster kill count
                killMonsterAchievement.data.steps[0].progress++
                LOCAL_STORAGE_MANAGER.set('achievements', achievements);
            }
        }

        //check damage done achievement
        const damageDoneAchievement: any = (achievements as []).find((a: any) => a.data.description === 'damage done');
        if (damageDoneAchievement) {
            const currentAchievementLevel = damageDoneAchievement.data.steps[0];
            const damageDoneSoFar = currentAchievementLevel.progress;
            const totalDamageDoneForAchievementReward = currentAchievementLevel.count;
            if (damageDoneSoFar < totalDamageDoneForAchievementReward) {
                const monsterGenericData = getMonsterDataConfig(+monster.type, monster.unitData.stars - 1);
                const dmgDone = monsterGenericData.health;
                damageDoneAchievement.data.steps[0].progress += dmgDone;
                LOCAL_STORAGE_MANAGER.set('achievements', achievements);
            }
        }
    }

    static hasDailyQuestRewardPending(): boolean {
        const dailyQuestsInfo = LOCAL_STORAGE_MANAGER.get('questProgress');
        const chestsInfo = LOCAL_STORAGE_MANAGER.get('chests');
        let pendingReward = false;

        const totalProgress = (dailyQuestsInfo as []).filter((p: any) => p.progress.split('/')[0] === p.progress.split('/')[1]).length / dailyQuestsInfo.length;

        for (let index = 0; index < 3; index++) {
            const isReached = totalProgress > (index + 1) * 0.33;
            const isClaimed = (chestsInfo as [])[index];
            if (isReached && !isClaimed) {
                pendingReward = true;
                break;
            }
        }
        return pendingReward;
    }

    static onMonsterUpgrade() {
        // check daily quest upgrades
        const dailyQuestsInfo = LOCAL_STORAGE_MANAGER.get('questProgress');
        const monterFoundInDailyQuest: any = (dailyQuestsInfo as []).find((x: any) => x.questType === 'upgrade')
        if (monterFoundInDailyQuest) {
            const upgradedMonsters = monterFoundInDailyQuest.progress.split('/')[0];
            const totalMonstersCount = monterFoundInDailyQuest.progress.split('/')[1];
            if (+upgradedMonsters < +totalMonstersCount) {
                monterFoundInDailyQuest.progress = `${+upgradedMonsters + 1}/${+totalMonstersCount}`;
            }
            LOCAL_STORAGE_MANAGER.set('questProgress', dailyQuestsInfo);
        }

        // check achievement upgrades
        const achievements = LOCAL_STORAGE_MANAGER.get('achievements');
        const upgradeAchievement: any = (achievements as []).find((a: any) => a.data.description === 'upgrade monsters');
        if (upgradeAchievement) {
            const currentAchievementLevel = upgradeAchievement.data.steps[0];
            const upgradesSoFar = currentAchievementLevel.progress;
            const totalUpgradesDoneForAchievementReward = currentAchievementLevel.count;
            if (upgradesSoFar < totalUpgradesDoneForAchievementReward) {
                upgradeAchievement.data.steps[0].progress++;
                LOCAL_STORAGE_MANAGER.set('achievements', achievements);
            }
        }
    }

    static onMonsterSold() {
        const achievements = LOCAL_STORAGE_MANAGER.get('achievements');
        const sellMonstersAchievement: any = (achievements as []).find((a: any) => a.data.description === 'sell monsters');
        if (sellMonstersAchievement) {
            const currentAchievementLevel = sellMonstersAchievement.data.steps[0];
            const soldSoFar = currentAchievementLevel.progress;
            const totalSoldForAchievementReward = currentAchievementLevel.count;
            if (soldSoFar < totalSoldForAchievementReward) {
                sellMonstersAchievement.data.steps[0].progress++;
                LOCAL_STORAGE_MANAGER.set('achievements', achievements);
            }
        }
    }

    static setInitialAchievements() {

        let storedAchievementsData = LOCAL_STORAGE_MANAGER.get('achievements');
        if (storedAchievementsData) return;

        let totalRowsSoFar = 0;
        let achievementsData: any = [];
        //CREATE MONSTERS ACHIEVEMENTS
        getAllMonsterTypes().forEach((type: string, index: number) => {
            const data = JSON.parse(
                JSON.stringify(main_config.achievements.monsters)
            );
            totalRowsSoFar++;
            achievementsData.push({
                data,
                type
            });
        });

        //CREATE UPGRADE CARDS ACHIEVEMENTS
        const data = main_config.achievements.upgrades;
        totalRowsSoFar++;
        achievementsData.push({
            data,
            type: ''
        });

        //CREATE SELL CARDS ACHIEVEMENTS
        const sellCardsData = main_config.achievements.sells;
        totalRowsSoFar++;
        achievementsData.push({
            data: sellCardsData,
            type: ''
        });

        //CREATE DAMAGE DONE ACHIEVEMENTS
        const damageDoneData = main_config.achievements.damageDone;
        totalRowsSoFar++;
        achievementsData.push({
            data: damageDoneData,
            type: ''
        });
        LOCAL_STORAGE_MANAGER.set('achievements', achievementsData);
    }

    static hasAchievementRewardPending() {
        const achievementsInfo = LOCAL_STORAGE_MANAGER.get('achievements');
        let pendingReward = (achievementsInfo as []).some((x: any) => x.data.steps && x.data.steps[0].progress >= x.data.steps[0].count);
        return pendingReward;
    }
}
