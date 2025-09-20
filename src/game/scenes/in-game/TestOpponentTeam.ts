
import { level_config } from "../../configs/level_config";
import { monsters_power_config } from "../../configs/monsters_power_config"
import { IUnitData } from "../Game";

export class TestOpponentTeam {

    static get team() {

        //randomize start positions of the opponent units
        const rows = 7;
        const cols = 3;
        const totalPositions = rows * cols;

        let numberOfElements = 15;
        numberOfElements = Math.min(numberOfElements, totalPositions);

        const allPositions: number[][] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                allPositions.push([r, c]);
            }
        }

        //shuffle
        for (let i = allPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
        }

        let currentInsertIndex = 0;

        const insertNextElement = (data: any) => {
            if (currentInsertIndex >= numberOfElements) {
                console.log("All elements inserted.");
                return;
            }

            const [row, col] = allPositions[currentInsertIndex];
            data.row = row;
            data.col = col;

            currentInsertIndex++;
        }

        // TODO - opponentMonstersData should be taken from localstorage!
        // const opponentMonstersData: IOpponentMonstersData[] = [
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },

        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },

        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     {
        //         type: Phaser.Math.RND.pick([1, 2, 5, 7, 8, 9]), stars: 1
        //     },
        //     // {
        //     //     type: 1, stars: 1
        //     // },
        // ]

        const currentLevel = JSON.parse(localStorage.getItem('currentLevel') ?? "null")
        const opponentMonstersData = level_config[currentLevel - 1].opponentMonstersData;

        let result: IUnitData[] = [];

        opponentMonstersData.forEach((monstersData: IOpponentMonstersData) => {
            let data = { ...(monsters_power_config as any)[monstersData.type][monstersData.stars - 1] };
            insertNextElement(data);
            result.push(data);
        });
        return result;
    }

}

interface IOpponentMonstersData {
    type: string | number;
    stars: number;
}
