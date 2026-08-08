// region SURVIVAL LEVELS

import { spellsConfig } from "./spells_config";

// W O R L D    1   S U R V I V A L   L E V E L S
export const survivalLevelsWorld1 = [
    {
        levelName: 'survival_level_1',
        survival: true,
        mapPosition: [
            { x: 368, y: 944 },
            { x: 401, y: 979 },
            { x: 451, y: 998 },
            { x: 507, y: 1008 }
        ],
        rewardPerKill: 5,
        newEnemiesPerRound: 3,
        revealedByLevel: 10,
        totalMonstersCount: 100,
        tokensNeededToUnlock: 3,
        levelToken: 'token1',
        hoursToReset: 8,
        newEnemiesStars: [
            50,    // 50% for 1 star  monster
            100,   // 50% for 2 stars monster
            0,     //  0% for 3 stars monster
            0,     //  0% for 4 stars monster
            0,     //  0% for 5 stars monster
        ],
        opponentMonstersData: [
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 }
        ],
        opponentSpells: { // SPELL POINT  10
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.magicBall.damage[0].value,
            //     targets: spellsConfig.magicBall.targets[0].value
            // },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[0].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[0].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    {
        levelName: 'survival_level_2',
        survival: true,
        mapPosition: [
            { x: 831, y: 814 },
            { x: 807, y: 772 },
            { x: 837, y: 727 },
            { x: 892, y: 736 },
        ],
        rewardPerKill: 15,
        newEnemiesPerRound: 3,
        revealedByLevel: 20,
        totalMonstersCount: 100,
        tokensNeededToUnlock: 3,
        levelToken: 'token2',
        hoursToReset: 12,
        newEnemiesStars: [
            25,     // 25% for 1 star  monster
            75,     // 50% for 2 stars monster
            100,    // 25% for 3 stars monster
            0,      //  0% for 4 stars monster
            0,      //  0% for 5 stars monster
        ],
        opponentMonstersData: [
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 }
        ],
        opponentSpells: { // SPELL POINT  28
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    {
        levelName: 'survival_level_3',
        survival: true,
        mapPosition: [
            { x: 1307, y: 417 },
            { x: 1259, y: 441 },
            { x: 1252, y: 491 },
            { x: 1306, y: 506 },
        ],
        rewardPerKill: 30,
        newEnemiesPerRound: 3,
        revealedByLevel: 31,
        totalMonstersCount: 100,
        tokensNeededToUnlock: 3,
        levelToken: 'token3',
        hoursToReset: 16,
        newEnemiesStars: [
            0,       // 0% for 1 star  monster
            50,     // 50% for 2 stars monster
            100,    // 50% for 3 stars monster
            0,      //  0% for 4 stars monster
            0,      //  0% for 5 stars monster
        ],
        opponentMonstersData: [
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 5, stars: 2 },
            { type: 7, stars: 3 }
        ],
        opponentSpells: { // SPELL POINT  46
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    }
]

export const survivalLevelsWorld2 = [
    {
        levelName: 'survival_level_4',
        survival: true,
        mapPosition: [
            { x: 188, y: 249 },
            { x: 219, y: 287 },
            { x: 238, y: 335 },
            { x: 293, y: 378 },
        ],
        rewardPerKill: 50,
        newEnemiesPerRound: 3,
        revealedByLevel: 40,
        totalMonstersCount: 100,
        tokensNeededToUnlock: 3,
        levelToken: 'token4',
        hoursToReset: 20,
        newEnemiesStars: [
            0,       // 0% for 1 star  monster
            0,       // 0% for 2 stars monster
            50,      // 50% for 3 stars monster
            100,     // 50% for 4 stars monster
            0,      //  0% for 5 stars monster
        ],
        opponentMonstersData: [
            { type: 3, stars: 3 },
            { type: 1, stars: 4 },
            { type: 9, stars: 3 },
            { type: 7, stars: 4 }
        ],
        opponentSpells: { // SPELL POINT 64       24
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    {
        levelName: 'survival_level_5',
        survival: true,
        mapPosition: [
            { x: 1031, y: 780 },
            { x: 1052, y: 826 },
            { x: 1098, y: 874 },
            { x: 1163, y: 928 },
        ],
        rewardPerKill: 75,
        newEnemiesPerRound: 3,
        revealedByLevel: 58,
        totalMonstersCount: 100,
        tokensNeededToUnlock: 3,
        levelToken: 'token5',
        hoursToReset: 24,
        newEnemiesStars: [
            0,       // 0% for 1 star  monster
            0,       // 0% for 2 stars monster
            0,      //  0% for 3 stars monster
            50,      // 50% for 4 stars monster
            100,     // 50% for 5 stars monster
        ],
        opponentMonstersData: [
            { type: 2, stars: 5 },
            { type: 6, stars: 4 },
            { type: 8, stars: 5 },
            { type: 5, stars: 4 }
        ]
        ,
        opponentSpells: { // SPELL POINT  77 MAX
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    }
];

// region DEFEAT GIANTS
export const defeat_giants_level_config = [
    // L E V E L   1    -  7x 2-stars player monsters easily win this level
    {
        levelName: 1,
        firstWinReward: 30,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 1, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 1, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 1, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 12
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[0].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   2      
    {
        levelName: 2,
        firstWinReward: 40,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 2, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 1, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 1, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 14
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   3      
    {
        levelName: 3,
        firstWinReward: 50,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 3, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 1, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 1, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 16
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   4      
    {
        levelName: 4,
        firstWinReward: 60,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 5, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 1, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 18
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   5      
    {
        levelName: 5,
        firstWinReward: 70,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 6, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 1, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 2, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 20
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   6      
    {
        levelName: 6,
        firstWinReward: 80,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 7, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 1, isGiant: true },
            { type: 11, stars: 2, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 22
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   7      
    {
        levelName: 7,
        firstWinReward: 90,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 2,
        monstersReward: [
            {
                type: 8, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 2, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 24
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   8      
    {
        levelName: 8,
        firstWinReward: 100,
        gemsReward: 1,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 9, stars: 2
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 2, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 26
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   9      
    {
        levelName: 9,
        firstWinReward: 110,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 1, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 2, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 28
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   10      
    {
        levelName: 10,
        firstWinReward: 120,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 2, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 2, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 3, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 30
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   11      
    {
        levelName: 11,
        firstWinReward: 130,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 3, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 2, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 3, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 32
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   12      
    {
        levelName: 12,
        firstWinReward: 140,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 5, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 2, isGiant: true },
            { type: 11, stars: 3, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 34
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   13      
    {
        levelName: 13,
        firstWinReward: 150,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 3,
        monstersReward: [
            {
                type: 6, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 11, stars: 3, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 36
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   14     
    {
        levelName: 14,
        firstWinReward: 160,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 7, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 38
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   15     
    {
        levelName: 15,
        firstWinReward: 170,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 8, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 40
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   16     
    {
        levelName: 16,
        firstWinReward: 180,
        gemsReward: 2,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 9, stars: 3
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 3, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 42
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   17     
    {
        levelName: 17,
        firstWinReward: 190,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 1, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 3, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 44     14
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   18     
    {
        levelName: 18,
        firstWinReward: 200,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 2, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 3, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 46
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[0].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[0].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   19     
    {
        levelName: 19,
        firstWinReward: 210,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 4,
        monstersReward: [
            {
                type: 3, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 48     16
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   20     
    {
        levelName: 20,
        firstWinReward: 220,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 5,
        monstersReward: [
            {
                type: 5, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 4, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 50     17
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   21     
    {
        levelName: 21,
        firstWinReward: 230,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 5,
        monstersReward: [
            {
                type: 6, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 4, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 52    18
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   22     
    {
        levelName: 22,
        firstWinReward: 240,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 5,
        monstersReward: [
            {
                type: 7, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 5, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 4, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 54   19
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L   23     
    {
        levelName: 23,
        firstWinReward: 250,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 5,
        monstersReward: [
            {
                type: 8, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 5, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 12, stars: 4, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 56   20
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   24     
    {
        levelName: 24,
        firstWinReward: 260,
        gemsReward: 3,
        repeatLevelWinReward: 0,
        keysNeededToUnlock: 5,
        monstersReward: [
            {
                type: 9, stars: 4
            }
        ],
        opponentMonstersData: [
            { type: 11, stars: 5, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 12, stars: 5, isGiant: true },
            { type: 13, stars: 5, isGiant: true },
            { type: 11, stars: 4, isGiant: true },
        ],
        opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 58     21
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
]

//region WORLD 1
// R E G U L A R   M A P   L E V E L S
export const level_config = [
    // L E V E L   1    - monsters: 1 star x 7   2 stars x 0
    {
        levelName: 1,
        firstWinReward: 20,
        repeatLevelWinReward: 5,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1, isGiant: false },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 1 }

        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL = 11
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[0].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   2    - monsters: 1 star x 8   2 stars x 0
    {
        levelName: 2,
        firstWinReward: 24,
        repeatLevelWinReward: 6,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 3, stars: 1 },
            { type: 3, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(2) = 12
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[0].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   3    - monsters: 1 star x 9   2 stars x 0
    {
        levelName: 3,
        firstWinReward: 28,
        repeatLevelWinReward: 7,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(3) = 13
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[0].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   4    - monsters: 1 star x 10   2 stars x 0
    {
        levelName: 4,
        firstWinReward: 32,
        repeatLevelWinReward: 8,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(4) = 14
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   5    - monsters: 1 star x 11   2 stars x 0
    {
        levelName: 5,
        firstWinReward: 36,
        repeatLevelWinReward: 9,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 3, stars: 1 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ], opponentSpells: { // SPELL POINT  10 + LEVEL(5) = 15
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value,
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L   6    - monsters: 1 star x 12   2 stars x 0
    {
        levelName: 6,
        firstWinReward: 40,
        repeatLevelWinReward: 10,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 1, stars: 1 },
            { type: 7, stars: 1 },
            { type: 6, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(6) = 16
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[0].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L   7    - monsters: 1 star x 12   2 stars x 0
    {
        levelName: 7,
        firstWinReward: 44,
        repeatLevelWinReward: 11,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 6, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(7) = 17
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value,
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L   8    - monsters: 1 star x 13   2 stars x 0
    {
        levelName: 8,
        firstWinReward: 48,
        repeatLevelWinReward: 12,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(8) = 18
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  9    - monsters: 1 star x 14   2 stars x 0
    {
        levelName: 9,
        firstWinReward: 52,
        repeatLevelWinReward: 13,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(9) = 19
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  10    - monsters: 1 star x 13   2 stars x 1
    {
        levelName: 10,
        firstWinReward: 56,
        repeatLevelWinReward: 14,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 9, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(10) = 20
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[0].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value,
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  11    - monsters: 1 star x 12   2 stars x 2
    {
        levelName: 11,
        firstWinReward: 60,
        repeatLevelWinReward: 15,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 2 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(11) = 21
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value,
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  12    - monsters: 1 star x 11   2 stars x 3
    {
        levelName: 12,
        firstWinReward: 64,
        repeatLevelWinReward: 16,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 6, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(12) = 22
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value,
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  13    - monsters: 1 star x 10   2 stars x 4
    {
        levelName: 13,
        firstWinReward: 68,
        repeatLevelWinReward: 17,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 2, stars: 2 },
            { type: 3, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(13) = 23
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value,
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  14    - monsters: 1 star x 9   2 stars x 5
    {
        levelName: 14,
        firstWinReward: 72,
        repeatLevelWinReward: 18,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 1 },
            { type: 5, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(14) = 24
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value,
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  15    - monsters: 1 star x 8   2 stars x 6
    {
        levelName: 15,
        firstWinReward: 76,
        repeatLevelWinReward: 19,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 2, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 3, stars: 1 },
            { type: 3, stars: 2 },
            { type: 3, stars: 1 },
            { type: 5, stars: 1 },
            { type: 6, stars: 2 },
            { type: 9, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(15) = 25
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  16    - monsters: 1 star x 7   2 stars x 7
    {
        levelName: 16,
        firstWinReward: 80,
        repeatLevelWinReward: 20,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 7, stars: 1 },
            { type: 6, stars: 2 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(16) = 26
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  17    - monsters: 1 star x 6   2 stars x 8
    {
        levelName: 17,
        firstWinReward: 84,
        repeatLevelWinReward: 21,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 3, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 6, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(17) = 27
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  18    - monsters: 1 star x 5   2 stars x 9
    {
        levelName: 18,
        firstWinReward: 88,
        repeatLevelWinReward: 22,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 1, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 1 },
            { type: 3, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(18) = 28
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  19    - monsters: 1 star x 4   2 stars x 10
    {
        levelName: 19,
        firstWinReward: 92,
        repeatLevelWinReward: 23,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 6, stars: 1 },
            { type: 6, stars: 1 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(19) = 29
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  20    - monsters: 1 star x 3   2 stars x 11
    {
        levelName: 20,
        firstWinReward: 96,
        repeatLevelWinReward: 24,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 6, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(20) = 30
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  21    - monsters: 1 star x 2   2 stars x 12
    {
        levelName: 21,
        firstWinReward: 100,
        repeatLevelWinReward: 25,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 1 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(21) = 31
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            // rainOfArrows: {
            //     cooldown: spellsConfig.rainOfArrows.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.rainOfArrows.damage[0].value,
            //                 targets: spellsConfig.rainOfArrows.targets[0].value
            // },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  22    - monsters: 1 star x 1   2 stars x 13
    {
        levelName: 22,
        firstWinReward: 104,
        repeatLevelWinReward: 26,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(22) = 32
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  23    - monsters: 1 star x 0   2 stars x 14   3 stars x 0
    {
        levelName: 23,
        firstWinReward: 108,
        repeatLevelWinReward: 27,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(23) = 33
            // magicBall: {
            //     cooldown: spellsConfig.magicBall.coolDown[0].value,
            //         cooldownProgress: 0,
            //             damage: spellsConfig.magicBall.damage[0].value,
            //                 targets: spellsConfig.magicBall.targets[0].value
            // },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  24    - monsters: 1 star x 0   2 stars x 13   3 stars x 1
    {
        levelName: 24,
        firstWinReward: 112,
        repeatLevelWinReward: 28,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 3, stars: 2 },
            { type: 3, stars: 2 },
            { type: 6, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(24) = 34
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            // poison: {
            //     cooldown: spellsConfig.poison.coolDown[0].value,
            //     cooldownProgress: 0,
            //     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
            //     targets: spellsConfig.poison.targets[0].value,
            //     duration: spellsConfig.poison.duration[0].value
            // },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            // freeze: {
            //     cooldown: spellsConfig.freeze.coolDown[0].value,
            //         cooldownProgress: 0,
            //             duration: spellsConfig.freeze.duration[0].value,
            //                 targets: spellsConfig.freeze.targets[0].value
            // },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  25    - monsters: 1 star x 0   2 stars x 12   3 stars x 2
    {
        levelName: 25,
        firstWinReward: 116,
        repeatLevelWinReward: 29,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 7, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 }
        ], opponentSpells: { // SPELL POINT  10 + LEVEL(25) = 35
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            // heal: {
            //     cooldown: spellsConfig.heal.coolDown[0].value,
            //     cooldownProgress: 0,
            //     amount: spellsConfig.heal.amount[0].value,
            //     targets: spellsConfig.heal.targets[0].value
            // }
        }
    },
    // L E V E L  26    - monsters: 1 star x 0   2 stars x 11   3 stars x 3
    {
        levelName: 26,
        firstWinReward: 120,
        repeatLevelWinReward: 30,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 3, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 8, stars: 2 },
        ], opponentSpells: { // SPELL POINT  10 + LEVEL(26) = 36
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  27    - monsters: 1 star x 0   2 stars x 10   3 stars x 4
    {
        levelName: 27,
        firstWinReward: 124,
        repeatLevelWinReward: 31,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 1, stars: 3 },
            { type: 3, stars: 2 },
            { type: 3, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(27) = 37
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  28    - monsters: 1 star x 0   2 stars x 9   3 stars x 5
    {
        levelName: 28,
        firstWinReward: 128,
        repeatLevelWinReward: 32,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 6, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(28) = 38
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[0].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  29    - monsters: 1 star x 0   2 stars x 8   3 stars x 6
    {
        levelName: 29,
        firstWinReward: 132,
        repeatLevelWinReward: 33,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 2 },
            { type: 1, stars: 3 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 2 },
            { type: 3, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(29) = 39
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  30    - monsters: 1 star x 0   2 stars x 7   3 stars x 7
    {
        levelName: 30,
        firstWinReward: 136,
        repeatLevelWinReward: 34,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 2 },
            { type: 3, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(30) = 40
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  31    - monsters: 1 star x 0   2 stars x 6   3 stars x 8
    {
        levelName: 31,
        firstWinReward: 140,
        repeatLevelWinReward: 35,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 1, stars: 3 },
            { type: 3, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 6, stars: 2 },
            { type: 6, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(31) = 41
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  32    - monsters: 1 star x 0   2 stars x 5   3 stars x 9
    {
        levelName: 32,
        firstWinReward: 144,
        repeatLevelWinReward: 36,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 6, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(32) = 42
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[0].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  33    - monsters: 1 star x 0   2 stars x 4   3 stars x 10
    {
        levelName: 33,
        firstWinReward: 148,
        repeatLevelWinReward: 37,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 3, stars: 2 },
            { type: 3, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(33) = 43
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[0].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  34    - monsters: 1 star x 0   2 stars x 3   3 stars x 11
    {
        levelName: 34,
        firstWinReward: 152,
        repeatLevelWinReward: 38,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(34) = 44
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  35    - monsters: 1 star x 0   2 stars x 2   3 stars x 12
    {
        levelName: 35,
        firstWinReward: 156,
        repeatLevelWinReward: 39,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 6, stars: 2 },
            { type: 6, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(35) = 45
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[0].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // T R A N S I T I O N   T O   W O R L D   2
    {
        isTransition: true
    },
    // T R A N S I T I O N   T O   W O R L D   1
    {
        isTransition: true,
        isFlipped: true
    },
    //region WORLD 2
    // L E V E L  36     - monsters: 1 star x 0   2 stars x 1   3 stars x 13 
    {
        levelName: 36,
        firstWinReward: 160,
        repeatLevelWinReward: 40,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(36) = 46
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  37     - monsters: 1 star x 0   2 stars x 0   3 stars x 14 
    {
        levelName: 37,
        firstWinReward: 164,
        repeatLevelWinReward: 41,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 1, stars: 3 },
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 6, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(37) = 47
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  38     - monsters: 1 star x 0   2 stars x 0   3 stars x 13   4 stars x 1
    {
        levelName: 38,
        firstWinReward: 168,
        repeatLevelWinReward: 42,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(38) = 48
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  39     - monsters: 1 star x 0   2 stars x 0   3 stars x 12   4 stars x 2
    {
        levelName: 39,
        firstWinReward: 172,
        repeatLevelWinReward: 43,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 6, stars: 4 },
            { type: 6, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 4 },
            { type: 7, stars: 3 },
            { type: 8, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(39) = 49
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  40     - monsters: 1 star x 0   2 stars x 0   3 stars x 11   4 stars x 3
    {
        levelName: 40,
        firstWinReward: 176,
        repeatLevelWinReward: 44,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(40) = 50
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  41     - monsters: 1 star x 0   2 stars x 0   3 stars x 10   4 stars x 4
    {
        levelName: 41,
        firstWinReward: 180,
        repeatLevelWinReward: 45,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 3 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(41) = 51
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  42     - monsters: 1 star x 0   2 stars x 0   3 stars x 9   4 stars x 5
    {
        levelName: 42,
        firstWinReward: 184,
        repeatLevelWinReward: 46,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 3 },
            { type: 1, stars: 4 },
            { type: 3, stars: 3 },
            { type: 3, stars: 3 },
            { type: 5, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 8, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 4 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(42) = 52
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  43     - monsters: 1 star x 0   2 stars x 0   3 stars x 8   4 stars x 6
    {
        levelName: 43,
        firstWinReward: 188,
        repeatLevelWinReward: 47,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 4 },
            { type: 7, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(43) = 53
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[0].value
            }
        }
    },
    // L E V E L  44     - monsters: 1 star x 0   2 stars x 0   3 stars x 7   4 stars x 7
    {
        levelName: 44,
        firstWinReward: 192,
        repeatLevelWinReward: 48,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 3 },
            { type: 3, stars: 4 },
            { type: 3, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 8, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(44) = 54
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[0].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  45     - monsters: 1 star x 0   2 stars x 0   3 stars x 6   4 stars x 8
    {
        levelName: 45,
        firstWinReward: 196,
        repeatLevelWinReward: 49,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(45) = 55
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[0].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[0].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[0].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[0].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  46     - monsters: 1 star x 0   2 stars x 0   3 stars x 5   4 stars x 9
    {
        levelName: 46,
        firstWinReward: 200,
        repeatLevelWinReward: 50,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 8, stars: 3 },
            { type: 8, stars: 4 },
            { type: 9, stars: 3 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(46) = 56
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  47     - monsters: 1 star x 0   2 stars x 0   3 stars x 4   4 stars x 10
    {
        levelName: 47,
        firstWinReward: 204,
        repeatLevelWinReward: 51,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 6, stars: 3 },
            { type: 6, stars: 3 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 4 },
            { type: 9, stars: 3 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(47) = 57
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  48     - monsters: 1 star x 0   2 stars x 0   3 stars x 3   4 stars x 11
    {
        levelName: 48,
        firstWinReward: 208,
        repeatLevelWinReward: 52,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 3 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 7, stars: 3 },
            { type: 7, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(48) = 58
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[0].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  49     - monsters: 1 star x 0   2 stars x 0   3 stars x 2   4 stars x 12
    {
        levelName: 49,
        firstWinReward: 212,
        repeatLevelWinReward: 53,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 3 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 3 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(49) = 59
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[1].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  50     - monsters: 1 star x 0   2 stars x 0   3 stars x 1   4 stars x 13
    {
        levelName: 50,
        firstWinReward: 212,
        repeatLevelWinReward: 53,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 3 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(50) = 60
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  51     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 14
    {
        levelName: 51,
        firstWinReward: 216,
        repeatLevelWinReward: 54,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(51) = 61  
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  52     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 13   5 stars x 1
    {
        levelName: 52,
        firstWinReward: 220,
        repeatLevelWinReward: 55,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 4 },
            { type: 2, stars: 4 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(52) = 62   23
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  53     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 12   5 stars x 2
    {
        levelName: 53,
        firstWinReward: 224,
        repeatLevelWinReward: 56,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 5 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 5 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(53) = 63   
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  54     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 11   5 stars x 3
    {
        levelName: 54,
        firstWinReward: 228,
        repeatLevelWinReward: 57,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 5 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(54) = 64   24
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  55     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 10   5 stars x 4
    {
        levelName: 55,
        firstWinReward: 232,
        repeatLevelWinReward: 58,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 5 },
            { type: 5, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 6, stars: 4 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 5 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(55) = 65  25
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  56     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 9   5 stars x 5
    {
        levelName: 56,
        firstWinReward: 236,
        repeatLevelWinReward: 59,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 1, stars: 4 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 3, stars: 5 },
            { type: 3, stars: 4 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 4 },
            { type: 7, stars: 5 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(56) = 66   25
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[1].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  57     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 8   5 stars x 6
    {
        levelName: 57,
        firstWinReward: 240,
        repeatLevelWinReward: 60,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 4 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 4 },
            { type: 7, stars: 4 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(57) = 67  26
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  58     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 7   5 stars x 7
    {
        levelName: 58,
        firstWinReward: 244,
        repeatLevelWinReward: 61,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 4 },
            { type: 2, stars: 4 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 4 },
            { type: 6, stars: 5 },
            { type: 6, stars: 4 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(58) = 68   26
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  59     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 6   5 stars x 8
    {
        levelName: 59,
        firstWinReward: 248,
        repeatLevelWinReward: 62,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 4 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 4 },
            { type: 8, stars: 4 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(59) = 69   27
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[1].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[1].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  60     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 5   5 stars x 9
    {
        levelName: 60,
        firstWinReward: 252,
        repeatLevelWinReward: 63,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 3, stars: 4 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 4 },
            { type: 6, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 4 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(60) = 70  27
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[1].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[1].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  61     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 4   5 stars x 10
    {
        levelName: 61,
        firstWinReward: 256,
        repeatLevelWinReward: 64,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 4 },
            { type: 5, stars: 4 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 4 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 4 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(61) = 71     28
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[1].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  62     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 3   5 stars x 11
    {
        levelName: 62,
        firstWinReward: 260,
        repeatLevelWinReward: 65,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 4 },
            { type: 3, stars: 4 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 4 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(62) = 72    28
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[1].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  63     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 2   5 stars x 12
    {
        levelName: 63,
        firstWinReward: 264,
        repeatLevelWinReward: 66,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 4 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(63) = 73    29
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[1].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  64     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 1   5 stars x 13
    {
        levelName: 64,
        firstWinReward: 268,
        repeatLevelWinReward: 67,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 4 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(64) = 74  29
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[1].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[1].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  65     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 0   5 stars x 14
    {
        levelName: 65,
        firstWinReward: 272,
        repeatLevelWinReward: 68,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(65) = 75   30
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[1].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  66     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 0   5 stars x 15
    {
        levelName: 66,
        firstWinReward: 276,
        repeatLevelWinReward: 69,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
            { type: 9, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(66) = 76   30
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[1].value
            }
        }
    },
    // L E V E L  67     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 0   5 stars x 16
    {
        levelName: 67,
        firstWinReward: 280,
        repeatLevelWinReward: 70,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(67) = 77    77 IS MAX!
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  68     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 0   5 stars x 17
    {
        levelName: 68,
        firstWinReward: 284,
        repeatLevelWinReward: 71,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(68 = 78    77 IS MAX!
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
    // L E V E L  69     - monsters: 1 star x 0   2 stars x 0   3 stars x 0   4 stars x 0   5 stars x 18
    {
        levelName: 69,
        firstWinReward: 288,
        repeatLevelWinReward: 72,
        mapPosition: {
            x: 0,
            y: 0
        },
        opponentMonstersData: [
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 1, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 2, stars: 5 },
            { type: 3, stars: 5 },
            { type: 3, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 5, stars: 5 },
            { type: 6, stars: 5 },
            { type: 7, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 8, stars: 5 },
            { type: 9, stars: 5 },
        ],
        opponentSpells: { // SPELL POINT  10 + LEVEL(69 = 79    77 IS MAX!
            magicBall: {
                cooldown: spellsConfig.magicBall.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[2].value,
                targets: spellsConfig.magicBall.targets[2].value
            },
            poison: {
                cooldown: spellsConfig.poison.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[1].value, // [1] MAX!!!!
                targets: spellsConfig.poison.targets[2].value,
                duration: spellsConfig.poison.duration[2].value
            },
            rainOfArrows: {
                cooldown: spellsConfig.rainOfArrows.coolDown[2].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[2].value,
                targets: spellsConfig.rainOfArrows.targets[2].value
            },
            freeze: {
                cooldown: spellsConfig.freeze.coolDown[2].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[2].value,
                targets: spellsConfig.freeze.targets[2].value
            },
            heal: {
                cooldown: spellsConfig.heal.coolDown[2].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[2].value,
                targets: spellsConfig.heal.targets[2].value
            }
        }
    },
]

export interface IMagicBall {
    cooldown: number;
    cooldownProgress: number;
    damage: number;
    targets: number;
}

export interface IPoison {
    cooldown: number;
    cooldownProgress: number;
    damage: number;
    targets: number;
    duration: number;
}

export interface IRainOfArrows {
    cooldown: number;
    cooldownProgress: number;
    damage: number;
    targets: number;
}

export interface IFreeze {
    cooldown: number;
    cooldownProgress: number;
    targets: number;
    duration: number;
}

export interface IHeal {
    cooldown: number;
    cooldownProgress: number;
    targets: number;
    amount: number;
}

export interface ISpellsData {
    magicBall: IMagicBall;
    poison: IPoison;
    rainOfArrows: IRainOfArrows;
    freeze: IFreeze;
    heal: IHeal;
}

export interface IOpponentMonstersData {
    type: number;
    stars: number;
}

export interface ILevelConfig {
    levelName?: number | string;
    firstWinReward?: number;
    repeatLevelWinReward?: number;
    opponentMonstersData?: IOpponentMonstersData[];
    survival?: boolean;
    hoursToReset?: number;
    rewardPerKill?: number;
    newEnemiesPerRound?: number;
    revealedByLevel?: number;
    newEnemiesStars?: number[];
    totalMonstersCount?: number;
    isTransition?: boolean;
    isFlipped?: boolean;
    monstersReward?: { type: number, stars: number }[];
    gemsReward?: number;
    levelToken?: string;
    tokensNeededToUnlock?: number;
    opponentSpells: ISpellsData;
}