
import { monsters_power_config } from "../../configs/monsters_power_config"
import { IUnitData } from "../Game";

export class TestOpponentTeam {

    static get team() {

        // TODO - opponentMonstersData should be taken from localstorage!
        const opponentMonstersData: IOpponentMonstersData[] = [
            {
                type: 5, stars: 1, row: 0, col: 0
            },
            {
                type: 7, stars: 1, row: 1, col: 0
            },
            {
                type: 8, stars: 1, row: 2, col: 0
            },
            {
                type: 7, stars: 1, row: 4, col: 0
            },
            {
                type: 8, stars: 1, row: 6, col: 0
            },

            {
                type: 5, stars: 1, row: 5, col: 1
            },
            {
                type: 7, stars: 1, row: 3, col: 1
            },
            {
                type: 8, stars: 1, row: 1, col: 1
            },
            {
                type: 7, stars: 1, row: 4, col: 1
            },
            {
                type: 8, stars: 1, row: 2, col: 1
            },
        ]
        let result: IUnitData[] = [];

        opponentMonstersData.forEach((monstersData: IOpponentMonstersData) => {
            let data = { ...(monsters_power_config as any)[monstersData.type][monstersData.stars - 1] };
            data.row = monstersData.row;
            data.col = monstersData.col;
            result.push(data);
        });
        return result;
        // {
        //     col: 0, row: 0, melee: 2, ranged: 0, health: 8, shield: 2, vision: 1, stars: 1, type: '5', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 1, melee: 3, ranged: 0, health: 2, shield: 2, vision: 2, stars: 1, type: '7', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 0, melee: 4, ranged: 0, health: 3, shield: 1, vision: 1, stars: 1, type: '5', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 5, melee: 2, ranged: 0, health: 7, shield: 2, vision: 2, stars: 1, type: '8', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 1, row: 5, melee: 4, ranged: 0, health: 2, shield: 2, vision: 1, stars: 1, type: '8', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 6, melee: 2, ranged: 0, health: 4, shield: 1, vision: 1, stars: 1, type: '7', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 3, melee: 2, ranged: 0, health: 6, shield: 2, vision: 2, stars: 1, type: '8', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 1, row: 6, melee: 0, ranged: 3, health: 4, shield: 2, vision: 1, stars: 1, type: '8', moves: 1, movesLeft: 1
        // },
        // {
        //     col: 0, row: 1, melee: 2, ranged: 0, health: 4, shield: 1, vision: 1, stars: 1, type: '5', moves: 1, movesLeft: 1
        // }
        // ]
    }

}

interface IOpponentMonstersData {
    type: string | number,
    stars: number,
    row: number,
    col: number
}
