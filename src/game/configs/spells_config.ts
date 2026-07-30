export const spellsConfig = {
    magicBall: {
        coolDown: [
            { value: 2, cost: 0 }, // cooldown level 0
            { value: 13, cost: 3 }, // cooldown level 1
            { value: 12, cost: 6 }  // cooldown level 2
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
            { value: 2, cost: 0 }, // poison level 0
            { value: 13, cost: 4 }, // poison level 1
            { value: 12, cost: 7 }  // poison level 2
        ],
        targets: [
            { value: 1, cost: 0 },  // poison level 0
            { value: 2, cost: 10 },  // poison level 1
            { value: 3, cost: 20 }  // poison level 2
        ],
        damage: [
            { value: 1, cost: 0 }, // poison level 1
            { value: 2, cost: 7 }, // poison level 2
        ],
        duration: [
            { value: 1, cost: 0 }, // duration level 1
            { value: 2, cost: 7 }, // duration level 2
            { value: 3, cost: 15 } // duration level 3
        ]
    },
    rainOfArrows: {
        coolDown: [
            { value: 4, cost: 0 }, // cooldown level 0
            { value: 9, cost: 2 }, // cooldown level 1
            { value: 8, cost: 4 }  // cooldown level 2
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
            { value: 5, cost: 0 }, // cooldown level 0
            { value: 11, cost: 2 }, // cooldown level 1
            { value: 10, cost: 5 }  // cooldown level 2
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
}