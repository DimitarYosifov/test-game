export const spellsConfig = {
    //  for  levels : unlock spell - 3 points  upgrade part of the unlocked path - 2 points
    //  example:opponent has 20 points for certain level:  level config goes:
    // unlock cooldown - 3
    // unlock poison - 3
    // unlock rainOfArrows - 3
    // upgrade magicBall cooldosn twice - 2 x 2
    // upgrade magicBall targets - 2 
    // upgrade poison cooldosn twice - 2 x 2
    // TOTAL 19 POINTS

    magicBall: {
        coolDown: [
            { value: 10, cost: 0 }, // cooldown level 0
            { value: 9, cost: 3 }, // cooldown level 1
            { value: 8, cost: 6 }  // cooldown level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // targets level 0
            { value: 2, cost: 9 },  // targets level 1
            { value: 3, cost: 14 }  // targets level 2
        ],
        damage: [
            { value: 1, cost: 0 }, // damage level 0
            { value: 2, cost: 5 }, // damage level 1
            { value: 3, cost: 10 } // damage level 2
        ]
    },
    poison: {
        coolDown: [
            { value: 10, cost: 0 }, // poison level 0
            { value: 9, cost: 4 }, // poison level 1
            { value: 8, cost: 7 }  // poison level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // poison level 0
            { value: 2, cost: 10 },  // poison level 1
            { value: 3, cost: 20 }  // poison level 2
        ],
        // if a new damage level is added - add it to the spells.ts it is hardcoded there to have 2 levels!!!!!!!!!!!!!!!!
        damage: [
            { value: 1, cost: 0 }, // poison level 0
            { value: 2, cost: 7 }, // poison level 1
        ],
        duration: [
            { value: 1, cost: 0 }, // duration level 1
            { value: 2, cost: 7 }, // duration level 2
            { value: 3, cost: 15 } // duration level 3
        ]
    },
    rainOfArrows: {
        coolDown: [
            { value: 6, cost: 0 }, // cooldown level 0
            { value: 5, cost: 2 }, // cooldown level 1
            { value: 4, cost: 4 }  // cooldown level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // targets level 0
            { value: 2, cost: 3 },  // targets level 1
            { value: 3, cost: 6 }  // targets level 2
        ],
        damage: [
            { value: 1, cost: 0 }, // damage level 0
            { value: 2, cost: 2 }, // damage level 1
            { value: 3, cost: 4 } // damage level 2
        ]
    },
    freeze: {
        coolDown: [
            { value: 8, cost: 0 }, // cooldown level 0
            { value: 7, cost: 2 }, // cooldown level 1
            { value: 6, cost: 5 }  // cooldown level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // targets level 0
            { value: 2, cost: 4 },  // targets level 1
            { value: 3, cost: 8 }  // targets level 2
        ],
        duration: [
            { value: 1, cost: 0 }, // duration level 0
            { value: 2, cost: 2 }, // duration level 1
            { value: 3, cost: 4 } // duration level 2
        ]
    },
    heal: {
        coolDown: [
            { value: 8, cost: 0 }, // cooldown level 0
            { value: 7, cost: 2 }, // cooldown level 1
            { value: 6, cost: 5 }  // cooldown level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // targets level 0
            { value: 2, cost: 4 },  // targets level 1
            { value: 3, cost: 8 }  // targets level 2
        ],
        amount: [
            { value: 1, cost: 0 }, // amount level 0
            { value: 2, cost: 2 }, // amount level 1
            { value: 3, cost: 4 } // amount level 2
        ]
    },
}

// opponentSpells: { // SPELL POINT  10 + (LEVEL X 2) = 11
// magicBall: {
//     cooldown: spellsConfig.magicBall.coolDown[0].value,
//         cooldownProgress: 0,
//             damage: spellsConfig.magicBall.damage[0].value,
//                 targets: spellsConfig.magicBall.targets[0].value
// },
// poison: {
//     cooldown: spellsConfig.poison.coolDown[0].value,
//     cooldownProgress: 0,
//     damage: spellsConfig.poison.damage[0].value, // [1] MAX!!!!
//     targets: spellsConfig.poison.targets[0].value,
//     duration: spellsConfig.poison.duration[0].value
// },
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
// heal: {
//     cooldown: spellsConfig.heal.coolDown[0].value,
//     cooldownProgress: 0,
//     amount: spellsConfig.heal.amount[0].value,
//     targets: spellsConfig.heal.targets[0].value
// }
// }
