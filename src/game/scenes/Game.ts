import { Scene } from 'phaser';
import { main_config } from '../configs/main_config';
import { Monsters } from './in-game/Monsters';
import { MovementArrowsContainer } from './in-game/MovementArrowsContainer';
import { Monster } from './in-game/Monster';
import { Cloud } from './in-game/Cloud';
import { level_config } from '../configs/level_config';
import { monsters_power_config } from '../configs/monsters_power_config';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';

export enum GAME_SCENE_SCENE_EVENTS {
    'TARGET_SELECTED' = 'target-selected',
    'CHECK_END_TURN' = 'check-end-turn',
    'REPEAT_OPPONENT_MOVE' = 'repeat-opponent-move',
    'MONSTER_SELECTED' = 'monster-selected',
    'DIRECTION_SELECTED' = 'direction-selected',
    'MONSTER_DIED' = 'monster-died'
}

export class Game extends AbstractScene {

    mainGridContainer: Phaser.GameObjects.Container;
    movementArrowsContainer: MovementArrowsContainer;
    cloudsContainer: Phaser.GameObjects.Container;
    private gridLines: Phaser.GameObjects.Graphics;
    private gridDimensions: IGridDimensions;
    currentlySelectedMonster: Monster;
    skipButton: Phaser.GameObjects.Image;
    opponentBulb: Phaser.GameObjects.Image;
    playerBulb: Phaser.GameObjects.Image;
    opponentMonstersLeftText: Phaser.GameObjects.Text;
    giveUpButton: Button;
    levelFinished: boolean;
    endTurnButton: Button;

    constructor() {
        super('Game');
    }

    create() {
        super.create();

        this.levelFinished = false;

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.data.list.isPlayerTurn = true;

        this.setGridDimensions();
        this.drawGridLines();
        this.createContainers();
        this.setGridPositions();
        this.setInitialMonsters();

        Monsters.createMonsters(this, this.mainGridContainer, this.gridDimensions);
        this.addClouds();
        this.createBulbs();
        this.createGiveUpButton();
        this.createEndTurnButton();
        this.addOpponentMonstersLeftText();
        this.checkMapVisibility(true);

        // event handlers
        this.skipButtonHandler();
        this.monsterDieHandler();
        this.opponentRepeatMoveHandler();
        this.monsterSelectHandler();
        this.directionSelectHandler();
        this.targetSelectHandler();
        this.checkEndTurnHandler(); // it calls  this.addInteraction

    }
    private createGiveUpButton() {
        this.giveUpButton = new Button(this, 1810, 1000, 'give-up', () => {
            this.createLevelOutroPopup();
        })
    }

    private createEndTurnButton() {
        this.endTurnButton = new Button(this, 1810, 750, 'button', () => {
            this.endTurnButton.disableInteractive();
            this.data.list.playerMonsters.forEach((m: Monster) => {
                m.pendingAction = false;
            });
            this.checkNextTurn(false);
        })
        const endTurnText = this.add.text(
            this.endTurnButton.x,
            this.endTurnButton.y,
            `END\nTURN`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);
    }

