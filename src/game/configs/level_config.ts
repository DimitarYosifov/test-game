export const level_config = [
    // L E V E L   1
    {
        levelName: 1,
        firstWinReward: 20,
        repeatLevelWinReward: 5,
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
            { type: 9, stars: 1 },
        ]
    },
    // L E V E L   2
    {
        levelName: 2,
        firstWinReward: 25,
        repeatLevelWinReward: 7,
        opponentMonstersData: [
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 1, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 7, stars: 1 },
            { type: 8, stars: 1 },
            { type: 9, stars: 1 },
        ]
    }
]

interface IOpponentMonstersData {
    type: number;
    stars: number;
}

export interface ILevelConfig {
    levelName: number;
    firstWinReward: number;
    repeatLevelWinReward: number;
    opponentMonstersData: IOpponentMonstersData[];
}