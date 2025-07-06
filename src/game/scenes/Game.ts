import { Scene } from 'phaser';
import { main_config } from '../configs/main_config';
import { Monsters } from './in-game/Monsters';
import { MovementArrowsContainer } from './in-game/MovementArrowsContainer';
import { Monster } from './in-game/Monster';
import { Cloud } from './in-game/Cloud';

export class Game extends Scene {

    mainGridContainer: Phaser.GameObjects.Container;
    movementArrowsContainer: MovementArrowsContainer;
    cloudsContainer: Phaser.GameObjects.Container;
    private gridLines: Phaser.GameObjects.Graphics;
    private gridDimensions: IGridDimensions;
    currentlySelectedMonster: Monster;

    constructor() {
        super('Game');
    }

    create() {

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.data.list.isPlayerTurn = true;
        this.setGridDimensions();
        this.drawGridLines();
        this.createContainers();
        this.setGridPositions();
        this.setInitialMonsters();

        Monsters.createMonsters(this, this.mainGridContainer, this.gridDimensions);
        this.addClouds();
        this.checkMapVisibility(true);

        this.events.on('monster-died', () => {
            this.checkMapVisibility(false);
        });

        this.events.on('repeat-opponent-move', () => {
            this.getRandomOpponentMonster(true);
        });

        this.events.on('monster-selected', (data: Monster[] | IUnitData[]) => {
            this.resetPreviousSelectedMonsterMoves();
            this.currentlySelectedMonster = data[0] as Monster;
            this.mainGridContainer.bringToTop(this.currentlySelectedMonster);
            this.movementArrowsContainer.createArrows(data[1] as IUnitData);
            const repeatMove = data[2]
            if (repeatMove) {
                this.pauseResumeInteraction(true);//????
            }
        });

        this.events.on('direction-selected', (data: number[]) => {

            const newRow = data[0];
            const newCol = data[1];

            const currentData = this.currentlySelectedMonster.unitData;
            this.data.list.gridPositions[currentData.row][currentData.col].isEmpty = true;
            delete this.data.list.gridPositions[currentData.row][currentData.col].occupiedBy;

            this.movementArrowsContainer.removeArrows();
            this.currentlySelectedMonster.move(newRow, newCol);

            this.data.list.gridPositions[newRow][newCol].isEmpty = false;
            const isPlayerTurn = this.data.list.isPlayerTurn;
            this.data.list.gridPositions[newRow][newCol].occupiedBy = isPlayerTurn ? 'player' : 'opponent';
            this.checkMapVisibility(false);

            if (isPlayerTurn) {
                this.pauseResumeInteraction(false);
            }
        });



        this.events.on('target-selected', (data: number[]) => {

            const newRow = data[0];
            const newCol = data[1];
            const isRanged = data[2];

            this.movementArrowsContainer.removeArrows();
            // this.currentlySelectedMonster.performHit(newRow, newCol);

            const isPlayerTurn = this.data.list.isPlayerTurn;
            const damage = isRanged ? this.currentlySelectedMonster.unitData.ranged : this.currentlySelectedMonster.unitData.melee;
            let target: null | Monster = null;
            if (isPlayerTurn) {
                console.log(this.data.list.opponentMonsters)
                target = this.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
            } else {
                target = this.data.list.playerMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
            }
            const isTargetToTheLeft = target!.unitData.col < this.currentlySelectedMonster.unitData.col;
            this.currentlySelectedMonster.performHit(target, isTargetToTheLeft, () => {
                target!.takeDamege(damage);
            });


            if (isPlayerTurn) {
                this.pauseResumeInteraction(false);
            }
            else {
                //TODO - repeat // ?????????
            }

        });

        this.events.on('check-end-turn', () => {
            if (this.currentlySelectedMonster.unitData.movesLeft > 0) {
                this.currentlySelectedMonster.repeatMove();
            } else {
                this.currentlySelectedMonster.setAlpha(0.7);
                this.checkNextTurn();
            }
        })
        this.addInteraction();
    }

    private resetPreviousSelectedMonsterMoves(): void {
        if (this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.movesLeft === 0) {
            this.currentlySelectedMonster.unitData.movesLeft = this.currentlySelectedMonster.unitData.moves;
        }
    }

    private checkNextTurn(): void {
        let turnEnd = false;
        if (this.data.list.isPlayerTurn) {
            turnEnd = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        } else {
            turnEnd = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        }
        if (turnEnd) {
            alert('end turn');
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            if (this.data.list.isPlayerTurn) {
                this.addInteraction();
            } else {
                this.addInteraction();
                this.getRandomOpponentMonster();
            }
        } else if (this.data.list.isPlayerTurn) {
            this.pauseResumeInteraction(true);
        } else {
            this.getRandomOpponentMonster();
        }
    }

