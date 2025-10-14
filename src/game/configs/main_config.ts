import { monsters_power_config } from "./monsters_power_config";

export const main_config = {
    "gridSizeHorizontal": 12,
    "gridSizeVertical": 7,
    "cellSize": 125,
    "gameWidth": 1920,
    "gameHeight": 1080,
    "lineWidth": 6,
    "fullCloudsOpacity": 1,// clouds visibility
    "rangedUnitsRange": 2,
    "playerStartingCoins": 50,
    "playerStartingFreeCommonPacks": 3,
    "chanceToDropPack": [ //rnd between 1 and 1000
        965,   //  96.5% for no drop
        985,   //     2% for common pack
        995,   //     1% for silver pack
        1000,  //   0.5% for golden pack
    ],
    "chanceToGetMonsterOnLevelWin": 25, // 25%
    "afterLevelMonsterReward": [
        89,   // 89% for 1 star  monster
        99,   // 10% for 2 stars monster
        100,  //  1% for 3 stars monster
        0,    //  0% for 4 stars monster
        0,    //  0% for 5 stars monster
    ],
    "packData": {
        "commonPack": {
            cost: 50,
            monsterLevelOdds: [
                95,  // 95% for 1 star  monster
                100, //  5% for 2 stars monster
                0,   //  0% for 3 stars monster
                0,   //  0% for 4 stars monster
                0,   //  0% for 5 stars monster
            ]
        },
        "silverPack": {
            cost: 250,
            monsterLevelOdds: [
                75,  //  75% for 1 star  monster
                95,  //  20% for 2 stars monster
                100, //   5% for 3 stars monster
                0,   //   0% for 4 stars monster
                0,   //   0% for 5 stars monster
            ]
        },
        "goldPack": {
            cost: 750,
            monsterLevelOdds: [
                60,  //   60% for 1 star  monster
                85,  //   25% for 2 stars monster
                99,  //   14% for 3 stars monster
                100, //    1% for 4 stars monster
                0,   //    0% for 5 stars monster
            ]
        }
    },
    "dailyQuests": {
        "questsCount": 5,
        "monstersKillCountNeededForRewardRange": {
            "min": 25,
            "max": 40
        },
        "monstersUpgradeCountNeededForRewardRange": {
            "min": 5,
            "max": 15
        },
        "chestRewards": [
            //1st chest rewards
            {
                "coins": {
                    "min": 10,
                    "max": 100,
                },
                "oneStarMonsterChance": 20,  // %
                "twoStarMonsterChance": 5,   // %
                "threeStarMonsterChance": 0, // %
                "fourStarMonsterChance": 0,  // %
                "commonPackChance": 50,      // %
                "silverPackChance": 10,      // %
                "goldPackChance": 1,         // %

            },
            //2nd chest rewards
            {
                "coins": {
                    "min": 50,
                    "max": 500,
                },
                "oneStarMonsterChance": 50,  // %
                "twoStarMonsterChance": 15,   // %
                "threeStarMonsterChance": 5, // %
                "fourStarMonsterChance": 0,  // %
                "commonPackChance": 80,      // %
                "silverPackChance": 25,      // %
                "goldPackChance": 5,         // %
            },
            //3rd chest rewards
            {
                "coins": {
                    "min": 250,
                    "max": 2500,
                },
                "oneStarMonsterChance": 80,  // %
                "twoStarMonsterChance": 30,   // %
                "threeStarMonsterChance": 15, // %
                "fourStarMonsterChance": 2,  // %
                "commonPackChance": 100,      // %
                "silverPackChance": 50,      // %
                "goldPackChance": 15,         // %
            }
        ]
    },
    "achievements": {
        "monsters": {
            "description": "kill monsters",
            "hasIMage": true,
            "steps": [// 100, 500, 2000
                {
                    "count": 100,
                    "progress": 0,
                    "rewards": {
                        "coins": 100
                    }
                },
                {
                    "count": 500,
                    "progress": 0,
                    "rewards": {
                        "coins": 500
                    }
                },
                {
                    "count": 2000,
                    "progress": 0,
                    "rewards": {
                        "coins": 2000
                    }
                }
            ]
        },
        "upgrades": {
            "description": "upgrade monsters",
            "hasIMage": false,
            "steps": [//50, 250, 1000
                {
                    "count": 50,
                    "progress": 0,
                    "rewards": {
                        "coins": 500
                    }
                },
                {
                    "count": 250,
                    "progress": 0,
                    "rewards": {
                        "coins": 2500
                    }
                },
                {
                    "count": 1000,
                    "progress": 0,
                    "rewards": {
                        "coins": 10000
                    }
                }
            ]
        },
        "sells": {
            "description": "sell monsters",
            "hasIMage": false,
            "steps": [ // 20, 100, 5000
                {
                    "count": 20,
                    "progress": 0,
                    "rewards": {
                        "coins": 200
                    }
                },
                {
                    "count": 100,
                    "progress": 0,
                    "rewards": {
                        "coins": 1000
                    }
                },
                {
                    "count": 5000,
                    "progress": 0,
                    "rewards": {
                        "coins": 50000
                    }
                }
            ]
        },
        "damageDone": {
            "description": "damage done",
            "hasIMage": false,
            "steps": [// 5000, 50000, 500000
                {
                    "count": 5000,
                    "progress": 0,
                    "rewards": {
                        "coins": 500
                    }
                },
                {
                    "count": 50000,
                    "progress": 0,
                    "rewards": {
                        "coins": 5000
                    }
                },
                {
                    "count": 500000,
                    "progress": 0,
                    "rewards": {
                        "coins": 50000
                    }
                }
            ]
        }
    }


    // TODO:
    // ADD ROUNDS LIMIT FOR EACH LEVEL                                                                                                  ^HIGH PRIORITY^
    // ADD BUFFS AT THE BEGINNING OF THE LEVEL AND AT RANDOM EACH ROUND                                                                 ^HIGH PRIORITY^
    // ADD 35 MORE LEVELS (MAP 2)                                                                                                       ^HIGH PRIORITY^
    // FIX LAST ENEMY KILLED DROP PACK PRESENTATION(LEVEL ENDS  - PACK NOT REALLY SHOWN) MAY BE ADD TEXT FOR BETTER DESCRIPTION!        ^HIGH PRIORITY^
    // ADD ENERY MECHANIC TO THE GAME
    // ADD SLOT GAME WITH MONSTERS
    // CHECK ENEMY MONSTER TO ATTACK PLAYER MONSTER THAT WILL CAUSE MOST DAMAGE                             NOT SURE IF NEEDED           ^LOW PRIORITY^
    // in-game implement drag movement for creatures                                                                                    ^HIGH PRIORITY^
    // add loading
    // add total power for opponent before level and for the player
    // add text "drag here" to hit rects in card selection
    // add blink tween for the bulbs
    // add additional currency for upgrading monsters and add coin icon to the cost in card selection => upgrade section
    //ADD FIGHT VS 14 OF THE SAME KIND MONSTERS AND AS A REWARD GIVE THIS KIND OG=F MONSTER
    // add space skip for move
    // add some conffetti particles whrn getting a reward
    // ADD SOME ENCRYPTION BEFORE STORING TO LOCAL STORAGE                                                                              ^HIGH PRIORITY^
    // ADD SOME MORE LEVEL BACKGROUNDS
    // ADD 3 MORE MONSTERE - 1 OF EACH TYPE




    //BUGS:



    //CHECK 3 STAR MONSTER  IN THE SELECTED SECTION AND 6 X 1 STAR IN THE MAIN - AND UPGRADE THE 6  - CAUSES BUG ?





    //1. when i monster with 2 moves hits on its first move, its get locked - PROBABLY FIXED

    // below cant be reproduced FOR NOW
    // 2: AFTER SELLIMG CARD CHECK IF THERE IS 3 CARDS PENDING IN ULGRADE SECTION AN ENABLE/DISABLE UPGRADE BUTTON PROPERLY
    // IF SO DONE 3 CARDS IN THE UPGRADE ARE AUTUMATICALLY UPGRADED AFTER REFRESH !!!!

    //3.sometimes angle of the bow is changed when ranged monster is about to act



    // BUG => PROBLEM IN UPGRADE SECTION ======================== AFTER UPGRADE MORE THAN 1 MONSTER IS SET TO THE SAME ROW!!!
    //  ^HIGHEST PRIORITY^ ==========================================

    // BUG  - AFTER UPGRADE ONE SPOT(ROW) IS OCCUPIED BY 2 MONSTERS                                                                            ^HIGH PRIORITY^
    // buf scale tween is buggy sometimes


    //OBSERVATIONS:
    // ON LEVEL 15 ALL MONSTERS ARE LEVEL 2
    // ON LEVEL 11 ALL MONSTERS ARE LEVEL 2 diff run
    // ON LEVEL 13 ALL MONSTERS ARE LEVEL 2 diff run
    // ОN LEVEL 27 - 2 3 STAR MONSTERS
    // ON LVL 20 PLAYER HAS 1 3 STAR MONTER(BOUGHT/UPGRADED)


}

export const getRandomMonsterType = () => {
    return Number(Phaser.Math.RND.pick(Object.keys(monsters_power_config)));
}

export const getAllMonsterTypes = () => {
    return Object.keys(monsters_power_config);
}

export const getMonsterDataConfig = (type: number, stars: number) => {
    return { ...(monsters_power_config as any)[type][stars] };
} 
