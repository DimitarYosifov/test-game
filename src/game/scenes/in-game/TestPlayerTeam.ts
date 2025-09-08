import { monsters_power_config } from "../../configs/monsters_power_config";
import { IUnitData } from "../Game";

export class TestPlayerTeam {

    static get team() {
        // TODO - playerMonstersData should be taken from localstorage!
        const playerMonstersData: IPlayerMonstersData[] = [
            {
                type: 5, stars: 1, row: 2, col: 4
            },
            {
                type: 7, stars: 1, row: 2, col: 3
            },
            {
                type: 7, stars: 1, row: 0, col: 11
            },
            {
                type: 7, stars: 1, row: 6, col: 11
            },
            {
                type: 8, stars: 1, row: 2, col: 11
            },
            // {
            //     type: 7, stars: 1, row: 3, col: 11
            // },
            // {
            //     type: 8, stars: 1, row: 4, col: 11
            // },
        ]
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

interface IPlayerMonstersData {
    type: string | number,
    stars: number,
    row: number,
    col: number
}