    private setGridDimensions(): void {
        this.gridDimensions = {
            gridSizeHorizontal: main_config.gridSizeHorizontal,
            gridSizeVertical: main_config.gridSizeVertical,
            cellSize: main_config.cellSize,
            totalSizeHorizontal: main_config.cellSize * main_config.gridSizeHorizontal,
            totalSizeVertical: main_config.cellSize * main_config.gridSizeVertical
        }
    }

    private drawGridLines(): void {

        this.gridLines = this.add.graphics();
        this.gridLines.lineStyle(main_config.lineWidth, 0xffffff);

        for (let x = 0; x <= this.gridDimensions.gridSizeHorizontal; x++) {
            this.gridLines.moveTo(x * this.gridDimensions.cellSize, 0);
            this.gridLines.lineTo(x * this.gridDimensions.cellSize, this.gridDimensions.totalSizeVertical);
        }

        for (let y = 0; y <= this.gridDimensions.gridSizeVertical; y++) {
            this.gridLines.moveTo(0, y * this.gridDimensions.cellSize);
            this.gridLines.lineTo(this.gridDimensions.totalSizeHorizontal, y * this.gridDimensions.cellSize);
        }

        this.gridLines.strokePath();
        this.gridLines.setPosition(0, 0);
    }

    private createContainers(): void {

        const sceneWidth = this.cameras.main.width;
        const sceneHeight = this.cameras.main.height;

        const x = sceneWidth / 2 - this.gridDimensions.totalSizeHorizontal / 2;
        const y = sceneHeight / 2 - this.gridDimensions.totalSizeVertical / 2;

        this.mainGridContainer = this.add.container(x, y);
        this.mainGridContainer.add(this.gridLines);

        this.movementArrowsContainer = new MovementArrowsContainer(this, x, y);
        this.cloudsContainer = this.add.container(x, y);
    }

    private setGridPositions(): void {
        const positions = [];
        for (let row = 0; row < this.gridDimensions.gridSizeVertical; row++) {
            let rowPositionsData = [];
            for (let col = 0; col < this.gridDimensions.gridSizeHorizontal; col++) {
                const x = this.gridDimensions.cellSize * col + this.gridDimensions.cellSize / 2;
                const y = this.gridDimensions.cellSize * row + this.gridDimensions.cellSize / 2;
                const isEmpty = true;
                rowPositionsData.push({ x, y, isEmpty });
            }
            positions.push(rowPositionsData);
        }
        this.data.set('gridPositions', positions);
        console.log(this.data.get('gridPositions'))
    }

    private addClouds() {
        const clouds = [];
        for (let row = 0; row < this.gridDimensions.gridSizeVertical; row++) {
            let cloudPositionsData = [];
            for (let col = 0; col < this.gridDimensions.gridSizeHorizontal; col++) {
                const x = this.gridDimensions.cellSize * col + this.gridDimensions.cellSize / 2;
                const y = this.gridDimensions.cellSize * row + this.gridDimensions.cellSize / 2;
                const cloud = new Cloud(this, x, y, row, col);
                this.cloudsContainer.add(cloud);
                cloudPositionsData.push(cloud)
            }
            clouds.push(cloudPositionsData);
            console.log(clouds);
            this.data.set('clouds', clouds);
        }
    }

    private setInitialMonsters(): void {
        this.data.set('playerMonsters', []);
        this.data.set('opponentMonsters', []);
    }

