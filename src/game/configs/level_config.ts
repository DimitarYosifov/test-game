
// L E V E L  1  S U R V I V A L    T E S T
export const survival_level_1_config = {
    levelName: '',
    survival: true,
    mapPosition: {
        x: 0,
        y: 0
    },
    rewardPerKill: 5,
    newEnemiesPerRound: 3,
    revealedByLevel: 10,
    totalMonstersCount: 100,
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
        { type: 9, stars: 1 },
        // { type: 1, stars: 1 },
        // { type: 2, stars: 2 },
        // { type: 2, stars: 1 },
        // { type: 2, stars: 1 },
        // { type: 2, stars: 1 },
        // { type: 5, stars: 1 },
        // { type: 5, stars: 1 },
        // { type: 5, stars: 1 },
        // { type: 5, stars: 1 },
        // { type: 5, stars: 1 },
    ]
}

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
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
        ]
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
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ]
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
            { type: 5, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            // { type: 7, stars: 1 },
            // { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ]
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
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            // { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ]
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
            { type: 1, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            // { type: 9, stars: 1 },
        ]
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
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 1, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ]
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
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
        ]
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
            { type: 2, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ]
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
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
        ]
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
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 9, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 1, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
        ]
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
            { type: 7, stars: 1 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
        ]
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
            { type: 2, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 1, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 2 },
            { type: 9, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
            { type: 9, stars: 1 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 7, stars: 1 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 7, stars: 2 },
            { type: 9, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 1, stars: 1 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 1 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 1 },
            { type: 9, stars: 2 },
            { type: 9, stars: 1 },
        ]
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
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 1 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 1 },
            { type: 5, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 1 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
        ]
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
            { type: 1, stars: 3 },
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 7, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 1, stars: 2 },
            { type: 1, stars: 2 },
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
        ]
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
            { type: 1, stars: 3 },
            { type: 1, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
        ]
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
            { type: 1, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
            { type: 9, stars: 3 },
        ]
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
            { type: 1, stars: 3 },
            { type: 1, stars: 2 },
            { type: 2, stars: 3 },
            { type: 2, stars: 3 },
            { type: 5, stars: 2 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 7, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 9, stars: 2 },
        ]
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
            { type: 2, stars: 3 },
            { type: 5, stars: 3 },
            { type: 5, stars: 3 },
            { type: 7, stars: 2 },
            { type: 7, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ]
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
            { type: 2, stars: 3 },
            { type: 2, stars: 2 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 3 },
            { type: 8, stars: 2 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
            { type: 9, stars: 3 },
        ]
    },
]

export interface IOpponentMonstersData {
    type: number;
    stars: number;
}

export interface ILevelConfig {
    levelName: number | string;
    firstWinReward?: number;
    repeatLevelWinReward?: number;
    opponentMonstersData: IOpponentMonstersData[];
    survival?: boolean;
    rewardPerKill?: number;
    newEnemiesPerRound?: number;
    revealedByLevel?: number;
    newEnemiesStars?: number[];
    totalMonstersCount?: number;
}