
//NOTE - movesLeft SHOULD  ALWAYS equal moves! 

export const monsters_power_config = {
    '1': [
        { // 1 star
            melee: 1, ranged: 0, magic: 0, health: 4, shield: 0, vision: 3, stars: 1, type: '1', moves: 2, movesLeft: 2, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 1, ranged: 0, magic: 0, health: 5, shield: 0, vision: 3, stars: 2, type: '1', moves: 2, movesLeft: 2, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 2, ranged: 0, magic: 0, health: 5, shield: 0, vision: 4, stars: 3, type: '1', moves: 2, movesLeft: 2, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 2, ranged: 0, magic: 0, health: 6, shield: 1, vision: 4, stars: 4, type: '1', moves: 3, movesLeft: 3, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 3, ranged: 0, magic: 0, health: 6, shield: 1, vision: 4, stars: 5, type: '1', moves: 3, movesLeft: 3, upgradeCost: null, sellsFor: 26244
        }
    ],
    '2': [
        { // 1 star
            melee: 0, ranged: 0, magic: 2, health: 4, shield: 0, vision: 1, stars: 1, type: '2', moves: 1, movesLeft: 1, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 0, ranged: 0, magic: 2, health: 4, shield: 1, vision: 1, stars: 2, type: '2', moves: 1, movesLeft: 1, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 0, ranged: 0, magic: 3, health: 5, shield: 1, vision: 1, stars: 3, type: '2', moves: 1, movesLeft: 1, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 0, ranged: 0, magic: 3, health: 6, shield: 1, vision: 1, stars: 4, type: '2', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 0, ranged: 0, magic: 4, health: 6, shield: 2, vision: 1, stars: 5, type: '2', moves: 2, movesLeft: 2, upgradeCost: null, sellsFor: 26244
        }
    ],
    '3': [
        { // 1 star
            melee: 0, ranged: 0, magic: 1, health: 3, shield: 1, vision: 1, stars: 1, type: '3', moves: 1, movesLeft: 1, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 0, ranged: 0, magic: 1, health: 4, shield: 1, vision: 2, stars: 2, type: '3', moves: 1, movesLeft: 1, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 0, ranged: 0, magic: 2, health: 5, shield: 1, vision: 2, stars: 3, type: '3', moves: 1, movesLeft: 1, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 0, ranged: 0, magic: 2, health: 5, shield: 2, vision: 2, stars: 4, type: '3', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 0, ranged: 0, magic: 3, health: 6, shield: 2, vision: 2, stars: 5, type: '3', moves: 2, movesLeft: 2, upgradeCost: null, sellsFor: 26244
        }
    ],
    '5': [
        {  // 1 star
            melee: 2, ranged: 0, magic: 0, health: 5, shield: 0, vision: 2, stars: 1, type: '5', moves: 1, movesLeft: 1, upgradeCost: 36, sellsFor: 4
        },
        {  // 2 stars
            melee: 3, ranged: 0, magic: 0, health: 5, shield: 1, vision: 2, stars: 2, type: '5', moves: 1, movesLeft: 1, upgradeCost: 324, sellsFor: 36
        },
        {  // 3 stars
            melee: 3, ranged: 0, magic: 0, health: 6, shield: 1, vision: 3, stars: 3, type: '5', moves: 1, movesLeft: 1, upgradeCost: 2916, sellsFor: 324
        },
        {  // 4 stars
            melee: 3, ranged: 0, magic: 0, health: 7, shield: 2, vision: 3, stars: 4, type: '5', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        {  // 5 stars
            melee: 4, ranged: 0, magic: 0, health: 7, shield: 2, vision: 3, stars: 5, type: '5', moves: 2, movesLeft: 2, upgradeCost: null, sellsFor: 26244
        }
    ],
    '6': [
        { // 1 star
            melee: 0, ranged: 1, magic: 0, health: 4, shield: 0, vision: 1, stars: 1, type: '6', moves: 2, movesLeft: 2, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 0, ranged: 2, magic: 0, health: 4, shield: 0, vision: 1, stars: 2, type: '6', moves: 2, movesLeft: 2, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 0, ranged: 2, magic: 0, health: 5, shield: 0, vision: 1, stars: 3, type: '6', moves: 2, movesLeft: 2, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 0, ranged: 3, magic: 0, health: 5, shield: 0, vision: 1, stars: 4, type: '6', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 0, ranged: 3, magic: 0, health: 5, shield: 1, vision: 1, stars: 5, type: '6', moves: 3, movesLeft: 3, upgradeCost: null, sellsFor: 26244
        }
    ],
    '7': [
        { // 1 star
            melee: 0, ranged: 2, magic: 0, health: 4, shield: 0, vision: 1, stars: 1, type: '7', moves: 1, movesLeft: 1, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 0, ranged: 2, magic: 0, health: 5, shield: 1, vision: 1, stars: 2, type: '7', moves: 1, movesLeft: 1, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 0, ranged: 3, magic: 0, health: 5, shield: 1, vision: 2, stars: 3, type: '7', moves: 1, movesLeft: 1, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 0, ranged: 3, magic: 0, health: 6, shield: 1, vision: 2, stars: 4, type: '7', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 0, ranged: 4, magic: 0, health: 6, shield: 1, vision: 2, stars: 5, type: '7', moves: 2, movesLeft: 2, upgradeCost: null, sellsFor: 26244
        }
    ],
    '8': [
        { // 1 star
            melee: 3, ranged: 0, magic: 0, health: 6, shield: 1, vision: 1, stars: 1, type: '8', moves: 1, movesLeft: 1, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 3, ranged: 0, magic: 0, health: 7, shield: 1, vision: 1, stars: 2, type: '8', moves: 1, movesLeft: 1, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 4, ranged: 0, magic: 0, health: 7, shield: 2, vision: 1, stars: 3, type: '8', moves: 1, movesLeft: 1, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 4, ranged: 0, magic: 0, health: 8, shield: 2, vision: 1, stars: 4, type: '8', moves: 2, movesLeft: 2, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 5, ranged: 0, magic: 0, health: 8, shield: 3, vision: 1, stars: 5, type: '8', moves: 2, movesLeft: 2, upgradeCost: null, sellsFor: 4
        }
    ],
    '9': [
        { // 1 star
            melee: 2, ranged: 0, magic: 0, health: 3, shield: 0, vision: 1, stars: 1, type: '9', moves: 2, movesLeft: 2, upgradeCost: 36, sellsFor: 4
        },
        { // 2 stars
            melee: 2, ranged: 0, magic: 0, health: 4, shield: 0, vision: 1, stars: 2, type: '9', moves: 2, movesLeft: 2, upgradeCost: 324, sellsFor: 36
        },
        { // 3 stars
            melee: 3, ranged: 0, magic: 0, health: 4, shield: 1, vision: 1, stars: 3, type: '9', moves: 2, movesLeft: 2, upgradeCost: 2916, sellsFor: 324
        },
        { // 4 stars
            melee: 3, ranged: 0, magic: 0, health: 5, shield: 1, vision: 1, stars: 4, type: '9', moves: 3, movesLeft: 3, upgradeCost: 26244, sellsFor: 2916
        },
        { // 5 stars
            melee: 4, ranged: 0, magic: 0, health: 5, shield: 2, vision: 1, stars: 5, type: '9', moves: 3, movesLeft: 3, upgradeCost: null, sellsFor: 26244
        }
    ],
}
