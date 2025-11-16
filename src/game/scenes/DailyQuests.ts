import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { DailyQuestItem } from './in-daily-quest/DailyQuestItem';
import { getMonsterDataConfig, getRandomMonsterType, main_config } from '../configs/main_config';
import { DailyQuestTimeHandler } from './in-daily-quest/DailyQuestTimeHandler';
import { Monster } from './in-game/Monster';


export class DailyQuests extends AbstractScene {

    coins: string | null;
    timeLeftText: Phaser.GameObjects.Text;
    coinText: Phaser.GameObjects.Text;
    coinTexture: Phaser.GameObjects.Image;
    backButton: Button;
    headerText: Phaser.GameObjects.Text;
    progressBarBg: Phaser.GameObjects.Graphics;
    progressBarFill: Phaser.GameObjects.Graphics;
    progressText: Phaser.GameObjects.Text;
    progressBarWidth: number;
    progressBarPosition: { x: number; y: number; };
    chests: Phaser.GameObjects.Image[] = [];
    totalProgress: number;
    gems: string;
    gemsText: Phaser.GameObjects.Text;
    gemsTexture: Phaser.GameObjects.Image;

    constructor() {
        super('DailyQuests');
    }

    create() {

        super.create();
        this.createCoins();
        this.createBackButton();
        this.createHeaderTexts();
        this.createTimeLeftText();
        // const startTime = DailyQuestTimeHandler.getOrCreateStartTime();
        // if (DailyQuestTimeHandler.shouldResetQuests(startTime)) {
        //     DailyQuestTimeHandler.resetQuests();
        //     DailyQuestTimeHandler.setLastResetTime();
        // }
        // else {
        this.showQuests();
        // }

        this.getTotalProgress();
        this.drawProgressBar();

        // Update timer every second
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const updatedStartTime = DailyQuestTimeHandler.getStoredStartTime();

                // ✅ Check if quests should reset
                if (DailyQuestTimeHandler.shouldResetQuests(updatedStartTime)) {
                    DailyQuestTimeHandler.resetQuests();
                    DailyQuestTimeHandler.setLastResetTime();
                }

                const timeLeft = DailyQuestTimeHandler.getTimeUntilNextReset(updatedStartTime);
                this.timeLeftText.setText(`Time left: ${DailyQuestTimeHandler.formatTime(timeLeft)}`);
            },
        });
    }

    //region QUESTS

    getTotalProgress() {
        const dailyQuestsInfo = JSON.parse(localStorage.getItem('questProgress') ?? "null");
        this.totalProgress = dailyQuestsInfo.filter((p: any) => p.progress.split('/')[0] === p.progress.split('/')[1]).length / dailyQuestsInfo.length;
    }

    showQuests() {
        // shows quests stored in local storage
        const dailyQuestsInfo = JSON.parse(localStorage.getItem('questProgress') ?? "null");
        for (let index = 0; index < dailyQuestsInfo.length; index++) {
            const monsterType = dailyQuestsInfo[index].monsterType;
            const monstersTotalCount = dailyQuestsInfo[index].progress.split('/')[1];
            const questType = dailyQuestsInfo[index].questType;
            if (index < 4) {
                new DailyQuestItem(this, 360 + (index * 300), 340, true, `${monsterType}`, `${questType} ${monstersTotalCount} monsters`, `${dailyQuestsInfo[index].progress}`);
            } else {
                const monstersTotalCount = dailyQuestsInfo[index].progress.split('/')[1];
                new DailyQuestItem(this, 360 + (index * 300), 340, false, `${monsterType}`, `${questType} ${monstersTotalCount} monsters`, `${dailyQuestsInfo[index].progress}`);
            }
        }
    }

    private drawProgressBar() {
        this.progressBarPosition = {
            x: 210,
            y: 850
        }
        this.progressBarWidth = 1500;
        const height = 30;
        const radius = 10;
        // Background  
        this.progressBarBg = this.add.graphics();
        this.progressBarBg.fillStyle(0x222222);
        this.progressBarBg.fillRoundedRect(this.progressBarPosition.x, this.progressBarPosition.y, this.progressBarWidth, height, radius);

        this.progressBarFill = this.add.graphics();

        this.progressBarFill.fillStyle(0x00ff00);
        const fillWidth = this.progressBarWidth * this.totalProgress;
        this.progressBarFill.fillRoundedRect(this.progressBarPosition.x, this.progressBarPosition.y, fillWidth, height, radius);

        this.addChests();
    }

    private addChests() {
        const chestsInfo = JSON.parse(localStorage.getItem('chests') ?? "null");
        for (let index = 0; index < 3; index++) {
            const x = this.progressBarPosition.x + this.progressBarWidth * ((index + 1) * 0.33);
            const y = this.progressBarPosition.y;
            const chest = this.add.image(x, y, 'chest').setOrigin(0.5);
            this.chests.push(chest);

            const isReached = this.totalProgress > (index + 1) * 0.33;
            const isClaimed = chestsInfo[index];
            if (isReached && isClaimed) {
                chest.setAlpha(0.65).disableInteractive()
            } else if (isReached) {
                chest.setInteractive();
                this.tweens.add({
                    targets: chest,
                    duration: 500,
                    scale: 1.1,
                    yoyo: true,
                    repeat: - 1
                })
                chest.on('pointerdown', () => {
                    this.tweens.killTweensOf(chest);
                    chest.setAlpha(0.65).setScale(1).disableInteractive();
                    this.showChestRewards(index);
                })
            }
        }
    }

    showChestRewards(rewardIndex: number) {
        const allPossibleRewards = main_config.dailyQuests.chestRewards[rewardIndex];

        const hasOneStarMonsterReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.oneStarMonsterChance;
        const hasTwoStarMonsterReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.twoStarMonsterChance;
        const hasThreeStarMonsterReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.threeStarMonsterChance;
        const hasFourStarMonsterReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.fourStarMonsterChance;
        const hasFreeCommonPackReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.commonPackChance;
        const hasFreeSilverPackReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.silverPackChance;
        const hasFreeGoldPackReward = Phaser.Math.RND.between(0, 100) <= allPossibleRewards.goldPackChance;

        let totalWidthSoFar = 0;
        let lastElementX = 0;

        let newMonsters = [];

        const rewardsContainer = new Phaser.GameObjects.Container(this, 0, 0).setDepth(100);
        this.add.existing(rewardsContainer);

        console.log(allPossibleRewards)

        //====================================================================================================================================
        // bg overlay
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.tweens.add({
            targets: overlay,
            duration: 200,
            alpha: 0.9
        })
        this.add.existing(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        // REWARD TEXT
        const rewardtext: Phaser.GameObjects.Text = this.add.text(
            960,
            400,
            'REWARDS: ',
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
        // rewardsContainer.add(rewardtext);
        //====================================================================================================================================


        //coin img
        let coin = this.add.image(lastElementX, 600, 'coin').setOrigin(0, 0.5).setScale(0.5);
        rewardsContainer.add(coin);
        totalWidthSoFar += coin.displayWidth;
        lastElementX += coin.displayWidth;

        // COIN TEXT
        let coinsWon = Phaser.Math.RND.between(allPossibleRewards.coins.min, allPossibleRewards.coins.max);
        const cointext: Phaser.GameObjects.Text = this.add.text(
            coin.x + coin.displayWidth,
            600,
            `x${coinsWon}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);
        rewardsContainer.add(cointext);
        totalWidthSoFar += cointext.displayWidth;
        lastElementX += cointext.displayWidth;

        // one star monster rewawrd
        if (hasOneStarMonsterReward) {
            const monsterSize = 150;
            const monsterPadding = 40;
            const monsterRewardType = getRandomMonsterType();
            const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, 1 - 1);
            const monster = new Monster(this, lastElementX + monsterSize / 2 + monsterPadding, 600, monsterSize, monsterSize, newMonsterConfig, 0, true)
            monster.starsContainer.x = monsterSize / -4 + 18;
            monster.movesLeftContainer.x = monsterSize / 2 + 21;
            rewardsContainer.add(monster);
            totalWidthSoFar += monsterPadding + monsterSize;
            lastElementX += monsterSize + monsterPadding;
            newMonsters.push({
                type: monsterRewardType,
                stars: 1
            });
        }

        // two star monster rewawrd
        if (hasTwoStarMonsterReward) {
            const monsterSize = 150;
            const monsterPadding = 40;
            const monsterRewardType = getRandomMonsterType();
            const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, 2 - 1);
            const monster = new Monster(this, lastElementX + monsterSize / 2 + monsterPadding, 600, monsterSize, monsterSize, newMonsterConfig, 0, true)
            monster.starsContainer.x = monsterSize / -4 + 18;
            monster.movesLeftContainer.x = monsterSize / 2 + 21;
            rewardsContainer.add(monster);
            totalWidthSoFar += monsterPadding + monsterSize;
            lastElementX += monsterSize + monsterPadding;
            newMonsters.push({
                type: monsterRewardType,
                stars: 2
            });
        }

        // three star monster rewawrd
        if (hasThreeStarMonsterReward) {
            const monsterSize = 150;
            const monsterPadding = 40;
            const monsterRewardType = getRandomMonsterType();
            const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, 3 - 1);
            const monster = new Monster(this, lastElementX + monsterSize / 2 + monsterPadding, 600, monsterSize, monsterSize, newMonsterConfig, 0, true)
            monster.starsContainer.x = monsterSize / -4 + 18;
            monster.movesLeftContainer.x = monsterSize / 2 + 21;
            rewardsContainer.add(monster);
            totalWidthSoFar += monsterPadding + monsterSize;
            lastElementX += monsterSize + monsterPadding;
            newMonsters.push({
                type: monsterRewardType,
                stars: 3
            });
        }

        // four star monster rewawrd
        if (hasFourStarMonsterReward) {
            const monsterSize = 150;
            const monsterPadding = 40;
            const monsterRewardType = getRandomMonsterType();
            const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, 4 - 1);
            const monster = new Monster(this, lastElementX + monsterSize / 2 + monsterPadding, 600, monsterSize, monsterSize, newMonsterConfig, 0, true)
            monster.starsContainer.x = monsterSize / -4 + 18;
            monster.movesLeftContainer.x = monsterSize / 2 + 21;
            rewardsContainer.add(monster);
            totalWidthSoFar += monsterPadding + monsterSize;
            lastElementX += monsterSize + monsterPadding;
            newMonsters.push({
                type: monsterRewardType,
                stars: 4
            });
        }

        // free common pack
        if (hasFreeCommonPackReward) {
            const padding = 20;
            let pack = this.add.image(lastElementX + padding, 600, 'common-pack').setOrigin(0, 0.5).setScale(0.2);
            rewardsContainer.add(pack);
            totalWidthSoFar += pack.displayWidth + padding;
            lastElementX += pack.displayWidth + padding;
        }

        // free silver pack
        if (hasFreeSilverPackReward) {
            const padding = 20;
            let pack = this.add.image(lastElementX + padding, 600, 'silver-pack').setOrigin(0, 0.5).setScale(0.2);
            rewardsContainer.add(pack);
            totalWidthSoFar += pack.displayWidth + padding;
            lastElementX += pack.displayWidth + padding;
        }

        // free gold pack
        if (hasFreeGoldPackReward) {
            const padding = 20;
            let pack = this.add.image(lastElementX + padding, 600, 'gold-pack').setOrigin(0, 0.5).setScale(0.2);
            rewardsContainer.add(pack);
            totalWidthSoFar += pack.displayWidth + padding;
            lastElementX += pack.displayWidth + padding;
        }

        //center reward container
        rewardsContainer.x = 960 - totalWidthSoFar / 2;

        // claim button
        const claimButton = new Button(this, 960, 850, 'claim', null, () => {
            claimButton.disableInteractive();
            //UPDATE CHEST REWARDS ARRAY
            let chestsReward = JSON.parse(localStorage.getItem('chests') ?? "[]");
            chestsReward[rewardIndex] = true;
            localStorage.setItem('chests', JSON.stringify(chestsReward));

            // UPDATE PLAYER COINS(LOCALE STORAGE) 
            const playerCoins = localStorage.getItem('coins') || '0';
            this.coins = `${+playerCoins + +coinsWon}`;
            localStorage.setItem('coins', this.coins);
            this.coinText.setText(this.coins);
            this.coinTexture.x = this.coinText.x - this.coinText.width;

            // UPDATE FREE COMMON PACKS
            if (hasFreeCommonPackReward) {
                const freeCommonPacks = JSON.parse(localStorage.getItem('freeCommonPacks') ?? '0');
                localStorage.setItem('freeCommonPacks', JSON.stringify(+freeCommonPacks + 1));
            }

            // UPDATE FREE SILVER PACKS
            if (hasFreeSilverPackReward) {
                const freeSilverPacks = JSON.parse(localStorage.getItem('freeSilverPacks') ?? '0');
                localStorage.setItem('freeSilverPacks', JSON.stringify(+freeSilverPacks + 1));
            }

            // UPDATE FREE GOLD PACKS
            if (hasFreeGoldPackReward) {
                const freeGoldPacks = JSON.parse(localStorage.getItem('freeGoldPacks') ?? '0');
                localStorage.setItem('freeGoldPacks', JSON.stringify(+freeGoldPacks + 1));
            }

            // ADDING NEW MONSTER REWARD TO THE PLAYER DESK(LOCALE STORAGE )
            let monsterNotClaimed = false;
            newMonsters.forEach((m: any) => {
                const playerMonstersCount = JSON.parse(localStorage.getItem('playerMonstersData') ?? "null").length;
                if (playerMonstersCount >= main_config.maxMonstersAllowedInDeck) {
                    monsterNotClaimed = true;
                    return;
                } else {
                    const STORAGE_KEY = 'playerMonstersData';
                    const storedData = localStorage.getItem(STORAGE_KEY);
                    const dataArray = storedData ? JSON.parse(storedData) : [];
                    const newObject = { type: m.type, stars: m.stars, row: NaN, col: 11 };
                    dataArray.push(newObject);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
                }
            });

            // CONTINUE
            if (monsterNotClaimed) {
                rewardsContainer.destroy(true);
                const msg = this.add.text(
                    960,
                    540,
                    `some monsters not claimed, maximum 40 monsters allowed!`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4, wordWrap: { width: 700 },
                        align: 'center'
                    }
                ).setOrigin(0.5).setAlpha(0);
                this.time.delayedCall(4000, () => {
                    this.tweens.chain({
                        tweens: [
                            {
                                targets: overlay,
                                duration: 500,
                                alpha: 0.9
                            },
                            {
                                targets: msg,
                                duration: 350,
                                alpha: 1,
                                onComplete: () => {
                                    overlay.destroy(true);
                                    rewardtext.destroy(true);
                                    claimButton.destroy(true);
                                    msg.destroy(true);
                                }
                            }
                        ]
                    })
                })

            } else {
                this.tweens.chain({
                    tweens: [
                        {
                            targets: rewardsContainer,
                            duration: 350,
                            scale: 0
                        },
                        {
                            targets: [claimButton, rewardtext],
                            duration: 500,
                            scale: 0
                        },
                        {
                            targets: overlay,
                            duration: 350,
                            alpha: 0,
                            onComplete: () => {
                                overlay.destroy(true);
                                claimButton.destroy(true);
                                rewardtext.destroy(true);
                                rewardsContainer.destroy(true);
                            }
                        }
                    ]
                })
            }
        });
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

    private createHeaderTexts() {
        this.headerText = this.add.text(
            960,
            100,
            `daily quests:`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);

        this.progressText = this.add.text(
            960,
            750,
            `progress:`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);
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
        this.gems = localStorage.getItem('gems') || '0';
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
    }

    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }
}
