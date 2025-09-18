import { monsters_power_config } from "../../configs/monsters_power_config";
import { IUnitData } from "../Game";

export class TestPlayerTeam {

    static get team() {

        const playerMonstersDataFromStorage: IPlayerMonstersData[] = JSON.parse(localStorage.getItem('playerMonstersData') ?? "null", (key, value) => {
            return key === 'row' && value === null ? NaN : value;
        });
        let playerMonstersData = playerMonstersDataFromStorage ||
            [
                {
                    type: 1, stars: 1, row: NaN, col: 11
                },
                {
                    type: 1, stars: 1, row: NaN, col: 11
                },
                {
                    type: 2, stars: 1, row: NaN, col: 11
                },
                {
                    type: 2, stars: 1, row: NaN, col: 11
                },
                {
                    type: 5, stars: 1, row: NaN, col: 11
                },
                {
                    type: 5, stars: 1, row: NaN, col: 11
                },
                {
                    type: 7, stars: 1, row: NaN, col: 11
                },
                {
                    type: 7, stars: 1, row: NaN, col: 11
                },
                {
                    type: 8, stars: 1, row: NaN, col: 11
                },
                {
                    type: 8, stars: 1, row: NaN, col: 11
                },
                {
                    type: 9, stars: 1, row: NaN, col: 11
                },
                {
                    type: 9, stars: 1, row: NaN, col: 11
                },
                
            ]

        playerMonstersData = playerMonstersData.filter(x => !isNaN(x.row));

        let result: IUnitData[] = [];

        playerMonstersData.forEach((monstersData: IPlayerMonstersData) => {
            let data = { ...(monsters_power_config as any)[monstersData.type][monstersData.stars - 1] };
            data.row = monstersData.row;
            data.col = monstersData.col;
            result.push(data);
        });
        return result;
    }

}

export interface IPlayerMonstersData {
    type: string | number,
    stars: number,
    row: number,
    col: number
}
