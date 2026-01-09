import { addFullscreenFunctionality, getMonsterDataConfig, getRandomMonsterType, main_config } from '../configs/main_config';
import { Monsters } from './in-game/Monsters';
import { MovementArrowsContainer } from './in-game/MovementArrowsContainer';
import { Monster } from './in-game/Monster';
import { Cloud } from './in-game/Cloud';
import { defeatGiantsLevelConfig, ILevelConfig, level_config } from '../configs/level_config';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { DataHandler } from './in-daily-quest/DataHandler';
import { SpriteAnimation } from './SpriteAnimation';
import { IGameData, LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';

export enum GAME_SCENE_SCENE_EVENTS {
    'TARGET_SELECTED' = 'target-selected',
    'CHECK_END_TURN' = 'check-end-turn',
    'REPEAT_OPPONENT_MOVE' = 'repeat-opponent-move',
    'MONSTER_SELECTED' = 'monster-selected',
    'DIRECTION_SELECTED' = 'direction-selected',
    'MONSTER_DIED' = 'monster-died',
    'DROPPED_PACK_COLLECTED' = 'dropped-pack-collected',
    'DROPPED_GEM_COLLECTED' = 'dropped-gem-collected'
}

export enum BUFF_TYPES {
    'ATTACK' = 'attack',
    'BOW' = 'bow',
    'BALL' = 'ball',
    'HEALTH' = 'health',
    'SHIELD' = 'shield',
    'VISION' = 'vision',
    'GREEN_DOT' = 'green-dot'
}

export class Game extends AbstractScene {

    mainGridContainer: Phaser.GameObjects.Container;
    movementArrowsContainer: MovementArrowsContainer;
    cloudsContainer: Phaser.GameObjects.Container;
    private gridLines: Phaser.GameObjects.Graphics;
    private gridDimensions: IGridDimensions;
    currentlySelectedMonster: Monster;
    skipButton: Button;
    opponentBulb: Phaser.GameObjects.Image;
    playerBulb: Phaser.GameObjects.Image;
    opponentMonstersLeftText: Phaser.GameObjects.Text;
    giveUpButton: Button;
    levelFinished: boolean;
    endTurnButton: Button;
    opponentTurnMsg: Phaser.GameObjects.Text;
    isSurvivalLevel: boolean;
    survivalLevelData: ILevelConfig;
    survivalLevelReward: number;
    survivalLevelRewardText: Phaser.GameObjects.Text;
    survivalLevelRewardImage: Phaser.GameObjects.Image;
    survivalTotalMonstersCount: number | undefined;
    survivalLevelKilledMonsters: number;
    questionMarkContainer: Phaser.GameObjects.Container | null;
    confettiEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
    currentlySelectedMonsterAnimation: SpriteAnimation | null;
    isGiantFightLevel: any;

    constructor() {
        super('Game');
    }

    create(d: any) {
        super.create();

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.data.list.isPlayerTurn = true;

        this.isSurvivalLevel = (this.scene.settings.data as any).isSurvivalLevel;
        this.isGiantFightLevel = d.isGiantFightLevel;
        this.survivalLevelData = LOCAL_STORAGE_MANAGER.get('survivalLevelData');
        this.survivalLevelReward = 0;
        this.survivalLevelKilledMonsters = 0;
        if (this.isSurvivalLevel) {
            this.survivalTotalMonstersCount = this.survivalLevelData.totalMonstersCount;
            this.createSurvivalLevelRewardText();
        }

        this.levelFinished = false;

        this.setGridDimensions();
        this.drawGridLines();
        this.createContainers();
        this.setGridPositions();
        this.setInitialMonsters();

        Monsters.createMonsters(this, this.mainGridContainer, this.gridDimensions, d.isGiantFightLevel);
        this.addClouds();
        this.createBulbs();
        if (!this.isSurvivalLevel) {
            this.createLevelTitle();
        }
        this.createGiveUpButton();
        this.createEndTurnButton();
        this.createOpponentTurnMsg();
        this.addOpponentMonstersLeftText();
        this.checkMapVisibility(true);
        addFullscreenFunctionality(this, 100, 170);


        // event handlers
        this.skipButtonHandler();
        this.monsterDieHandler();
        this.opponentRepeatMoveHandler();
        this.monsterSelectHandler();
        this.directionSelectHandler();
        this.targetSelectHandler();
        // this.checkEndTurnHandler(); // it calls  this.addInteraction // BEING CALLED AFTER INITIAL BUFFS HAVE LANDED

        LOCAL_STORAGE_MANAGER.remove('survivalLevelData');

        this.addBuffs();
        this.time.delayedCall(5000, () => {
            //TODO - fix this magic here - 5000 ms
            this.checkEndTurnHandler();
        })

        this.currentlySelectedMonsterAnimation = new SpriteAnimation(this, 400, 300, 'meterbox', 'meterbox', 'meterbox_win_fx_', true, 15, 0.41, 1.5, 5)
            .pause()
            .hide();

        if (main_config.jumpToOutroPopup) {
            // test debug
            this.createLevelOutroPopup(true)
        }

        this.input.on('pointerdown', (pointer: any) => {
            if (this.data.list.isPlayerTurn && this.currentlySelectedMonster?.bg.getBounds().contains(pointer.x, pointer.y)) {
                console.log(pointer.position.x);
                this.data.list.selectedMonsterDragged = true;
            }
        })


        this.input.on('pointerup', () => {
            this.data.list.selectedMonsterDragged = false;
        })
    }

    private addBuff(row: number, col: number, addQuestionMarks: boolean = true) {
        if (!this.questionMarkContainer && addQuestionMarks) {
            this.addQuestionMarks();
        }
        const randomBuffType = Phaser.Math.RND.pick(Object.values(BUFF_TYPES));//BUFF_TYPES.GREEN_DOT//
        const randomBuffQuantity = main_config.buffs.quality;
        let container = this.add.container(this.data.list.gridPositions[row][col].x + this.mainGridContainer.x, this.data.list.gridPositions[row][col].y + this.mainGridContainer.y);
        container.setDepth(7);
        let plate = this.add.image(0, 0, 'lvl-plate').setOrigin(0.5).setScale(0.75);
        container.add(plate);
        const buffText = this.add.text(
            0,
            -25,
            `+1`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 2,
                align: 'center'
            }).setOrigin(0.5).setName('buffText');
        container.add(buffText);
        let buffTypeImage = this.add.image(0, 25, randomBuffType).setOrigin(0.5).setScale(0.35);
        container.add(buffTypeImage);

        console.log(this.data.list.gridPositions)

        let buffData = (this.data.list.gridPositions[row][col] as any).buff = {
            buffType: randomBuffType,
            quantity: randomBuffQuantity,
            buffContainer: container
        };
    }

    private addBuffs(buffsCount: number = NaN) {

        this.questionMarkContainer = this.add.container().setDepth(13);
        this.addQuestionMarks();

        const totalBuffsCount = isNaN(buffsCount) ? Phaser.Math.Between(main_config.buffs.quantityAtLevelStart.min, main_config.buffs.quantityAtLevelStart.max) : buffsCount;
        let parachutesSoFar = totalBuffsCount - 1;
        for (let index = 0; index < totalBuffsCount; index++) {
            const row = Phaser.Math.Between(0, main_config.gridSizeVertical - 1);
            const col = Phaser.Math.Between(main_config.buffs.buffsStartLevelColumn.min, main_config.buffs.buffsStartLevelColumn.max);

            if (this.data.list.gridPositions[row][col].occupiedBy?.length || this.data.list.gridPositions[row][col].buff) {

                if (!isNaN(buffsCount)) {
                    this.addInteraction();
                }
                //no luck :(  position has a buff or is occupied by monster
                continue;
            } else {

                this.data.list.gridPositions[row][col].buff = true; //??

                this.addParachute(() => {
                    this.addBuff(row, col, false);
                    if (!isNaN(buffsCount) && parachutesSoFar === 0) {
                        this.addInteraction();
                        this.removeQuestionMarks();
                    }
                    parachutesSoFar--;
                });
            }
        }
    }

    private addQuestionMarks() {
        for (let col = main_config.buffs.buffsStartLevelColumn.min; col <= main_config.buffs.buffsStartLevelColumn.max; col++) {
            for (let row = 0; row < main_config.gridSizeVertical; row++) {

                if (this.data.list.gridPositions[row][col].occupiedBy?.length || this.data.list.gridPositions[row][col].buff) {
                    if (this.data.list.clouds[row][col].alpha === 0) {
                        // if a tile is not revealed by the player show question mark, even thou buff can not be on this spot.
                        // otherwise it would be obvious that there is a buff already
                        continue;
                    }
                }

                const x = this.data.list.gridPositions[row][col].x + this.mainGridContainer.x;
                const y = this.data.list.gridPositions[row][col].y + this.mainGridContainer.y

                let questionMark = this.add.image(x, y, 'question-mark').setScale(0.75).setOrigin(0.5).setAlpha(1);
                (this.questionMarkContainer as Phaser.GameObjects.Container).add(questionMark);

                this.tweens.add({
                    targets: questionMark,
                    repeat: 5,
                    yoyo: true,
                    duration: 400,// Phaser.Math.RND.between(350, 450),
                    alpha: 0,
                    ease: 'Sine.easeInOut',
                })
            }
        }
    }

    private removeQuestionMarks() {
        this.questionMarkContainer?.destroy(true);
        this.questionMarkContainer = null;
    }

    private addParachute(onComplete: Function) {

        let parachute = this.add.image(Phaser.Math.RND.between(850, 1070), -100, 'parachute').setScale(1).setOrigin(0.5).setAlpha(1).setDepth(14);
        let duration = Phaser.Math.RND.between(2500, 3500)
        let targetY = Phaser.Math.RND.between(500, 800)


        parachute.angle = 15;
        let tween = this.tweens.add({
            targets: parachute,
            angle: -15,
            duration: 600,
            // ease: 'Cubic.easeInOut',
            yoyo: true,
            repeat: -1
        })
        this.tweens.chain({
            tweens: [
                {
                    targets: parachute,
                    y: targetY,
                    duration,
                    onComplete: () => {
                        tween.remove();
                    }
                },
                {
                    targets: parachute,
                    alpha: 0,
                    duration: 750,
                    onComplete: () => {
                        parachute.destroy(true);
                        onComplete();
                    }
                }
            ]
        })
    }

    private createLevelTitle() {
        const currentLevel = LOCAL_STORAGE_MANAGER.get('currentLevel');
        const levelTitle = this.add.text(
            960,
            50,
            `level ${currentLevel}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 60, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5).setName('level title');
    }

    private createSurvivalLevelRewardText() {
        this.survivalLevelRewardText = this.add.text(
            960,
            50,
            `reward: ${this.survivalLevelReward}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5).setName('survivalLevelRewardText');
        this.survivalLevelRewardImage = this.add.image(this.survivalLevelRewardText.x + this.survivalLevelRewardText.width / 2 + 15, 55, 'coin').setScale(0.35).setOrigin(0, 0.5);
    }

    private updateSurvivalLevelRewardText() {
        this.survivalLevelReward = this.data.list.opponentMonsters.filter((monster: Monster) => monster === null).length * (this.survivalLevelData.rewardPerKill as number);
        this.survivalLevelRewardText.setText(`reward: ${this.survivalLevelReward}`);
        this.survivalLevelRewardImage.setX(this.survivalLevelRewardText.x + this.survivalLevelRewardText.width / 2 + 15);
    }

    private createGiveUpButton() {
        this.giveUpButton = new Button(this, 100, 1000, 'button', 'give\nup', () => {
            this.createLevelOutroPopup();
        }, true)
    }

    private createEndTurnButton() {
        this.endTurnButton = new Button(this, 1810, 500, 'button', 'end\nturn', () => {
            this.endTurnButton.disableInteractive();
            this.data.list.playerMonsters.forEach((m: Monster) => {
                if (m !== null) {
                    while (m.unitData.movesLeft > 0) {
                        m.decreaseMoves();
                    }
                    // m.unitData.movesLeft = 0;
                    m.pendingAction = false;
                }
            });
            this.checkNextTurn(false);
        }, true)
    }

    private createOpponentTurnMsg() {
        this.opponentTurnMsg = this.add.text(
            960,
            540,
            `opponent's turn`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 100, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5).setAlpha(0).setDepth(25);
    }

    private showOpponentTurnMsg() {
        this.opponentTurnMsg.setScale(1.5);
        this.tweens.chain({
            tweens: [
                {
                    targets: this.opponentTurnMsg,
                    alpha: 1,
                    scale: 1,
                    duration: 250,
                    ease: 'Back.easeOut'
                },
                {
                    targets: this.opponentTurnMsg,
                    alpha: 0,
                    delay: 800,
                    scale: 0,
                    duration: 250,
                    ease: 'Back.easeIn'

                }
            ]
        });
    }

    private addOpponentMonstersLeftText() {
        this.opponentMonstersLeftText = this.add.text(
            150,
            50,
            `enemies left: ${this.data.list.opponentMonsters.length}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 50, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
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
        this.skipButton = new Button(this, 1810, 350, 'button', 'skip\nmove', this.onSkip.bind(this), true, 1);
    }

    private onSkip() {
        if (!this.currentlySelectedMonster) {
            return;
        }
        this.skipButton.disableInteractive();
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
                const monsterBounds = (data[0] as Monster).bg.getBounds();
                this.currentlySelectedMonsterAnimation!
                    .moveTo(monsterBounds.x + monsterBounds.width / 2, monsterBounds.y + monsterBounds.height / 2)
                    .show()
                    .resume();

                this.endTurnButton.setInteractive();
                this.skipButton.setInteractive();
                this.giveUpButton.setInteractive();
            } else {
                this.currentlySelectedMonsterAnimation!.hide().pause();
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
        this.skipButton.disableInteractive();
        this.events.on(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, (data: number[]) => {

            if (this.currentlySelectedMonsterAnimation?.animation!.alpha === 1) {
                this.currentlySelectedMonsterAnimation.pause().hide();
            }

            const newRow = data[0];
            const newCol = data[1];

            const currentData = this.currentlySelectedMonster.unitData;
            this.data.list.gridPositions[currentData.row][currentData.col].isEmpty = true;
            delete this.data.list.gridPositions[currentData.row][currentData.col].occupiedBy;
            if (this.currentlySelectedMonster.isGiant) {
                delete this.data.list.gridPositions[currentData.row][currentData.col + 1].occupiedBy;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col].occupiedBy;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col + 1].occupiedBy;
                this.data.list.gridPositions[currentData.row][currentData.col + 1].isEmpty = true;
                this.data.list.gridPositions[currentData.row + 1][currentData.col].isEmpty = true;
                this.data.list.gridPositions[currentData.row + 1][currentData.col + 1].isEmpty = true;

                delete this.data.list.gridPositions[currentData.row][currentData.col].giantData;
                delete this.data.list.gridPositions[currentData.row][currentData.col + 1].giantData;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col].giantData;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col + 1].giantData;
            }

            this.movementArrowsContainer.removeArrows();
            this.currentlySelectedMonster.move(newRow, newCol);

            this.data.list.gridPositions[newRow][newCol].isEmpty = false;
            const isPlayerTurn = this.data.list.isPlayerTurn;
            this.data.list.gridPositions[newRow][newCol].occupiedBy = isPlayerTurn ? 'player' : 'opponent';
            if (this.currentlySelectedMonster.isGiant) {
                this.data.list.gridPositions[newRow][newCol + 1].occupiedBy = 'opponent';
                this.data.list.gridPositions[newRow + 1][newCol].occupiedBy = 'opponent';
                this.data.list.gridPositions[newRow + 1][newCol + 1].occupiedBy = 'opponent';
                this.data.list.gridPositions[newRow][newCol + 1].isEmpty = false;
                this.data.list.gridPositions[newRow + 1][newCol].isEmpty = false;
                this.data.list.gridPositions[newRow + 1][newCol + 1].isEmpty = false;

                this.data.list.gridPositions[newRow][newCol].giantData = { row: newRow, col: newCol };
                this.data.list.gridPositions[newRow][newCol + 1].giantData = { row: newRow, col: newCol };
                this.data.list.gridPositions[newRow + 1][newCol].giantData = { row: newRow, col: newCol };
                this.data.list.gridPositions[newRow + 1][newCol + 1].giantData = { row: newRow, col: newCol };
            }
            this.checkMapVisibility(false);
            console.log(this.data.list.gridPositions);

            if (isPlayerTurn) {
                this.pauseResumeInteraction(false);
            }
        });
    }

    private targetSelectHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, (data: number[]) => {

            if (this.currentlySelectedMonsterAnimation?.animation!.alpha === 1) {
                this.currentlySelectedMonsterAnimation.pause().hide();
            }

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
                const giantData = this.data.list.gridPositions[newRow][newCol].giantData;
                if (giantData) {
                    target = this.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === giantData.row && m.unitData.col === giantData.col);
                } else {
                    target = this.data.list.opponentMonsters.find((m: Monster) => m && m.unitData.row === newRow && m.unitData.col === newCol);
                }
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
        this.events.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: (Monster | IUnitData)[]) => {

            const monster = data[0] as Monster;
            const unitData = data[1];

            if (!monster.isPlayerMonster) {
                DataHandler.checkDataOnMonsterDeath(monster)
            }

            this.updateOpponentMonstersLeft();

            if (this.isSurvivalLevel) {
                this.updateSurvivalLevelRewardText();
            }

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

        let currentLevel = (LOCAL_STORAGE_MANAGER.get('currentLevel') as number);
        const currentWorld = LOCAL_STORAGE_MANAGER.get('currentWorld');
        currentLevel = currentWorld === 2 ? currentLevel + 1 : currentLevel - 1;  //TODO check world, it could be 3,4.....
        console.log(level_config);
        let currentLevelData = null;

        // ---------------- hot hacky fix for playing lvl 36, winning and levelData  = undefined, since it gets the two pseudo levels data between maps
        if (currentLevel !== 37) {
            currentLevelData = level_config[currentLevel];
            // currentLevelData = level_config[currentLevel - 1];
        } else {
            currentLevelData = level_config[37];
        }
        //----------------------------------------------------------------------------------------------------------------------------

        let isFirstTimeReward;
        if (currentLevelData?.levelName) {
            isFirstTimeReward = (LOCAL_STORAGE_MANAGER.get('levelsWon') as any).includes(+(currentLevelData.levelName as number)) === false;
        }

        let rndNum = Phaser.Math.RND.between(1, 100);
        let hasMonsterReweard = !this.isSurvivalLevel && isFirstTimeReward && (rndNum <= main_config.chanceToGetMonsterOnLevelWin);
        let rndNum2 = Phaser.Math.RND.between(1, 100);
        let hasGemReward = !this.isSurvivalLevel && rndNum2 > main_config.chanceToGetGemOnLevelWin;
        let monstersReward = undefined;
        console.log(this.isGiantFightLevel);

        if (this.isGiantFightLevel) {
            const currentDefeatGiantsLevel = LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel')
            currentLevelData = defeatGiantsLevelConfig[currentDefeatGiantsLevel! - 1];
            isFirstTimeReward = true;
            monstersReward = currentLevelData!.monstersReward;
            hasMonsterReweard = monstersReward.length > 0;
            hasGemReward = currentLevelData.gemsReward > 0;
        }


        // UPDATE LEVELS WON(LOCAL STORAGE) -- bug fixed - update only if level won!
        // THERE COULD BE PROBLEMS WHEN CHANGING WORLDS!!!!!!!
        const levelsWon: any = LOCAL_STORAGE_MANAGER.get('levelsWon');
        if (!levelsWon.includes(+(currentLevelData.levelName as number)) && levelWon) {
            levelsWon.push(+(currentLevelData.levelName as number));
            LOCAL_STORAGE_MANAGER.set('levelsWon', levelsWon);
        }

        // bg overlay
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0).setDepth(23 - 0.1);
        this.tweens.add({
            targets: overlay,
            duration: 200,
            alpha: 0.85
        })

        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        this.add.existing(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        //   HEADER
        if (!this.isSurvivalLevel) {

            const msg = levelWon ? 'LEVEL WON' : 'LEVEL LOST';
            const leveltext: Phaser.GameObjects.Text = this.add.text(
                960,
                350,
                msg,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 100, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5).setDepth(23);
        }

        const rewardsContainer = new Phaser.GameObjects.Container(this, 0, 0).setDepth(23 + 0.1);
        this.add.existing(rewardsContainer);

        if (levelWon || this.isSurvivalLevel) {
            // REWARD TEXT
            const rewardtext: Phaser.GameObjects.Text = this.add.text(
                960,
                500,
                'REWARDS: ',
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5).setDepth(23 + 0.1);
            rewardsContainer.add(rewardtext);

            //coin img
            let coin = this.add.image(rewardtext.x + rewardtext.width, 500, 'coin').setOrigin(0, 0.5).setScale(0.5);
            rewardsContainer.add(coin);

            // COIN TEXT
            let coinsWon = isFirstTimeReward ? currentLevelData.firstWinReward : currentLevelData.repeatLevelWinReward;
            if (this.isSurvivalLevel) {
                coinsWon = this.survivalLevelReward;
            } else if (this.isGiantFightLevel) {
                coinsWon = currentLevelData.firstWinReward;
            }
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
            let monsterRewardType = getRandomMonsterType();
            let monsterRewardStars = NaN;
            const randomNumber = Phaser.Math.RND.between(1, 100);
            for (let index = 0; index < odds.length; index++) {
                const odd = odds[index];
                if (randomNumber <= odd) {
                    monsterRewardStars = index + 1;
                    break;
                }
            }

            if (this.isGiantFightLevel) {
                monsterRewardType = (currentLevelData as any).monstersReward[0].type;
                monsterRewardStars = (currentLevelData as any).monstersReward[0].stars;
            }

            if (hasMonsterReweard) {
                //monster card reward
                monsterSize = 150;
                monsterPadding = 40;

                const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, monsterRewardStars - 1);
                const monster = new Monster(this, cointext.x + cointext.displayWidth + monsterSize / 2 + monsterPadding, 500, monsterSize, monsterSize, newMonsterConfig, 0, true)
                monster.starsContainer.x = monsterSize / -4 + 18;
                monster.movesLeftContainer.x = monsterSize / 2 + 21;
                rewardsContainer.add(monster);
            }
            let gem;
            let gemPadding = 0;
            if (hasGemReward) {
                //gem reward
                gemPadding = 20;
                gem = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + gemPadding, 500, 'gem').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(gem);
            }

            //get count
            let gemstext;
            if (this.isGiantFightLevel) {
                gemstext = this.add.text(
                    gem!.x + gem!.displayWidth,
                    500,
                    `x${(currentLevelData as any).gemsReward}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(gemstext);
            }

            //center reward container
            const totalWidth = rewardtext.width + coin.displayWidth + cointext.width + monsterPadding + monsterSize + gemPadding + (gem?.displayWidth || 0) + (gemstext?.displayWidth || 0);
            rewardsContainer.x -= totalWidth / 2;

            // particles
            let emitParticles = true;
            this.startConfettiEmitter();
            this.addLevelWonParticles();
            this.time.addEvent({
                delay: 500,
                loop: true,
                callback: () => {
                    this.addLevelWonParticles();
                },
            });

            // claim button
            const claimButton = new Button(this, 960, 700, 'claim', null, () => {
                emitParticles = false;

                // UPDATE PLAYER GEMS(LOCALE STORAGE) 
                if (hasGemReward) {
                    const playerGems = (LOCAL_STORAGE_MANAGER.get('gems') as number);
                    LOCAL_STORAGE_MANAGER.set('gems', +playerGems + ((currentLevelData as any).gemsReward || 1));
                }

                // UPDATE PLAYER COINS(LOCALE STORAGE) 
                const playerCoins = (LOCAL_STORAGE_MANAGER.get('coins') as number);
                LOCAL_STORAGE_MANAGER.set('coins', +playerCoins + +(coinsWon as number));

                // UPDATE MAP LEVEL( to unlock next level on the map)
                const mapLevel = (LOCAL_STORAGE_MANAGER.get('mapLevel') as number);
                if (((currentLevelData.levelName as number) + 1) > +mapLevel) {
                    LOCAL_STORAGE_MANAGER.set('mapLevel', +mapLevel + 1);
                }

                // UPDATE GIANT LEVEL DATA
                if (this.isGiantFightLevel) {
                    const defeatGiantlevel = (LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel') as number);
                    LOCAL_STORAGE_MANAGER.set('defeatGiantsLevel', defeatGiantlevel + 1);
                    LOCAL_STORAGE_MANAGER.set('defeatGiantsLevelUnlocked', false);
                }

                const playerMonstersCount = (LOCAL_STORAGE_MANAGER.get('playerMonstersData') as []).length;
                if (playerMonstersCount >= main_config.maxMonstersAllowedInDeck) {
                    // leveltext.destroy(true);
                    // rewardsContainer.destroy(true);
                    // overlay.destroy(true);
                    // claimButton.destroy(true);
                    this.monsterNotClaimedPopup();
                } else {
                    if (hasMonsterReweard) {
                        // ADDING NEW MONSTER REWARD TO THE PLAYER DESK(LOCALE STORAGE )
                        this.addNewMonster(monsterRewardType, monsterRewardStars);
                    }
                    this.changeScene('MainMenu');
                }

            }).setDepth(23 + 0.1);
        } else {

            // disable alll after player has given up
            this.data.list.playerMonsters.forEach((m: Monster) => {
                if (m) {
                    m.pendingAction = false;
                    m.disableInteractive();
                    this.movementArrowsContainer.removeArrows();
                }
            });

            // try again button
            const tryAgain = new Button(this, 760, 700, 'button', 'try\nagain', () => {
                this.changeScene('Game');
            }, false).setDepth(23 + 0.1);

            // giveUp button
            const giveUp = new Button(this, 1160, 700, 'button', 'give\nup', () => {
                this.changeScene('MainMenu');
            }).setDepth(23 + 0.1)
        }
    }

    private startConfettiEmitter() {
        ['confetti-blue', 'confetti-red', 'confetti-green', 'confetti-yellow', 'confetti-orange'].forEach(element => {
            let emitter = this.add.particles(0, 0, element, {
                x: { random: [0, 1920] },
                y: -50,
                lifespan: 4000,
                scale: { min: 0.1, max: 0.3 },
                rotate: { min: 0, max: 360 },
                gravityY: 200,
                blendMode: 'ADD',
                frequency: 150,
                advance: 2000
            }).setDepth(23)
            this.confettiEmitters.push(emitter);
        });
    }

    private addLevelWonParticles() {
        // return;
        let emitter = this.add.particles(Phaser.Math.RND.between(400, 1500), Phaser.Math.RND.between(50, 600), 'flare', {
            x: 0,
            y: 0,
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.4, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        }).setDepth(23)
        emitter.explode(55);
        emitter.once('complete', () => {
            emitter.destroy();
            console.log('Emitter destroyed');
        });
    }

    private monsterNotClaimedPopup() {
        const overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0).setDepth(25);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });
        const msg = this.add.text(
            960,
            540,
            `monster not claimed, maximum ${main_config.maxMonstersAllowedInDeck} monsters allowed!`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 55, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4, wordWrap: { width: 700 },
                align: 'center'
            }
        ).setOrigin(0.5).setAlpha(0).setDepth(25);
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
        const storedData = LOCAL_STORAGE_MANAGER.get(STORAGE_KEY);
        const dataArray = storedData ? storedData : [];
        const newObject = { type, stars, row: NaN, col: 11 };
        dataArray.push(newObject);
        LOCAL_STORAGE_MANAGER.set(STORAGE_KEY, dataArray);
    }

    changeScene(nextScene: string): void {
        console.log(this.isSurvivalLevel)
        console.log(this.survivalLevelData)

        //===================RESET SURVIVAL LEVEL 1===========================================
        if (this.isSurvivalLevel) {
            const hoursToReset = this.survivalLevelData.hoursToReset || 0;
            let unlockSurvivalLevel1Time = Date.now() + hoursToReset * 60 * 60 * 1000;
            // this.unlockSurvivalLevel1Time = Date.now() + 1 * 60 * 1000; // 1 minute for testing
            LOCAL_STORAGE_MANAGER.set((`${this.survivalLevelData.levelName}`) as keyof IGameData, unlockSurvivalLevel1Time.toString());
        }
        //====================================================================================

        // this.currentlySelectedMonsterAnimation!.animation!.anims.destroy();
        // this.currentlySelectedMonsterAnimation!.animation!.destroy(true);
        // this.currentlySelectedMonsterAnimation!.animation = null;
        // this.currentlySelectedMonsterAnimation = null;

        Object.values(GAME_SCENE_SCENE_EVENTS).forEach(event => {
            this.events.removeListener(event);
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.confettiEmitters.forEach(element => {
                element.destroy(true);
            });
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

    private checkShouldAddBuffs() {
        return Phaser.Math.RND.between(0, 100) <= main_config.buffs.chanceForBuffAfterRound;
    }

    private checkNextTurn(skipByUser: boolean): void {

        let turnEnd = false;
        if (this.data.list.isPlayerTurn) {
            turnEnd = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        } else {
            turnEnd = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        }
        if (turnEnd) {
            this.endTurnButton.disableInteractive();
            this.skipButton.disableInteractive();
            this.giveUpButton.disableInteractive();

            // alert('end turn');
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            this.changeBulbIndicators(this.data.list.isPlayerTurn);

            if (this.data.list.isPlayerTurn) {
                // this.skipButton.setInteractive().setAlpha(1);
                if (this.checkShouldAddBuffs()) {
                    this.addBuffs(1);
                } else {
                    this.addInteraction();
                }

            } else {
                this.skipButton.disableInteractive();
                this.addInteraction();
                this.getRandomOpponentMonster();
            }
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

        this.mainGridContainer = this.add.container(x, y).setDepth(9);
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
                this.cloudsContainer.add(cloud).setDepth(11);
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
        if (this.questionMarkContainer) {
            this.removeQuestionMarks();
        }

        if (this.data.list.isPlayerTurn) {
            this.data.list.playerMonsters.forEach((monster: Monster) => {
                if (monster) {
                    monster.resetMoves();
                }
            });
        } else {
            // //test
            // this.data.list.opponentMonsters[0].takeDamege(55)
            // return;
            this.skipButton.disableInteractive();
            this.showOpponentTurnMsg();
            if (this.isSurvivalLevel) {
                this.addNewSurvivalLevelMonsters();
            }
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
            this.skipButton.disableInteractive();
            this.endTurnButton.disableInteractive();
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
        else if (resume && this.currentlySelectedMonster.unitData.movesLeft > 0) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this.currentlySelectedMonster, this.currentlySelectedMonster.unitData, false]);
        }
    }

    private addNewSurvivalLevelMonsters() {

        const newMonstersCount = this.survivalLevelData.newEnemiesPerRound || 0;

        for (let index = 0; index < newMonstersCount; index++) {
            const monstersSpawned = this.data.list.opponentMonsters.length;

            if (monstersSpawned === this.survivalTotalMonstersCount) {
                console.log('can not spawn any more monsters');
                break;
            }

            const odds = this.survivalLevelData.newEnemiesStars;
            const monsterRewardType = getRandomMonsterType();
            let monsterRewardStars = NaN;
            const randomNumber = Phaser.Math.RND.between(1, 100);
            for (let oddIndex = 0; oddIndex < odds!.length; oddIndex++) {
                const odd = odds![oddIndex];
                if (randomNumber <= odd) {
                    monsterRewardStars = oddIndex;
                    break;
                }
            }
            let unit = getMonsterDataConfig(+monsterRewardType, monsterRewardStars);

            unit.row = Phaser.Math.RND.between(0, 6);
            unit.col = 0;

            if (this.data.list.gridPositions[unit.row][unit.col].occupiedBy) {
                console.log('new monster not added, cause random position is occupied...');
                continue;
            }

            const gridPosition = this.data.list.gridPositions[unit.row][unit.col];
            gridPosition.isEmpty = false;
            gridPosition.occupiedBy = 'opponent';

            const x = this.gridDimensions.cellSize * unit.col + this.gridDimensions.cellSize / 2;
            const y = this.gridDimensions.cellSize * unit.row + this.gridDimensions.cellSize / 2;
            const width = this.gridDimensions.cellSize - main_config.lineWidth;
            const height = this.gridDimensions.cellSize - main_config.lineWidth;
            const index = this.data.list.opponentMonsters.length;
            const monster = new Monster(this, x, y, width, height, unit, index, false);
            monster.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: IUnitData) => {
                this.data.list.gridPositions[data.row][data.col].isEmpty = true;
                delete this.data.list.gridPositions[data.row][data.col].occupiedBy;
                this.data.list.opponentMonsters[index] = null;
                this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, [monster, data]);
            });

            this.mainGridContainer.add(monster);

            this.data.list.opponentMonsters.push(monster);

        }
        this.updateOpponentMonstersLeft();


        console.log(this.data.list.opponentMonsters)
        console.log(`new survival monsters => ${newMonstersCount}`)
    }

    private autoSelectRandomPlayerMonster() {
        const randomPlayerMonster: Monster = this.data.list.playerMonsters.find((m: Monster) => m !== null && m.pendingAction);
        if (randomPlayerMonster) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [randomPlayerMonster, randomPlayerMonster.unitData, false]);
        }
    }

    private getVisibleCells(row: number, col: number, radius: number, allVisibleCellsToOpponent: boolean[][] = [], isGiant: boolean = false): { row: number, col: number, occupiedBy: string }[] {
        const visibleCells: { row: number, col: number, occupiedBy: string }[] = [];
        const array = this.data.list.gridPositions;

        const getCells = (r: number, c: number) => {
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {
                    const newRow = r + y;
                    const newCol = c + x;

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
        }

        getCells(row, col);
        if (isGiant) {
            getCells(row, col + 1);
            getCells(row + 1, col);
            getCells(row + 1, col + 1);
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
            const visibleCells = this.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision, [], m.unitData.isGiant);
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
            const visibleCells = this.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision, [], m.unitData.isGiant);
            visibleCells.forEach((cell: { row: number, col: number }) => {
                allVisibleCellsToOpponent[cell.row][cell.col] = true;
            });
        });

        const range = this.currentlySelectedMonster.unitData.ranged > 0 ? main_config.rangedUnitsRange : 1;
        let attackableTargetsToCurrentOpponentMonster = this.getVisibleCells(
            this.currentlySelectedMonster.unitData.row,
            this.currentlySelectedMonster.unitData.col,
            range,
            allVisibleCellsToOpponent,
            this.currentlySelectedMonster.unitData.isGiant
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
            console.log(this.data.list.playerMonsters)
            const playerMonster = this.data.list.playerMonsters.find((x: Monster) => x !== null && x.unitData.row === targets[index].row && x.unitData.col === targets[index].col);
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
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //UP RIGHT
        row = currentUnitData.row - 1;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //RIGHT
        row = currentUnitData.row;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //RIGHT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //LEFT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col - 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //LEFT
        row = currentUnitData.row;
        col = currentUnitData.col - 1;

        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1)) || this.isCellEmpty(row, col)) {
            return true;
        }

        //UP LEFT
        row = currentUnitData.row - 1;
        col = currentUnitData.col - 1;

        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col)) || this.isCellEmpty(row, col)) {
            return true;
        }

        return false;
    }

    private getMove(closestUnitData: IUnitData): { row: number, col: number, weight: number } {
        const currentUnitData = this.currentlySelectedMonster.unitData;

        const tryAddMove = (row: number, col: number, skipCheck: boolean = false) => {
            if (this.isCellEmpty(row, col, skipCheck)) {
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
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1)) {
            console.log(`%c GIANT CAN MOVE UP ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //UP RIGHT
        row = currentUnitData.row - 1;
        col = currentUnitData.col + 1;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2)) {
            console.log(`%c GIANT CAN UP RIGHT ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //RIGHT
        row = currentUnitData.row;
        col = currentUnitData.col + 1;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2)) {
            console.log(`%c GIANT CAN RIGHT ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //RIGHT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col + 1;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2)) {
            console.log(`%c GIANT CAN RIGHT DOWN ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1)) {
            console.log(`%c GIANT CAN MOVE DOWN ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //LEFT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col - 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col)) || this.isCellEmpty(row, col)) {
            console.log(`%c GIANT CAN MOVE LEFT DOWN ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //LEFT
        row = currentUnitData.row;
        col = currentUnitData.col - 1;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1)) {
            console.log(`%c GIANT CAN MOVE LEFT ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        //UP LEFT
        row = currentUnitData.row - 1;
        col = currentUnitData.col - 1;
        if (this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col)) {
            console.log(`%c GIANT CAN MOVE UP LEFT ${row} ${col}`, "background: red");
            tryAddMove(row, col, true);
        } else if (!this.currentlySelectedMonster.unitData.isGiant) {
            tryAddMove(row, col);
        }

        console.log(`GIANT MOVED FROM ROW=>${currentUnitData.row}, COL=>${currentUnitData.col}`);
        const maxWeight = Math.max(...moves.map((x) => x.weight));
        const bestMoves = moves.filter(move => move.weight === maxWeight);
        console.log('moves: ', moves);
        console.log('bestMoves: ', bestMoves);
        console.log(this.data.list.gridPositions);
        const move = Phaser.Math.RND.pick(bestMoves);
        return move;
    }

    private getRandomDirection(): { newRow: number, newCol: number } | undefined {

        let row = this.currentlySelectedMonster.unitData.row;
        let col = this.currentlySelectedMonster.unitData.col;
        let newRow = NaN, newCol = NaN;
        let giantMonsterCanMove = false;

        const check = () => {
            const rnd = Phaser.Math.RND.between(1, 100);
            //RIGHT - 20%
            if (rnd > 80) {
                newRow = row;
                newCol = col + 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row, col + 2) && this.isCellEmpty(row + 1, col + 2)
                }
            }
            //UP RIGHT - 20%
            else if (rnd > 60) {
                newRow = row - 1;
                newCol = col + 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row - 1, col + 1) && this.isCellEmpty(row - 1, col + 2) && this.isCellEmpty(row, col + 2)
                }
            }
            //DOWN RIGHT - 20%
            else if (rnd > 40) {
                newRow = row + 1;
                newCol = col + 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row + 2, col + 1) && this.isCellEmpty(row + 2, col + 2) && this.isCellEmpty(row + 1, col + 2)
                }
            }
            //UP - 15%
            else if (rnd > 25) {
                newRow = row - 1;
                newCol = col;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row - 1, col) && this.isCellEmpty(row - 1, col + 1)
                }
            }
            //DOWN - 15%
            else if (rnd > 10) {
                newRow = row + 1;
                newCol = col;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row + 2, col) && this.isCellEmpty(row + 2, col + 1)
                }
            }
            //DOWN LEFT - 3%
            else if (rnd > 7) {
                newRow = row + 1;
                newCol = col - 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row + 1, col - 1) && this.isCellEmpty(row + 2, col - 1) && this.isCellEmpty(row + 2, col)
                }
            }
            //LEFT - 3%
            else if (rnd > 4) {
                newRow = row;
                newCol = col - 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row, col - 1) && this.isCellEmpty(row + 1, col - 1)
                }
            }
            //UP LEFT - 4%
            else {
                newRow = row - 1;
                newCol = col - 1;
                if (this.currentlySelectedMonster.unitData.isGiant) {
                    giantMonsterCanMove = this.isCellEmpty(row, col - 1) && this.isCellEmpty(row - 1, col - 1) && this.isCellEmpty(row - 1, col)
                }
            }

            if ((this.currentlySelectedMonster.unitData.isGiant && !giantMonsterCanMove) || (!this.currentlySelectedMonster.unitData.isGiant && !this.isCellEmpty(newRow, newCol))) {

                check();
            }
        }
        check();
        return { newRow, newCol }
    }

    private isCellEmpty(row: number, col: number, skipCheck: boolean = false): boolean {
        return this.data.list.gridPositions[row] !== undefined &&
            this.data.list.gridPositions[row][col] !== undefined &&
            (skipCheck ? true : this.data.list.gridPositions[row][col].isEmpty);
    }

    createCoins(): void { };
    createBackButton(): void { };
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
    isGiant?: boolean;
}

export interface IBuff {
    buffType: string;
    quantity: number;
    buffContainer: Phaser.GameObjects.Container;
}