    private addInteraction(): void {
        this.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.setInteraction(this.data.list.isPlayerTurn);
                monster.pendingAction = this.data.list.isPlayerTurn;
            }
        });

        this.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.pendingAction = !this.data.list.isPlayerTurn;
            }
        });
    }

    private pauseResumeInteraction(resume: boolean): void {
        this.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster && monster.pendingAction) {
                monster.setInteraction(resume);
            }
        });
    }

    private getVisibleCells(row: number, col: number, radius: number): { row: number, col: number, occupiedBy: string }[] {
        const visibleCells = [];
        const array = this.data.list.gridPositions;
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const newRow = row + y;
                const newCol = col + x;

                if (
                    newRow >= 0 && newRow < array.length &&
                    newCol >= 0 && newCol < array[0].length
                ) {
                    const occupiedBy = array[newRow][newCol].occupiedBy;
                    visibleCells.push({ row: newRow, col: newCol, occupiedBy });
                }
            }
        }
        return visibleCells;
    }

    checkMapVisibility(showImediatelly: boolean = false) {
        //P L A Y E R   M O V E
        const playerMonsters = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null);
        this.data.list.clouds.forEach((row: Cloud[]) => {
            row.forEach((cloud: Cloud) => {
                if (showImediatelly) {
                    cloud.setAlpha(main_config.fullCloudsOpacity);
                } else {
                    cloud.toggleVisibility(main_config.fullCloudsOpacity);
                }
            });
        });
        playerMonsters.forEach((m: Monster) => {
            const visibleCells = this.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision);
            visibleCells.forEach((cell: { row: number, col: number }) => {
                if (showImediatelly) {
                    this.data.list.clouds[cell.row][cell.col].setAlpha(0);
                } else {
                    this.data.list.clouds[cell.row][cell.col].toggleVisibility(0);
                }
            });
        });
    }

    private getRandomOpponentMonster(repeatMove: boolean = false) {
        const opponentMonsters = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m!.pendingAction);
        if (!repeatMove) {
            const rndMonsterIndex = Phaser.Math.RND.between(0, opponentMonsters.length - 1);
            this.resetPreviousSelectedMonsterMoves();
            this.currentlySelectedMonster = opponentMonsters[rndMonsterIndex];
        }
        this.mainGridContainer.bringToTop(this.currentlySelectedMonster);
        const rows = main_config.gridSizeHorizontal;
        const cols = main_config.gridSizeVertical;

        // get all positions visible to opponent
        const allVisibleCellsToOpponent = Array.from({ length: cols }, () => Array(rows).fill(false));
        this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null).forEach((m: Monster) => {
            const visibleCells = this.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision);
            visibleCells.forEach((cell: { row: number, col: number }) => {
                allVisibleCellsToOpponent[cell.row][cell.col] = true;
            });
        });

        const range = this.currentlySelectedMonster.unitData.ranged > 0 ? 2 : 1;
        let visibleTargetsToCurrentOpponentMonster = this.getVisibleCells(
            this.currentlySelectedMonster.unitData.row,
            this.currentlySelectedMonster.unitData.col,
            range
        );

        // all player monsters in range by current opponent's monster
        visibleTargetsToCurrentOpponentMonster = visibleTargetsToCurrentOpponentMonster.filter(x => x.occupiedBy === 'player');
        if (visibleTargetsToCurrentOpponentMonster.length > 0) {
            //ATTACK
            const targetForOpponentCurrentMonster = this.getRandomTargetForOpponent(visibleTargetsToCurrentOpponentMonster);
            console.log(visibleTargetsToCurrentOpponentMonster)
            console.log(targetForOpponentCurrentMonster)
            const targetData = targetForOpponentCurrentMonster;
            this.events.emit('target-selected', [targetData.row, targetData.col, this.currentlySelectedMonster.unitData.ranged > 0])
        } else {
            if (!this.checkPossibleMove()) {
                this.currentlySelectedMonster.skipMove();
                return;
            }
            const closestMonster = this.findClosestPlayerMonsterToMoveTo(allVisibleCellsToOpponent);
            if (closestMonster) {
                //MOVE TOWARDS CLOSEST PLAYER'S MONSTER VISIBLE BY ANY OPPONENT'S MONSTER 
                const newPosition = this.getMove(closestMonster.unitData);
                this.events.emit('direction-selected', [newPosition.row, newPosition.col]);
            }
            else {
                // MOVE TO RANDOM POSITION
                const newPosition = this.getRandomDirection();
                this.events.emit('direction-selected', [newPosition!.newRow, newPosition!.newCol]);
            }

        }
    }

    private getRandomTargetForOpponent(targets: any): any {
        return targets[Phaser.Math.RND.between(0, targets.length - 1)];
    }

    private findClosestPlayerMonsterToMoveTo(allVisibleCellsToOpponent: any[][]) {
        const x1 = this.currentlySelectedMonster.unitData.col;
        const y1 = this.currentlySelectedMonster.unitData.row;

        let shortestDistance = Infinity;
        let coords = {
            x: -1,
            y: -1
        }

        for (let row = 0; row < main_config.gridSizeVertical; row++) {
            for (let col = 0; col < main_config.gridSizeHorizontal; col++) {
                if (allVisibleCellsToOpponent[row][col] && this.data.list.gridPositions[row][col].occupiedBy === 'player') {
                    const x2 = col;
                    const y2 = row;
                    const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
                    console.log(distance);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        coords.x = col;
                        coords.y = row;
                    }
                }
            }
        }

        console.log(this.data.list.playerMonsters)
        const targetPlayerMonster = this.data.list.playerMonsters.find((m: Monster) => m && m.unitData.row === coords.y && m.unitData.col === coords.x);
        console.log('targetPlayerMonster', targetPlayerMonster)
        return targetPlayerMonster;
    }

    private checkPossibleMove(): boolean {
        let row, col;
        const currentUnitData = this.currentlySelectedMonster.unitData;
        //UP
        row = currentUnitData.row - 1;
        col = currentUnitData.col;
        if (this.isCellEmpty(row, col)) return true;

        //UP RIGHT
        row = currentUnitData.row - 1;
        col = currentUnitData.col + 1;
        if (this.isCellEmpty(row, col)) return true;

        //RIGHT
        row = currentUnitData.row;
        col = currentUnitData.col + 1;
        if (this.isCellEmpty(row, col)) return true;

        //RIGHT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col + 1;
        if (this.isCellEmpty(row, col)) return true;

        //DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col;
        if (this.isCellEmpty(row, col)) return true;

        //LEFT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col - 1;
        if (this.isCellEmpty(row, col)) return true;

        //LEFT
        row = currentUnitData.row;
        col = currentUnitData.col - 1;
        if (this.isCellEmpty(row, col)) return true;

        //UP LEFT
        row = currentUnitData.row - 1;
        col = currentUnitData.col - 1;
        if (this.isCellEmpty(row, col)) return true;
        alert()
        return false;
    }

    private getMove(closestUnitData: IUnitData): { row: number, col: number, weight: number } {
        const currentUnitData = this.currentlySelectedMonster.unitData;

        const addMove = (row: number, col: number) => {
            if (this.isCellEmpty(row, col)) {
                moves.push({
                    row,
                    col,
                    weight: (+(Math.abs(row - closestUnitData.row) < Math.abs(currentUnitData.row - closestUnitData.row)) + +(Math.abs(col - closestUnitData.col) < Math.abs(currentUnitData.col - closestUnitData.col)))
                })
            }
        }
        const moves: { row: number, col: number, weight: number }[] = [];
        let row, col;

        //UP
        row = currentUnitData.row - 1;
        col = currentUnitData.col;
        addMove(row, col);

        //UP RIGHT
        row = currentUnitData.row - 1;
        col = currentUnitData.col + 1;
        addMove(row, col);

        //RIGHT
        row = currentUnitData.row;
        col = currentUnitData.col + 1;
        addMove(row, col);

        //RIGHT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col + 1;
        addMove(row, col);

        //DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col;
        addMove(row, col);

        //LEFT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col - 1;
        addMove(row, col);

        //LEFT
        row = currentUnitData.row;
        col = currentUnitData.col - 1;
        addMove(row, col);

        //UP LEFT
        row = currentUnitData.row - 1;
        col = currentUnitData.col - 1;
        addMove(row, col);

        console.log(moves);
        const maxWeight = Math.max(...moves.map((x) => x.weight));
        const bestMoves = moves.filter(move => move.weight === maxWeight);
        const move = Phaser.Math.RND.pick(bestMoves);
        return move;
    }

    private getRandomDirection(): { newRow: number, newCol: number } | undefined {

        let row = this.currentlySelectedMonster.unitData.row;
        let col = this.currentlySelectedMonster.unitData.col;
        let newRow = NaN, newCol = NaN;

        const check = () => {
            const rnd = Phaser.Math.RND.between(1, 100);
            //RIGHT - 20%
            if (rnd > 80) {
                newRow = row;
                newCol = col + 1;
            }
            //UP RIGHT - 20%
            else if (rnd > 60) {
                newRow = row - 1;
                newCol = col + 1;
            }
            //DOWN RIGHT - 20%
            else if (rnd > 40) {
                newRow = row + 1;
                newCol = col + 1;
            }
            //UP - 15%
            else if (rnd > 25) {
                newRow = row - 1;
                newCol = col;
            }
            //DOWN - 15%
            else if (rnd > 10) {
                newRow = row + 1;
                newCol = col;
            }
            //DOWN LEFT - 3%
            else if (rnd > 7) {
                newRow = row + 1;
                newCol = col - 1;
            }
            //LEFT - 3%
            else if (rnd > 4) {
                newRow = row;
                newCol = col - 1;
            }
            //UP LEFT - 4%
            else {
                newRow = row - 1;
                newCol = col - 1;
            }
            if (!this.isCellEmpty(newRow, newCol)) {
                check();
            }
        }
        check();



        return { newRow, newCol }
    }

    private isCellEmpty(row: number, col: number): boolean {
        return this.data.list.gridPositions[row] !== undefined &&
            this.data.list.gridPositions[row][col] !== undefined &&
            this.data.list.gridPositions[row][col].isEmpty;
    }
}

export interface IGridDimensions {
    gridSizeHorizontal: number;
    gridSizeVertical: number;
    cellSize: number;
    totalSizeHorizontal: number;
    totalSizeVertical: number;
}

export interface IUnitData {
    col: number;
    row: number;
    melee: number;
    ranged: number;
    health: number;
    shield: number;
    vision: number;
    stars: number;
    type: string;
    moves: number;
    movesLeft: number;
}