    private addOpponentMonstersLeftText() {
        this.opponentMonstersLeftText = this.add.text(
            150,
            50,
            `enemies left: ${this.data.list.opponentMonsters.length}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);
    }

    private updateOpponentMonstersLeft() {
        this.opponentMonstersLeftText.setText(`enemies left: ${this.data.list.opponentMonsters.filter((x: Monster) => x !== null).length}`);
    }

    private createBulbs() {
        this.playerBulb = this.add.image(1870, 35, 'bulb').setScale(0.7).setOrigin(0.5).setAlpha(1);
        this.opponentBulb = this.add.image(55, 35, 'bulb').setScale(0.7).setOrigin(0.5).setAlpha(0.4);
    }

    private checkEndTurnHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, (skipByUser: boolean = false) => {

            if (this.levelFinished) {
                return;
            }

            if (this.currentlySelectedMonster.unitData.movesLeft > 0) {

                if (this.data.list.isPlayerTurn) {
                    this.currentlySelectedMonster.pendingAction = true;
                    this.checkNextTurn(skipByUser);
                } else {
                    this.currentlySelectedMonster.pendingAction = true;
                    this.checkNextTurn(skipByUser);
                }

            } else {
                this.currentlySelectedMonster.setAlpha(0.7);
                this.checkNextTurn(skipByUser);
            }
        })
        this.addInteraction();
    }

    private skipButtonHandler(): void {
        this.skipButton = new Button(this, 1820, 100, 'skip', this.onSkip.bind(this), true, 0.5);
    }

    private onSkip() {
        if (!this.currentlySelectedMonster) {
            return;
        }
        this.skipButton.disableInteractive().setAlpha(0.6);
        console.log(this.currentlySelectedMonster);

        const hasMoreMoves = this.currentlySelectedMonster.unitData.movesLeft > 0;
        this.currentlySelectedMonster.skipMove(true);

        this.currentlySelectedMonster.setInteraction(hasMoreMoves, hasMoreMoves);
        this.movementArrowsContainer.removeArrows();

        const playerHasMoreMoves = this.data.list.playerMonsters.find((m: Monster) => m && m !== null && m.pendingAction);
        if (playerHasMoreMoves) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this.currentlySelectedMonster, this.currentlySelectedMonster.unitData, false]);
        } else {
            // this.checkNextTurn(false);
        }
    }

    private opponentRepeatMoveHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.REPEAT_OPPONENT_MOVE, () => {
            this.getRandomOpponentMonster(true);
        });
    }

    private monsterSelectHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, (data: Monster[] | IUnitData[]) => {
            if (this.data.list.isPlayerTurn) {
                this.skipButton.setInteractive().setAlpha(1);
            }
            this.resetPreviousSelectedMonsterMoves();
            this.currentlySelectedMonster = data[0] as Monster;
            this.mainGridContainer.bringToTop(this.currentlySelectedMonster);
            this.movementArrowsContainer.createArrows(data[1] as IUnitData);
            const repeatMove = data[2]
            if (repeatMove) {
                this.pauseResumeInteraction(true);//????
            }
        });
    }

    private directionSelectHandler(): void {
        this.skipButton.disableInteractive().setAlpha(0.6);
        this.events.on(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, (data: number[]) => {

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
    }

    private targetSelectHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, (data: number[]) => {

            const newRow = data[0];
            const newCol = data[1];
            const isRanged = data[2];

            this.movementArrowsContainer.removeArrows();

            const isPlayerTurn = this.data.list.isPlayerTurn;

            let damage = 0;
            if (this.currentlySelectedMonster.unitData.ranged > 0) {
                damage = this.currentlySelectedMonster.unitData.ranged;
            } else if (this.currentlySelectedMonster.unitData.magic > 0) {
                damage = this.currentlySelectedMonster.unitData.magic;
            } else {
                damage = this.currentlySelectedMonster.unitData.melee;
            }

            let target: null | Monster = null;
            if (isPlayerTurn) {
                console.log(this.data.list.opponentMonsters)
                target = this.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
            } else {
                target = this.data.list.playerMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
            }
            const isTargetToTheLeft = target!.unitData.col < this.currentlySelectedMonster.unitData.col;
            this.currentlySelectedMonster.performHit(target, isTargetToTheLeft, () => {
                target!.takeDamege(damage, this.currentlySelectedMonster.unitData.magic > 0);
            });


            if (isPlayerTurn) {
                this.pauseResumeInteraction(false);
            }
            else {
                //TODO - repeat // ?????????
            }

        });
    }

    private monsterDieHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, () => {
            this.updateOpponentMonstersLeft();
            if (this.data.list.opponentMonsters.every((m: Monster) => m === null)) {
                // alert('player wins');
                this.levelFinished = true;
                this.createLevelOutroPopup(true);
            } else if (this.data.list.playerMonsters.every((m: Monster) => m === null)) {
                // alert('opponent wins');
                this.createLevelOutroPopup();
            } else {
                this.checkMapVisibility(false);
            }
        });
    }

    private createLevelOutroPopup(levelWon: boolean = false): void {

        const currentLevel = JSON.parse(localStorage.getItem('currentLevel') ?? "null") || '0';
        const currentLevelData = level_config[+currentLevel - 1];
        const isFirstTimeReward = JSON.parse(localStorage.getItem('levelsWon') ?? "[]").includes(+currentLevelData.levelName) === false;

        const rndNum = Phaser.Math.RND.between(1, 100);
        const hasMonsterReweard = isFirstTimeReward && (rndNum <= main_config.chanceToGetMonsterOnLevelWin);

        // bg overlay
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        this.tweens.add({
            targets: overlay,
            duration: 200,
            alpha: 0.85
        })
        this.add.existing(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        //   HEADER
        const msg = levelWon ? 'LEVEL WON' : 'LEVEL LOST';
        const leveltext: Phaser.GameObjects.Text = this.add.text(
            960,
            350,
            msg,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 100, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5);

        const rewardsContainer = new Phaser.GameObjects.Container(this, 0, 0)
        this.add.existing(rewardsContainer);

        if (levelWon) {
            // REWARD TEXT
            const rewardtext: Phaser.GameObjects.Text = this.add.text(
                960,
                500,
                'REWARDS: ',
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            rewardsContainer.add(rewardtext);

            //coin img
            let coin = this.add.image(rewardtext.x + rewardtext.width, 500, 'coin').setOrigin(0, 0.5).setScale(0.5);
            rewardsContainer.add(coin);

            // COIN TEXT
            const coinsWon = isFirstTimeReward ? currentLevelData.firstWinReward : currentLevelData.repeatLevelWinReward;
            const cointext: Phaser.GameObjects.Text = this.add.text(
                coin.x + coin.displayWidth,
                500,
                `x${coinsWon}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            rewardsContainer.add(cointext);

            let monsterSize = 0;
            let monsterPadding = 0;

            //determine monster type and stars !!!!
            //TODO - add more options in config - main_config.afterLevelMonsterReward
            const odds = main_config.afterLevelMonsterReward;
            const monsterRewardType = Number(Phaser.Math.RND.pick(Object.keys(monsters_power_config)));
            let monsterRewardStars = NaN;
            const randomNumber = Phaser.Math.RND.between(1, 100);
            for (let index = 0; index < odds.length; index++) {
                const odd = odds[index];
                if (randomNumber <= odd) {
                    monsterRewardStars = index + 1;
                    break;
                }
            }

            if (hasMonsterReweard) {
                //monster card reward
                monsterSize = 150;
                monsterPadding = 40;

                const newMonsterConfig = { ...(monsters_power_config as any)[monsterRewardType][monsterRewardStars - 1] };
                const monster = new Monster(this, cointext.x + cointext.displayWidth + monsterSize / 2 + monsterPadding, 500, monsterSize, monsterSize, newMonsterConfig, 0, true)
                monster.starsContainer.x = monsterSize / -4 + 18;
                monster.movesLeftContainer.x = monsterSize / 2 + 21;
                rewardsContainer.add(monster);
            }

            //center reward container
            const totalWidth = rewardtext.width + coin.displayWidth + cointext.width + monsterPadding + monsterSize;
            rewardsContainer.x -= totalWidth / 2;
            console.log()

            // claim button
            const claimButton = new Button(this, 960, 700, 'claim', () => {

                // UPDATE PLAYER COINS(LOCALE STORAGE) 
                const playerCoins = localStorage.getItem('coins') || '0';
                localStorage.setItem('coins', JSON.stringify(+playerCoins + +coinsWon));

                // UPDATE MAP LEVEL( to unlock next level on the map)
                const mapLevel = localStorage.getItem('mapLevel') || '1';
                if ((+currentLevel + 1) > +mapLevel) {
                    localStorage.setItem('mapLevel', JSON.stringify(+mapLevel + 1));
                }

                // UPDATE LEVELS WON(LOCAL STORAGE)
                const levelsWon = JSON.parse(localStorage.getItem('levelsWon') || '[]');
                if (!levelsWon.includes(+currentLevelData.levelName)) {
                    levelsWon.push(+currentLevelData.levelName);
                    localStorage.setItem('levelsWon', JSON.stringify(levelsWon));
                }

                const playerMonstersCount = JSON.parse(localStorage.getItem('playerMonstersData') ?? "null").length;
                if (playerMonstersCount >= 40) {
                    leveltext.destroy(true);
                    rewardsContainer.destroy(true);
                    overlay.destroy(true);
                    claimButton.destroy(true);
                    this.monsterNotClaimedPopup();
                } else {
                    // ADDING NEW MONSTER REWARD TO THE PLAYER DESK(LOCALE STORAGE )
                    this.addNewMonster(monsterRewardType, monsterRewardStars);
                    this.changeScene('MainMenu');
                }

            });
        } else {
            // try again button
            const tryAgain = new Button(this, 760, 700, 'try-again', () => {
                this.changeScene('Game');
            }, false, 0.85);

            // giveUp button
            const giveUp = new Button(this, 1160, 700, 'give-up', () => {
                this.changeScene('MainMenu');
            })
        }
    }

