export const main_config = {
    "gridSizeHorizontal": 12,
    "gridSizeVertical": 7,
    "cellSize": 125,
    "gameWidth": 1920,
    "gameHeight": 1080,
    "lineWidth": 6,
    "fullCloudsOpacity": 0.5,// clouds visibility
    "rangedUnitsRange": 2,
    "chanceToGetMonsterOnLevelWin": 10, // 10%
    "playerStartingCoins": 100,
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
            cost: 150,
            monsterLevelOdds: [
                80,  //  80% for 1 star  monster
                95,  //  15% for 2 stars monster
                100, //   5% for 3 stars monster
                0,   //   0% for 4 stars monster
                0,   //   0% for 5 stars monster
            ]
        },
        "goldPack": {
            cost: 500,
            monsterLevelOdds: [
                60,  //   60% for 1 star  monster
                85,  //   25% for 2 stars monster
                99,  //   14% for 3 stars monster
                100, //    1% for 4 stars monster
                0,   //    0% for 5 stars monster
            ]
        }
    }
}


// TODO:
// implement info for monsters showing stats for all 5 stars
// in-game implement drag movement for creatures

