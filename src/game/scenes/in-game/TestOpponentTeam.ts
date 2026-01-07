
import { level_config } from "../../configs/level_config";
import { getMonsterDataConfig } from "../../configs/main_config";
import { LOCAL_STORAGE_MANAGER } from "../../LOCAL_STORAGE_MANAGER";
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

        // TODO - opponentMonstersData should be taken from local storage!
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
        console.log(level_config);
        let currentLevel = (LOCAL_STORAGE_MANAGER.get('currentLevel') as number);
        currentLevel = LOCAL_STORAGE_MANAGER.get('currentWorld') === 2 ? currentLevel + 1 : currentLevel - 1;  //TODO check world, it could be 3,4.....
        const survivalLevelData = LOCAL_STORAGE_MANAGER.get('survivalLevelData');
        const opponentMonstersData = survivalLevelData?.opponentMonstersData || level_config[currentLevel].opponentMonstersData;

        let result: IUnitData[] = [];

        opponentMonstersData.forEach((monstersData: IOpponentMonstersData) => {
            let data = getMonsterDataConfig(+monstersData.type, monstersData.stars - 1);

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