    private monsterNotClaimedPopup() {
        const overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
        const msg = this.add.text(
            960,
            540,
            `monster not claimed, maximum 40 monsters allowed!`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, wordWrap: { width: 700 },
                align: 'center'
            }
        ).setOrigin(0.5).setAlpha(0);
        this.tweens.chain({
            tweens: [
                {
                    targets: overlay,
                    duration: 500,
                    alpha: 0.9
                },
                {
                    targets: msg,
                    duration: 350,
                    alpha: 1
                }
            ]
        })
        this.time.delayedCall(4000, () => {
            this.changeScene('MainMenu');
        })
    }

    private addNewMonster(type: number, stars: number) {
        const STORAGE_KEY = 'playerMonstersData';
        const storedData = localStorage.getItem(STORAGE_KEY);
        const dataArray = storedData ? JSON.parse(storedData) : [];
        const newObject = { type, stars, row: NaN, col: 11 };
        dataArray.push(newObject);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
    }

    changeScene(nextScene: string): void {
        Object.values(GAME_SCENE_SCENE_EVENTS).forEach(event => {
            this.events.removeListener(event);
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    private resetPreviousSelectedMonsterMoves(): void {
        if (this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.movesLeft === 0) {
            this.currentlySelectedMonster.unitData.movesLeft = this.currentlySelectedMonster.unitData.moves;
        }
    }

    private changeBulbIndicators(isPlayerTurn: boolean) {
        this.playerBulb.setAlpha(isPlayerTurn ? 1 : 0.4);
        this.opponentBulb.setAlpha(isPlayerTurn ? 0.4 : 1);
    }

    private checkNextTurn(skipByUser: boolean): void {
        let turnEnd = false;
        if (this.data.list.isPlayerTurn) {
            turnEnd = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        } else {
            turnEnd = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        }
        if (turnEnd) {
            // alert('end turn');
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            if (this.data.list.isPlayerTurn) {
                // this.skipButton.setInteractive().setAlpha(1);
                this.addInteraction();
            } else {
                this.skipButton.disableInteractive().setAlpha(0.6);
                this.addInteraction();
                this.getRandomOpponentMonster();
            }
            this.changeBulbIndicators(this.data.list.isPlayerTurn);
        } else if (this.data.list.isPlayerTurn) {
            this.pauseResumeInteraction(true, skipByUser);
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

    // called after every player/opponent moves end
    private addInteraction(): void {

        if (this.data.list.isPlayerTurn) {
            this.data.list.playerMonsters.forEach((monster: Monster) => {
                if (monster) {
                    monster.resetMoves();
                }
            });
        } else {
            this.skipButton.disableInteractive().setAlpha(0.6);
            this.data.list.opponentMonsters.forEach((monster: Monster) => {
                if (monster) {
                    monster.resetMoves();
                }
            });
        }

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

        if (this.data.list.isPlayerTurn) {
            this.endTurnButton.setInteractive();
            this.autoSelectRandomPlayerMonster();
        } else {
            this.endTurnButton.disableInteractive();
        }
    }

    // called after every player action(select direction or attack)and after every player move
    private pauseResumeInteraction(resume: boolean, skipByUser: boolean = false): void {

        if (!resume) {
            this.skipButton.disableInteractive().setAlpha(0.6);
        } else {
            // this.skipButton.setInteractive().setAlpha(1);
        }

        this.data.list.playerMonsters.forEach((monster: Monster, index: number) => {
            if (monster && monster.pendingAction) {
                console.log(index)
                monster.setInteraction(resume, skipByUser);
            }
        });

        if (resume && this.currentlySelectedMonster.unitData.movesLeft === 0) {
            this.autoSelectRandomPlayerMonster();
        }
        // else if (resume && this.currentlySelectedMonster.unitData.movesLeft > 0) {
        //     this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this.currentlySelectedMonster, this.currentlySelectedMonster.unitData, false]);
        // }
    }

    private autoSelectRandomPlayerMonster() {
        const randomPlayerMonster: Monster = this.data.list.playerMonsters.find((m: Monster) => m !== null && m.pendingAction);
        if (randomPlayerMonster) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [randomPlayerMonster, randomPlayerMonster.unitData, false]);
        }
    }

    private getVisibleCells(row: number, col: number, radius: number, allVisibleCellsToOpponent: boolean[][] = []): { row: number, col: number, occupiedBy: string }[] {
        const visibleCells = [];
        const array = this.data.list.gridPositions;
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const newRow = row + y;
                const newCol = col + x;

                if (
                    newRow >= 0 && newRow < array.length
                    && newCol >= 0 && newCol < array[0].length
                ) {

                    if (allVisibleCellsToOpponent.length && !allVisibleCellsToOpponent[newRow][newCol]) {
                        continue;// enemy unreachable by current monster
                    }
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

        const range = this.currentlySelectedMonster.unitData.ranged > 0 ? main_config.rangedUnitsRange : 1;
        let attackableTargetsToCurrentOpponentMonster = this.getVisibleCells(
            this.currentlySelectedMonster.unitData.row,
            this.currentlySelectedMonster.unitData.col,
            range,
            allVisibleCellsToOpponent
        );

        // all player monsters in range by current opponent's monster
        attackableTargetsToCurrentOpponentMonster = attackableTargetsToCurrentOpponentMonster.filter(x => x.occupiedBy === 'player');
        if (attackableTargetsToCurrentOpponentMonster.length > 0) {
            //ATTACK
            const targetForOpponentCurrentMonster = this.getRandomTargetForOpponent(attackableTargetsToCurrentOpponentMonster);
            console.log(attackableTargetsToCurrentOpponentMonster)
            console.log(targetForOpponentCurrentMonster)
            const targetData = targetForOpponentCurrentMonster;
            this.events.emit(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, [targetData.row, targetData.col, this.currentlySelectedMonster.unitData.ranged > 0])
        } else {
            if (!this.checkPossibleMove()) {
                this.currentlySelectedMonster.skipMove();
                return;
            }
            const closestMonster = this.findClosestPlayerMonsterToMoveTo(allVisibleCellsToOpponent);
            if (closestMonster) {
                //MOVE TOWARDS CLOSEST PLAYER'S MONSTER VISIBLE BY ANY OPPONENT'S MONSTER 
                const newPosition = this.getMove(closestMonster.unitData);
                this.events.emit(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, [newPosition.row, newPosition.col]);
            }
            else {
                // MOVE TO RANDOM POSITION
                const newPosition = this.getRandomDirection();
                this.events.emit(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, [newPosition!.newRow, newPosition!.newCol]);
            }

        }
    }

    private getRandomTargetForOpponent(targets: any): any {

        // check if opponent can kill player monster
        for (let index = 0; index < targets.length; index++) {
            const playerMonster = this.data.list.playerMonsters.find((x: Monster) => x.unitData.row === targets[index].row && x.unitData.col === targets[index].col);
            if (this.currentlySelectedMonster.unitData.magic) {
                if (playerMonster.unitData.health - this.currentlySelectedMonster.unitData.magic <= 0) {
                    return targets[index];
                }
            } else if (this.currentlySelectedMonster.unitData.ranged) {
                if (playerMonster.unitData.health + playerMonster.unitData.shield - this.currentlySelectedMonster.unitData.ranged <= 0) {
                    return targets[index];
                }
            } else if (this.currentlySelectedMonster.unitData.melee) {
                if (playerMonster.unitData.health + playerMonster.unitData.shield - this.currentlySelectedMonster.unitData.melee <= 0) {
                    return targets[index];
                }
            }
        }

        // if not attack random
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
    magic: number;
    health: number;
    shield: number;
    vision: number;
    stars: number;
    type: string;
    moves: number;
    movesLeft: number;
    upgradeCost?: number;
    sellsFor?: number;
}
