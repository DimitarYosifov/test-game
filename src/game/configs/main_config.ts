export const main_config = {
    "gridSizeHorizontal": 12,
    "gridSizeVertical": 7,
    "cellSize": 125,
    "gameWidth": 1920,
    "gameHeight": 1080,
    "lineWidth": 6,
    "fullCloudsOpacity": 1,// clouds visibility
    "rangedUnitsRange": 2,
    "chanceToGetMonsterOnLevelWin": 25, // 10%
    "playerStartingCoins": 150,
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
                80,  //  80% for 1 star  monster
                95,  //  15% for 2 stars monster
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
    }
}


// TODO:

// check if level is played when creating outro popup - so player can get "repeat level reward instead" of "first win reward"      - ^HIGH PRIORITY^
// AND NO MONSTERS ON REPEAT LEVEL                                                                                                 - ^HIGH PRIORITY^

//CHECK IF ENEMY MONSTER HAS A CHANCE TO KILL WHEN ATTACKING                                                                       - ^HIGH PRIORITY^
// change player-monster on the map with location image
// implement info for monsters showing stats for all 5 stars
// in-game implement drag movement for creatures
// add loading
// add total power for opponent before level and for the player
// add end turn button - skip all player remaining moves                                                                           - ^HIGH PRIORITY^
// auto select next player monster
// add delete progress button
// add text completed to first level reward when starting level for levels that have been completed
// make common class button(including text) and make all buttons the samee
// if a monster has more than 1 moves - after its move leave it selected if it has more moves
// add text "drag here" to hit rects in card selection
// add text 'opponent's turn' when opponent turn starts
// add fade in out to confirm popup for entering level
// double the dots on the map (now index % 4 and index * 4 should become index % 8 and index * 8)
// add blink tween for the bulbs
// add additional currency for upgrading monsters and add coin icon to the cost in card selection => upgrade section

//BUGS:
//   1:  IN GAME.TS   const range = this.currentlySelectedMonster.unitData.ranged > 0 ? 2 : 1; => this.currentlySelectedMonster IS NULL
//    it was 1 on one!  last move player killed enemy ranged monster with ranged monster!!!    after level 9!
//   2: enemy ranged   monsters shoot 2 distance while being able to sii only 1!!!!

