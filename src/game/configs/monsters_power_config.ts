
// moves left limited to 1 - for now! -NOTE - movesLeft SHOULD  ALWAYS equal moves! 

export const monsters_power_config = {
    // monster name - 5
    '5': [
        {  // 1 star
            melee: 0, ranged: 2, health: 4, shield: 0, vision: 2, stars: 1, type: '7', moves: 1, movesLeft: 1
        },
    ],
    '7': [
        { // 1 star
            melee: 3, ranged: 0, health: 5, shield: 1, vision: 1, stars: 1, type: '8', moves: 1, movesLeft: 1
        },
    ],
    '8': [
        { // 1 star
            melee: 2, ranged: 0, health: 6, shield: 0, vision: 1, stars: 1, type: '5', moves: 1, movesLeft: 1
        },
    ],
    '9': [
        { // 1 star
            melee: 2, ranged: 0, health: 3, shield: 0, vision: 1, stars: 1, type: '9', moves: 2, movesLeft: 2
        },
    ],
    '1': [
        { // 1 star
            melee: 1, ranged: 0, health: 4, shield: 0, vision: 3, stars: 1, type: '1', moves: 2, movesLeft: 2
        },
    ]
}