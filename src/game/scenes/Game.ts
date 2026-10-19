import { addFullscreenFunctionality, GAME_OBJECT_DEPTHS, getAllMonsterTypes, getMonsterDataConfig, getRandomMonsterType, main_config } from '../configs/main_config';
import { Monsters } from './in-game/Monsters';
import { MovementArrowsContainer } from './in-game/MovementArrowsContainer';
import { Monster } from './in-game/Monster';
import { Cloud } from './in-game/Cloud';
import { defeat_giants_level_config, ILevelConfig, ISpellsData, level_config } from '../configs/level_config';
import { Button } from './in-main-menu/Button';
import { AbstractScene } from './AbstractScene';
import { DataHandler } from './in-daily-quest/DataHandler';
import { SpriteAnimation } from './SpriteAnimation';
import { IGameData, LOCAL_STORAGE_MANAGER } from '../LOCAL_STORAGE_MANAGER';
import { spellsConfig } from '../configs/spells_config';
import { MagicBallSpell } from './in-game/spells/MagicBallSpell';
import { PoisonSpell } from './in-game/spells/PoisonSpell';
import { RainOfArrowsSpell } from './in-game/spells/RainOfArrowsSpell';
import { FreezeSpell } from './in-game/spells/FreezeSpell';
import { HealSpell } from './in-game/spells/HealSpell';
import { GameStateMachine } from './in-game/states/GameStateMachine';
import { LevelIntroState } from './in-game/states/LevelIntroState';

const SPELL_BUTTONS_POPUP_DESCRIPTION = {
    magicBall: "deals {damage} magic damage to {targets} random targets. cooldown - {cooldown}",
    poison: "deals {damage} poison damage to {targets} random targets for {duration} rounds. cooldown - {cooldown}",
    rainOfArrows: "deals {damage} physical damage to {targets} random targets. cooldown - {cooldown}",
    freeze: "freezes {targets} random targets for {duration} rounds. targets can't move or attack. cooldown - {cooldown}",
    heal: "heals {targets} random targets for {amount}. targets can exceed their initial health and also cure if poisoned. cooldown - {cooldown}",
}

export enum GAME_SCENE_SCENE_EVENTS {
    'TARGET_SELECTED' = 'target-selected',
    'CHECK_END_TURN' = 'check-end-turn',
    'REPEAT_OPPONENT_MOVE' = 'repeat-opponent-move',
    'MONSTER_SELECTED' = 'monster-selected',
    'DIRECTION_SELECTED' = 'direction-selected',
    'MONSTER_DIED' = 'monster-died',
    'DROPPED_PACK_COLLECTED' = 'dropped-pack-collected',
    'DROPPED_GEM_COLLECTED' = 'dropped-gem-collected',
    'DROPPED_KEY_COLLECTED' = 'dropped-key-collected',
    'DROPPED_SPELL_POINT_COLLECTED' = 'dropped-spell-point-collected',
    'DROPPED_TOKEN_COLLECTED' = 'dropped-token-collected',
    'BUFF_BOMB_EXPLODE' = 'buff-bomb-explode',
    'ROUND_END' = 'round-end',
    'CHECK_PENDING_RESSURECTION' = 'check-pending-ressurection',
    'PENDING_RESSURECTIONS_COMPLETE' = 'pending-ressurections-complete',
    'END_TURN_PRESSED' = 'end-turn-pressed',
    'SKIP_PRESSED' = 'skip-pressed',
    'GIVE_UP_PRESSED' = 'give-up-pressed'
}

export enum BUFF_TYPES {
    'ATTACK' = 'attack',
    'BOW' = 'bow',
    'BALL' = 'ball',
    'HEALTH' = 'health',
    'SHIELD' = 'shield',
    'VISION' = 'vision',
    'GREEN_DOT' = 'green-dot',
    'BOMB' = 'bomb'
}

export interface IGridDimensions {
    gridSizeHorizontal: number;
    gridSizeVertical: number;
    cellSize: number;
    totalSizeHorizontal: number;
    totalSizeVertical: number;
}

export interface IUnitData {
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
    upgradeCost: number | null;
    sellsFor: number | null;
    isGiant?: boolean;
    immuneTo: string[];
    row?: number;
    col?: number;
}

export interface IBuff {
    buffType: BUFF_TYPES;
    quantity: number;
    buffContainer: Phaser.GameObjects.Container;
}

export class Game extends AbstractScene {

    // ── State machine ──────────────────────────────────────────────────────────
    stateMachine: GameStateMachine;

    // ── Scene objects ──────────────────────────────────────────────────────────
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
    spellCastInProgress: boolean = false;
    activeExplodePositions: number = 0;

    playerMagicBallButton: Button;
    opponentMagicBallButton: Button;
    playerPoisonButton: Button;
    opponentPoisonButton: Button;
    playerRainOfArrowsButton: Button;
    opponentRainOfArrowsButton: Button;
    playerFreezeButton: Button;
    opponentFreezeButton: Button;
    playerHealButton: Button;
    opponentHealButton: Button;

    opponentSpellsData: ISpellsData;
    playerSpellsData: ISpellsData;
    pendingRessurections: Monster[] = [];

    constructor() {
        super('Game');
    }

    create(d: any) {
        super.create();

        this.playerSpellsData = null;
        this.opponentSpellsData = null;
        this.playerMagicBallButton = null;
        this.playerPoisonButton = null;

        this.add.image(0, 0, 'bg').setOrigin(0);
        this.data.list.isPlayerTurn = true;

        this.isSurvivalLevel = (this.scene.settings.data as any).isSurvivalLevel;
        this.isGiantFightLevel = d.isGiantFightLevel;
        this.opponentSpellsData = structuredClone(d.opponentSpellsData);
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
        if (!this.isSurvivalLevel) {
            this.createLevelTitle();
        }

        this.createGiveUpButton();
        this.createEndTurnButton();
        this.skipButtonHandler();
        this.createOpponentTurnMsg();
        this.addOpponentMonstersLeftText();
        this.createSpellButtons();

        this.checkMapVisibility(true);
        addFullscreenFunctionality(this, 100, 80);

        // handlers that are always needed regardless of state
        this.monsterDieHandler();
        this.pendingRessurectionHandler();

        LOCAL_STORAGE_MANAGER.remove('survivalLevelData');

        this.currentlySelectedMonsterAnimation = new SpriteAnimation(
            this, 400, 300, 'meterbox', 'meterbox', 'meterbox_win_fx_', true, 15, 0.41, 1.5, 5
        ).pause().hide();

        if (main_config.jumpToOutroPopup) {
            this.createLevelOutroPopup(true);
            return;
        }

        this.input.on('pointerdown', (pointer: any) => {
            if (this.data.list.isPlayerTurn && this.currentlySelectedMonster?.bg.getBounds().contains(pointer.x, pointer.y)) {
                this.data.list.selectedMonsterDragged = true;
            }
        });
        this.input.on('pointerup', () => {
            this.data.list.selectedMonsterDragged = false;
        });

        // ── Boot the state machine ─────────────────────────────────────────────
        this.stateMachine = new GameStateMachine(this);
        this.stateMachine.setState(new LevelIntroState());
    }

    // ── Methods called by states (must be public) ──────────────────────────────

    addParachute(onComplete: Function): void {
        let parachute = this.add.image(
            Phaser.Math.RND.between(850, 1070), -100, 'parachute'
        ).setScale(1).setOrigin(0.5).setAlpha(1).setDepth(GAME_OBJECT_DEPTHS.gameSceneParachute);

        let duration = Phaser.Math.RND.between(2500, 3500);
        let targetY = Phaser.Math.RND.between(500, 800);

        parachute.angle = 15;
        let swayTween = this.tweens.add({
            targets: parachute,
            angle: -15,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        this.tweens.chain({
            tweens: [
                {
                    targets: parachute,
                    y: targetY,
                    duration,
                    onComplete: () => { swayTween.remove(); }
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
        });
    }

    addBuff(row: number, col: number, addQuestionMarks: boolean = true): void {
        if (!this.questionMarkContainer && addQuestionMarks) {
            this.addQuestionMarks();
        }
        const randomBuffType = Phaser.Math.RND.pick(Object.values(BUFF_TYPES));
        const randomBuffQuantity = main_config.buffs.quality;

        let container = this.add.container(
            this.data.list.gridPositions[row][col].x + this.mainGridContainer.x,
            this.data.list.gridPositions[row][col].y + this.mainGridContainer.y
        );
        container.setDepth(GAME_OBJECT_DEPTHS.gameSceneBuffContainer);

        let plate = this.add.image(0, 0, 'lvl-plate').setOrigin(0.5).setScale(0.75);
        container.add(plate);

        const buffText = this.add.text(0, -25, `+1`, {
            fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
            fontSize: 40, color: '#ffffff', stroke: '#000000', letterSpacing: 4,
            strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setName('buffText');
        container.add(buffText);

        let buffTypeImage = this.add.image(0, 25, randomBuffType).setOrigin(0.5).setScale(0.35);
        container.add(buffTypeImage);

        if (randomBuffType === 'bomb') {
            plate.destroy(true);
            buffText.destroy(true);
            buffTypeImage.setY(10).setScale(0.2);
        }

        (this.data.list.gridPositions[row][col] as any).buff = {
            buffType: randomBuffType,
            quantity: randomBuffQuantity,
            buffContainer: container
        };
    }

    addQuestionMarks(): void {
        if (!this.questionMarkContainer) return;
        for (let col = main_config.buffs.buffsStartLevelColumn.min; col <= main_config.buffs.buffsStartLevelColumn.max; col++) {
            for (let row = 0; row < main_config.gridSizeVertical; row++) {
                if (
                    this.data.list.gridPositions[row][col].occupiedBy?.length ||
                    this.data.list.gridPositions[row][col].buff
                ) {
                    if (this.data.list.clouds[row][col].alpha === 0) {
                        continue;
                    }
                }
                const x = this.data.list.gridPositions[row][col].x + this.mainGridContainer.x;
                const y = this.data.list.gridPositions[row][col].y + this.mainGridContainer.y;
                let questionMark = this.add.image(x, y, 'question-mark').setScale(0.75).setOrigin(0.5).setAlpha(1);
                (this.questionMarkContainer as Phaser.GameObjects.Container).add(questionMark);
                this.tweens.add({
                    targets: questionMark,
                    repeat: 5,
                    yoyo: true,
                    duration: 400,
                    alpha: 0,
                    ease: 'Sine.easeInOut',
                });
            }
        }
    }

    removeQuestionMarks(): void {
        this.questionMarkContainer?.destroy(true);
        this.questionMarkContainer = null;
    }

    updatePlayerSpellButtonsInteraction(forceDisable: boolean = false): void {
        if (this.data.list.isPlayerTurn) {
            if (this.playerMagicBallButton) {
                if (this.playerMagicBallButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerMagicBallButton.setInteractive();
                } else {
                    this.playerMagicBallButton.disableInteractive();
                }
                this.playerMagicBallButton.setAlpha(this.playerMagicBallButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerPoisonButton) {
                if (this.playerPoisonButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerPoisonButton.setInteractive();
                } else {
                    this.playerPoisonButton.disableInteractive();
                }
                this.playerPoisonButton.setAlpha(this.playerPoisonButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerRainOfArrowsButton) {
                if (this.playerRainOfArrowsButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerRainOfArrowsButton.setInteractive();
                } else {
                    this.playerRainOfArrowsButton.disableInteractive();
                }
                this.playerRainOfArrowsButton.setAlpha(this.playerRainOfArrowsButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerFreezeButton) {
                if (this.playerFreezeButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerFreezeButton.setInteractive();
                } else {
                    this.playerFreezeButton.disableInteractive();
                }
                this.playerFreezeButton.setAlpha(this.playerFreezeButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerHealButton) {
                if (this.playerHealButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerHealButton.setInteractive();
                } else {
                    this.playerHealButton.disableInteractive();
                }
                this.playerHealButton.setAlpha(this.playerHealButton.usedCurrentRound ? 0.45 : 1);
            }
        } else {
            if (this.playerMagicBallButton) {
                this.playerMagicBallButton.disableInteractive();
                this.playerMagicBallButton.setAlpha(this.playerMagicBallButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerPoisonButton) {
                this.playerPoisonButton.disableInteractive();
                this.playerPoisonButton.setAlpha(this.playerPoisonButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerRainOfArrowsButton) {
                this.playerRainOfArrowsButton.disableInteractive();
                this.playerRainOfArrowsButton.setAlpha(this.playerRainOfArrowsButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerFreezeButton) {
                this.playerFreezeButton.disableInteractive();
                this.playerFreezeButton.setAlpha(this.playerFreezeButton.usedCurrentRound ? 0.45 : 1);
            }
            if (this.playerHealButton) {
                this.playerHealButton.disableInteractive();
                this.playerHealButton.setAlpha(this.playerHealButton.usedCurrentRound ? 0.45 : 1);
            }
        }
    }

    checkMapVisibility(showImediatelly: boolean = false): void {
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

    // ── Private helpers ────────────────────────────────────────────────────────

    private setGridDimensions(): void {
        this.gridDimensions = {
            gridSizeHorizontal: main_config.gridSizeHorizontal,
            gridSizeVertical: main_config.gridSizeVertical,
            cellSize: main_config.cellSize,
            totalSizeHorizontal: main_config.cellSize * main_config.gridSizeHorizontal,
            totalSizeVertical: main_config.cellSize * main_config.gridSizeVertical
        };
    }

    private drawGridLines(): void {
        this.gridLines = this.add.graphics();
        this.gridLines.lineStyle(main_config.lineWidth, 0xffffff, 0.3);
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
        this.mainGridContainer = this.add.container(x, y).setDepth(GAME_OBJECT_DEPTHS.gameSceneMainGridContainer);
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
                rowPositionsData.push({ x, y, isEmpty: true });
            }
            positions.push(rowPositionsData);
        }
        this.data.set('gridPositions', positions);
    }

    private addClouds(): void {
        const clouds = [];
        for (let row = 0; row < this.gridDimensions.gridSizeVertical; row++) {
            let cloudPositionsData = [];
            for (let col = 0; col < this.gridDimensions.gridSizeHorizontal; col++) {
                const x = this.gridDimensions.cellSize * col + this.gridDimensions.cellSize / 2;
                const y = this.gridDimensions.cellSize * row + this.gridDimensions.cellSize / 2;
                const cloud = new Cloud(this, x, y, row, col);
                this.cloudsContainer.add(cloud);
                this.cloudsContainer.setDepth(GAME_OBJECT_DEPTHS.gameSceneCloudsContainer);
                cloudPositionsData.push(cloud);
            }
            clouds.push(cloudPositionsData);
            this.data.set('clouds', clouds);
        }
    }

    private setInitialMonsters(): void {
        this.data.set('playerMonsters', []);
        this.data.set('opponentMonsters', []);
    }

    private createLevelTitle(): void {
        let currentLevel = this.isGiantFightLevel
            ? LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel')
            : LOCAL_STORAGE_MANAGER.get('currentLevel');
        this.add.text(960, 50, `level ${currentLevel}`, {
            fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
            fontSize: 60, color: '#ffffff', stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setName('level title');
    }

    private createSurvivalLevelRewardText(): void {
        this.survivalLevelRewardText = this.add.text(960, 50, `reward: ${this.survivalLevelReward}`, {
            fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
            fontSize: 50, color: '#ffffff', stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setName('survivalLevelRewardText');
        this.survivalLevelRewardImage = this.add.image(
            this.survivalLevelRewardText.x + this.survivalLevelRewardText.width / 2 + 15, 55, 'coin'
        ).setScale(0.35).setOrigin(0, 0.5);
    }

    private updateSurvivalLevelRewardText(): void {
        this.survivalLevelReward = this.data.list.opponentMonsters.filter((m: Monster) => m === null).length
            * (this.survivalLevelData.rewardPerKill as number);
        this.survivalLevelRewardText.setText(`reward: ${this.survivalLevelReward}`);
        this.survivalLevelRewardImage.setX(
            this.survivalLevelRewardText.x + this.survivalLevelRewardText.width / 2 + 15
        );
    }

    private createGiveUpButton(): void {
        this.giveUpButton = new Button(this, 100, 1000, 'button', 'give\nup', () => {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.GIVE_UP_PRESSED);
        }, true);
    }

    private createEndTurnButton(): void {
        this.endTurnButton = new Button(this, 1820, 1000, 'button', 'end\nturn', () => {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.END_TURN_PRESSED);
        }, true);
    }

    private skipButtonHandler(): void {
        this.skipButton = new Button(this, 1820, 80, 'button', 'skip\nmove', () => {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.SKIP_PRESSED);
        }, true, 1);
        this.input.keyboard!.on('keydown-SPACE', () => {
            if (this.data.list.isPlayerTurn && this.skipButton.enabled) {
                this.events.emit(GAME_SCENE_SCENE_EVENTS.SKIP_PRESSED);
            }
        });
    }

    private createOpponentTurnMsg(): void {
        this.opponentTurnMsg = this.add.text(960, 540, `opponent's turn`, {
            fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
            fontSize: 100, color: '#ffffff', stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneOpponentTurnMsg);
    }

    private showOpponentTurnMsg(): void {
        this.opponentTurnMsg.setScale(1.5);
        this.tweens.chain({
            tweens: [
                {
                    targets: this.opponentTurnMsg,
                    alpha: 1, scale: 1, duration: 250,
                    ease: 'Back.easeOut'
                },
                {
                    targets: this.opponentTurnMsg,
                    alpha: 0, delay: 800, scale: 0, duration: 250,
                    ease: 'Back.easeIn',
                    onComplete: () => { this.checkOpponentForSpellCast(); }
                }
            ]
        });
    }

    private addOpponentMonstersLeftText(): void {
        this.opponentMonstersLeftText = this.add.text(200, 50,
            `enemies left: ${this.data.list.opponentMonsters.length}`, {
            fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
            fontSize: 50, color: '#ffffff', stroke: '#000000', letterSpacing: 4, strokeThickness: 8,
            align: 'center'
        }).setOrigin(0, 0.5);
    }

    private updateOpponentMonstersLeft(): void {
        this.opponentMonstersLeftText.setText(
            `enemies left: ${this.data.list.opponentMonsters.filter((x: Monster) => x !== null).length}`
        );
    }

    private monsterDieHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: (Monster | IUnitData)[]) => {
            const monster = data[0] as Monster;
            this.checkSpecificMonsterSkillOnMonsterDie(monster);
            if (!monster.isPlayerMonster) {
                DataHandler.checkDataOnMonsterDeath(monster);
            }
            this.updateOpponentMonstersLeft();
            if (this.isSurvivalLevel) {
                this.updateSurvivalLevelRewardText();
            }
            if (this.pendingRessurections.length) {
                this.checkMapVisibility(false);
                return;
            }
            if (this.data.list.opponentMonsters.every((m: Monster) => m === null)) {
                this.levelFinished = true;
                this.createLevelOutroPopup(true);
            } else if (this.data.list.playerMonsters.every((m: Monster) => m === null)) {
                this.levelFinished = true;
                this.createLevelOutroPopup();
            } else {
                this.checkMapVisibility(false);
            }
        });
    }

    pendingRessurectionHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.CHECK_PENDING_RESSURECTION, (killedMonster: Monster) => {
            if (killedMonster.type === '5') {
                this.pendingRessurections.push(killedMonster);
            }
        });
    }

    private removeMonstersInvincibilty(): void {
        for (let row = 0; row < main_config.gridSizeVertical; row++) {
            for (let col = 0; col < main_config.gridSizeHorizontal; col++) {
                this.data.list.gridPositions[row][col].justRessurected = false;
            }
        }
    }

    private applyPendingResurrections(onComplete?: Function): void {
        if (!this.pendingRessurections.length) {
            this.pendingRessurections = [];
            if (onComplete) { onComplete(); } else { this.checkNextTurn(false); }
            return;
        }
        this.pendingRessurections.forEach((killedMonster, index) => {
            const isLast = index === this.pendingRessurections.length - 1;
            const isPLayer = killedMonster.isPlayerMonster;
            const gridPosition = this.data.list.gridPositions[killedMonster.unitData.row][killedMonster.unitData.col];
            gridPosition.isEmpty = false;
            gridPosition.occupiedBy = isPLayer ? 'player' : 'opponent';
            const randomMonsterType = Phaser.Math.RND.pick(getAllMonsterTypes().filter((x: string) => x !== '5'));
            let unitData = getMonsterDataConfig(+randomMonsterType, killedMonster.unitData.stars - 1);
            let x = this.gridDimensions.cellSize * killedMonster.unitData.col + this.gridDimensions.cellSize / 2;
            let y = this.gridDimensions.cellSize * killedMonster.unitData.row + this.gridDimensions.cellSize / 2;
            let width = this.gridDimensions.cellSize - main_config.lineWidth;
            let height = this.gridDimensions.cellSize - main_config.lineWidth;
            unitData.health = 1;
            unitData.row = killedMonster.unitData.row;
            unitData.col = killedMonster.unitData.col;
            const ressurectedMonster = new Monster(this, x, y, width, height, unitData, killedMonster.index, isPLayer);
            this.data.list.gridPositions[killedMonster.unitData.row][killedMonster.unitData.col].justRessurected = true;
            ressurectedMonster.unitData.movesLeft = 0;
            ressurectedMonster.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: IUnitData) => {
                this.data.list.gridPositions[data.row][data.col].isEmpty = true;
                delete this.data.list.gridPositions[data.row][data.col].occupiedBy;
                delete this.data.list.gridPositions[data.row][data.col].giantData;
                if (isPLayer) {
                    this.data.list.playerMonsters[killedMonster.index] = null;
                } else {
                    this.data.list.opponentMonsters[killedMonster.index] = null;
                }
                this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, [ressurectedMonster, data]);
            });
            this.mainGridContainer.add(ressurectedMonster);
            if (isPLayer) {
                this.data.list.playerMonsters[killedMonster.index] = ressurectedMonster;
            } else {
                this.data.list.opponentMonsters[killedMonster.index] = ressurectedMonster;
            }
            if (isLast) {
                this.checkMapVisibility(true);
                this.time.delayedCall(1000, () => {
                    this.pendingRessurections = [];
                    this.events.emit(GAME_SCENE_SCENE_EVENTS.PENDING_RESSURECTIONS_COMPLETE);
                    if (onComplete) { onComplete(); } else { this.checkNextTurn(false); }
                });
            }
        });
    }

    private checkSpecificMonsterSkillOnMonsterDie(killedMonster: Monster): void {
        if (+this.currentlySelectedMonster?.type === 6 && this.currentlySelectedMonster?.unitData.movesLeft > 0) {
            const additionalRangedDamage = Math.ceil(this.currentlySelectedMonster.unitData.ranged * 0.5);
            this.currentlySelectedMonster.additionalRangedDamage = additionalRangedDamage;
            this.currentlySelectedMonster.updateRangedDamageText();
        }
        const monsters = killedMonster.isPlayerMonster ? this.data.list.opponentMonsters : this.data.list.playerMonsters;
        monsters
            .filter((m: Monster) => m && +m.type === 9 && m.unitData.moves < main_config.maxMonsterMovesPerRound && m.unitData.movesLeft < main_config.maxMonsterMovesPerRound)
            .forEach((fm: Monster) => {
                if (!killedMonster.killedByPoison) {
                    fm.addMove(true);
                    fm.addBUffCollected(fm.unitData.row, fm.unitData.col, 1, BUFF_TYPES.GREEN_DOT);
                }
            });
    }

    private addInteraction(): void {
        if (this.questionMarkContainer) {
            this.removeQuestionMarks();
        }
        if (this.data.list.isPlayerTurn) {
            this.data.list.playerMonsters.forEach((monster: Monster) => {
                if (monster) monster.resetMoves();
            });
        } else {
            this.skipButton.disableInteractive();
            if (this.isSurvivalLevel) {
                this.addNewSurvivalLevelMonsters();
            }
            this.data.list.opponentMonsters.forEach((monster: Monster) => {
                if (monster) monster.resetMoves();
            });
        }
        this.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.setInteraction(this.data.list.isPlayerTurn);
                monster.pendingAction = monster.frozenForDuration === 0 && this.data.list.isPlayerTurn;
            }
        });
        this.data.list.opponentMonsters.forEach((monster: Monster) => {
            if (monster) {
                monster.setAlpha(1);
                monster.pendingAction = monster.unitData.movesLeft > 0
                    ? monster.frozenForDuration === 0 && !this.data.list.isPlayerTurn
                    : false;
                monster.setInteraction(false);
            }
        });
        if (this.data.list.isPlayerTurn) {
            this.endTurnButton.setInteractive();
            this.autoSelectRandomPlayerMonster();
        } else {
            this.endTurnButton.disableInteractive();
        }
        this.updatePlayerSpellButtonsInteraction();
    }

    private pauseResumeInteraction(resume: boolean, skipByUser: boolean = false): void {
        if (!resume) {
            this.skipButton.disableInteractive();
            this.endTurnButton.disableInteractive();
        }
        this.data.list.playerMonsters.forEach((monster: Monster) => {
            if (monster && monster.frozenForDuration === 0) {
                monster.setInteraction(resume && monster.pendingAction, skipByUser);
            }
        });
        if (
            (resume && this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.movesLeft === 0) ||
            (this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.health === 0)
        ) {
            this.autoSelectRandomPlayerMonster();
        } else if (resume && this.currentlySelectedMonster.unitData.movesLeft > 0) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this.currentlySelectedMonster, this.currentlySelectedMonster.unitData, false]);
        }
        this.updatePlayerSpellButtonsInteraction();
    }

    private autoSelectRandomPlayerMonster(): void {
        const randomPlayerMonster: Monster = this.data.list.playerMonsters.find(
            (m: Monster) => m !== null && m.pendingAction
        );
        if (randomPlayerMonster) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [randomPlayerMonster, randomPlayerMonster.unitData, false]);
        }
    }

    private getVisibleCells(
        row: number, col: number, radius: number,
        allVisibleCellsToOpponent: boolean[][] = [],
        isGiant: boolean = false
    ): { row: number, col: number, occupiedBy: string, justRessurected: boolean }[] {
        const visibleCells: { row: number, col: number, occupiedBy: string, justRessurected: boolean }[] = [];
        const array = this.data.list.gridPositions;
        const getCells = (r: number, c: number) => {
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {
                    const newRow = r + y;
                    const newCol = c + x;
                    if (newRow >= 0 && newRow < array.length && newCol >= 0 && newCol < array[0].length) {
                        if (allVisibleCellsToOpponent.length && !allVisibleCellsToOpponent[newRow][newCol]) continue;
                        const occupiedBy = array[newRow][newCol].occupiedBy;
                        const justRessurected = array[newRow][newCol].justRessurected;
                        visibleCells.push({ row: newRow, col: newCol, occupiedBy, justRessurected });
                        const giantData = array[newRow][newCol].giantData;
                        if (giantData) {
                            const gr = giantData.row;
                            const gc = giantData.col;
                            visibleCells.push({ row: gr, col: gc, occupiedBy, justRessurected });
                            visibleCells.push({ row: gr, col: gc + 1, occupiedBy, justRessurected });
                            visibleCells.push({ row: gr + 1, col: gc, occupiedBy, justRessurected });
                            visibleCells.push({ row: gr + 1, col: gc + 1, occupiedBy, justRessurected });
                        }
                    }
                }
            }
        };
        getCells(row, col);
        if (isGiant) {
            getCells(row, col + 1);
            getCells(row + 1, col);
            getCells(row + 1, col + 1);
        }
        return visibleCells;
    }

    private isCellEmpty(row: number, col: number, skipCheck: boolean = false): boolean {
        return this.data.list.gridPositions[row] !== undefined &&
            this.data.list.gridPositions[row][col] !== undefined &&
            (skipCheck ? true : this.data.list.gridPositions[row][col].isEmpty);
    }

    private checkRoundEnded(): boolean {
        if (this.data.list.isPlayerTurn) {
            const allFrozen = this.data.list.playerMonsters
                .filter((m: Monster | null) => m !== null)
                .every((fm: Monster) => fm.frozenForDuration > 0);
            if (allFrozen) return false;
            return this.data.list.playerMonsters.filter(
                (m: Monster | null) => m !== null && m.pendingAction === true
            ).length === 0;
        } else {
            return this.data.list.opponentMonsters.filter(
                (m: Monster | null) => m !== null && m.pendingAction === true
            ).length === 0;
        }
    }

    private checkNextTurn(skipByUser: boolean, forceEndTurn: boolean = false): void {
        this.updateAdditionalMagicDamage();
        let turnEnd = forceEndTurn ? true : this.checkRoundEnded();

        if (this.pendingRessurections.length) {
            this.applyPendingResurrections();
            return;
        }

        if (turnEnd) {
            if (!this.data.list.isPlayerTurn) {
                this.events.emit(GAME_SCENE_SCENE_EVENTS.ROUND_END);
            }
            this.endTurnButton.disableInteractive();
            this.skipButton.disableInteractive();
            this.giveUpButton.disableInteractive();
            this.activeExplodePositions = 0;
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            this.pauseResumeInteraction(false);
            this.updateFrozenMonsters();
            this.removeMonstersInvincibilty();

            if (this.data.list.isPlayerTurn) {
                this.updateSpellLevelsOnTurnEnd();
                this.updatePlayerSpellButtonsInteraction(true);
                this.applyPoison(() => {
                    this.applyPendingResurrections(() => {
                        if (this.checkShouldAddBuffs()) {
                            this.addBuffsDuringGame(1);
                        } else {
                            this.addInteraction();
                        }
                    });
                });
            } else {
                this.skipButton.disableInteractive();
                this.time.delayedCall(10, () => {
                    if (this.currentlySelectedMonster) {
                        this.currentlySelectedMonster.setInteraction(false);
                        this.currentlySelectedMonster = null;
                    }
                });
                this.movementArrowsContainer.removeArrows();
                this.currentlySelectedMonsterAnimation!.pause().hide();
                if (this.currentlySelectedMonster) {
                    this.currentlySelectedMonster.removeFX(this);
                }
                this.updatePlayerSpellButtonsInteraction(true);
                this.applyPoison(() => {
                    this.applyPendingResurrections(() => {
                        if (this.levelFinished) return;
                        this.showOpponentTurnMsg();
                    });
                });
            }
        } else if (this.data.list.isPlayerTurn) {
            this.pauseResumeInteraction(true, skipByUser);
        } else {
            this.getRandomOpponentMonster();
        }
    }

    private checkShouldAddBuffs(): boolean {
        return Phaser.Math.RND.between(0, 100) <= main_config.buffs.chanceForBuffAfterRound;
    }

    private addBuffsDuringGame(buffsCount: number): void {
        this.updatePlayerSpellButtonsInteraction(true);
        if (!this.questionMarkContainer) {
            this.questionMarkContainer = this.add.container().setDepth(GAME_OBJECT_DEPTHS.gameSceneQuestionMarkContainer);
        }
        this.addQuestionMarks();
        let parachutesSoFar = buffsCount - 1;
        for (let index = 0; index < buffsCount; index++) {
            const row = Phaser.Math.Between(0, main_config.gridSizeVertical - 1);
            const col = Phaser.Math.Between(
                main_config.buffs.buffsStartLevelColumn.min,
                main_config.buffs.buffsStartLevelColumn.max
            );
            if (this.data.list.gridPositions[row][col].occupiedBy?.length || this.data.list.gridPositions[row][col].buff) {
                this.addInteraction();
                continue;
            }
            this.data.list.gridPositions[row][col].buff = true;
            this.addParachute(() => {
                this.addBuff(row, col, false);
                if (parachutesSoFar === 0) {
                    this.addInteraction();
                    this.removeQuestionMarks();
                }
                parachutesSoFar--;
            });
        }
    }

    private applyPoison(onComplete: Function): void {
        const allMonsters = [
            ...this.data.list.playerMonsters.filter((m: Monster) => m !== null),
            ...this.data.list.opponentMonsters.filter((m: Monster) => m !== null)
        ];
        const poisonedMonsters = allMonsters.filter((m: Monster) => m.poisonedForDuration > 0);
        if (!poisonedMonsters.length) {
            onComplete();
            return;
        }
        poisonedMonsters.forEach((monster: Monster, index: number) => {
            const isLast = index === poisonedMonsters.length - 1;
            monster.takePoisonDamege(isLast);
        });
        this.time.delayedCall(2000, () => {
            onComplete();
        });
    }

    private updateFrozenMonsters(): void {
        const allMonsters = [
            ...this.data.list.playerMonsters.filter((m: Monster) => m !== null),
            ...this.data.list.opponentMonsters.filter((m: Monster) => m !== null)
        ];
        allMonsters.forEach((monster: Monster) => {
            if (monster.frozenForDuration > 0) {
                monster.frozenForDuration--;
                if (monster.frozenForDuration === 0) {
                    monster.removeFrozen();
                }
            }
        });
    }

    private updateAdditionalMagicDamage(): void {
        const grid = this.data.list.gridPositions;
        const updateMagicText = (monsters: Monster[], enemyMonsters: Monster[], occupiedBy: 'player' | 'opponent') => {
            monsters.filter(monster => monster && Number(monster.type) === 3).forEach(monster => {
                let bonusMagic = 0;
                for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                    for (let colOffset = -1; colOffset <= 1; colOffset++) {
                        if (rowOffset === 0 && colOffset === 0) continue;
                        const row = monster.unitData.row + rowOffset;
                        const col = monster.unitData.col + colOffset;
                        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) continue;
                        if (grid[row][col].occupiedBy !== occupiedBy) continue;
                        const neighbour = enemyMonsters.find(m => m && m.unitData.row === row && m.unitData.col === col);
                        if (neighbour?.unitData.magic > 0) bonusMagic++;
                    }
                }
                monster.magic_text.setText(String(monster.unitData.magic + bonusMagic));
                if (bonusMagic) monster.setTextTint(monster.magic_text, true);
            });
        };
        updateMagicText(this.data.list.playerMonsters, this.data.list.opponentMonsters, 'opponent');
        updateMagicText(this.data.list.opponentMonsters, this.data.list.playerMonsters, 'player');
    }

    private updateSpellLevelsOnTurnEnd(): void {
        const updateButton = (button: Button, spellData: any) => {
            if (!button || !spellData || isNaN(spellData.cooldown)) return;
            if (button.usedCurrentRound) {
                button.usedCurrentRound = false;
            } else {
                spellData.cooldownProgress++;
            }
            button.tweenUpdateCooldown(spellData.cooldownProgress, spellData.cooldown);
            if (spellData.cooldownProgress === spellData.cooldown) {
                button.readyForUse = true;
                button.startSpellFilledTween(false);
            }
        };
        updateButton(this.playerMagicBallButton, this.playerSpellsData?.magicBall);
        updateButton(this.playerPoisonButton, this.playerSpellsData?.poison);
        updateButton(this.playerRainOfArrowsButton, this.playerSpellsData?.rainOfArrows);
        updateButton(this.playerFreezeButton, this.playerSpellsData?.freeze);
        updateButton(this.playerHealButton, this.playerSpellsData?.heal);
        updateButton(this.opponentMagicBallButton, this.opponentSpellsData?.magicBall);
        updateButton(this.opponentPoisonButton, this.opponentSpellsData?.poison);
        updateButton(this.opponentRainOfArrowsButton, this.opponentSpellsData?.rainOfArrows);
        updateButton(this.opponentFreezeButton, this.opponentSpellsData?.freeze);
        updateButton(this.opponentHealButton, this.opponentSpellsData?.heal);
    }

    private checkOpponentForSpellCast(): void {
        if (this.opponentSpellsData?.magicBall &&
            this.opponentSpellsData.magicBall.cooldownProgress === this.opponentSpellsData.magicBall.cooldown) {
            this.opponentSpellsData.magicBall.cooldownProgress = 0;
            this.newMagicBallSpell(this.opponentSpellsData.magicBall.cooldown);
        } else if (this.opponentSpellsData?.poison &&
            this.opponentSpellsData.poison.cooldownProgress === this.opponentSpellsData.poison.cooldown) {
            this.opponentSpellsData.poison.cooldownProgress = 0;
            this.newPoisonSpell(this.opponentSpellsData.poison.cooldown);
        } else if (this.opponentSpellsData?.rainOfArrows &&
            this.opponentSpellsData.rainOfArrows.cooldownProgress === this.opponentSpellsData.rainOfArrows.cooldown) {
            this.opponentSpellsData.rainOfArrows.cooldownProgress = 0;
            this.newRainOfArrowsSpell(this.opponentSpellsData.rainOfArrows.cooldown);
        } else if (this.opponentSpellsData?.freeze &&
            this.opponentSpellsData.freeze.cooldownProgress === this.opponentSpellsData.freeze.cooldown) {
            this.opponentSpellsData.freeze.cooldownProgress = 0;
            this.newFreezeSpell(this.opponentSpellsData.freeze.cooldown);
        } else if (this.opponentSpellsData?.heal &&
            this.opponentSpellsData.heal.cooldownProgress === this.opponentSpellsData.heal.cooldown) {
            this.opponentSpellsData.heal.cooldownProgress = 0;
            this.newHealSpell(this.opponentSpellsData.heal.cooldown);
        } else {
            if (this.pendingRessurections.length) {
                this.applyPendingResurrections();
                this.events.once(GAME_SCENE_SCENE_EVENTS.PENDING_RESSURECTIONS_COMPLETE, () => {
                    this.addInteraction();
                });
            } else {
                this.addInteraction();
                this.getRandomOpponentMonster();
            }
        }
    }

    private newMagicBallSpell(cooldown: number): void {
        const button = this.data.list.isPlayerTurn ? this.playerMagicBallButton : this.opponentMagicBallButton;
        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => { button.tweenUpdateCooldown(0, cooldown); });
            new MagicBallSpell(this, this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.magicBall : this.opponentSpellsData.magicBall
            );
            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
                this.updatePlayerSpellButtonsInteraction();
            });
        });
    }

    private newPoisonSpell(cooldown: number): void {
        const button = this.data.list.isPlayerTurn ? this.playerPoisonButton : this.opponentPoisonButton;
        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => { button.tweenUpdateCooldown(0, cooldown); });
            new PoisonSpell(this, this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.poison : this.opponentSpellsData.poison
            );
            this.time.delayedCall(750, () => { this.spellCastInProgress = false; });
        });
    }

    private newRainOfArrowsSpell(cooldown: number): void {
        const button = this.data.list.isPlayerTurn ? this.playerRainOfArrowsButton : this.opponentRainOfArrowsButton;
        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => { button.tweenUpdateCooldown(0, cooldown); });
            new RainOfArrowsSpell(this, this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.rainOfArrows : this.opponentSpellsData.rainOfArrows
            );
            this.time.delayedCall(750, () => { this.spellCastInProgress = false; });
        });
    }

    private newFreezeSpell(cooldown: number): void {
        const button = this.data.list.isPlayerTurn ? this.playerFreezeButton : this.opponentFreezeButton;
        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => { button.tweenUpdateCooldown(0, cooldown); });
            new FreezeSpell(this, this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.freeze : this.opponentSpellsData.freeze
            );
            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
                this.updatePlayerSpellButtonsInteraction();
            });
        });
    }

    private newHealSpell(cooldown: number): void {
        const button = this.data.list.isPlayerTurn ? this.playerHealButton : this.opponentHealButton;
        button.setAlpha(1);
        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => { button.tweenUpdateCooldown(0, cooldown); });
            new HealSpell(this, this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.playerMonsters : this.data.list.opponentMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.heal : this.opponentSpellsData.heal
            );
            this.time.delayedCall(750, () => { this.spellCastInProgress = false; });
        });
    }

    private getRandomOpponentMonster(repeatMove: boolean = false): void {
        const opponentMonsters = this.data.list.opponentMonsters.filter(
            (m: Monster | null) => m !== null && m!.pendingAction
        );
        if (opponentMonsters.length === 0) {
            this.checkNextTurn(false);
            return;
        }
        if (!repeatMove) {
            const rndMonsterIndex = Phaser.Math.RND.between(0, opponentMonsters.length - 1);
            this.currentlySelectedMonster = opponentMonsters[rndMonsterIndex];
        }
        this.mainGridContainer.bringToTop(this.currentlySelectedMonster);
        const rows = main_config.gridSizeHorizontal;
        const cols = main_config.gridSizeVertical;
        const allVisibleCellsToOpponent = Array.from({ length: cols }, () => Array(rows).fill(false));
        this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null).forEach((m: Monster) => {            const visibleCells = this.getVisibleCells(m.unitData.row, m.unitData.col, m.unitData.vision, [], m.unitData.isGiant);
            visibleCells.forEach((cell: { row: number, col: number }) => {
                allVisibleCellsToOpponent[cell.row][cell.col] = true;
            });
        });
        const range = this.currentlySelectedMonster.unitData.ranged > 0 ? main_config.rangedUnitsRange : 1;
        let attackableTargets = this.getVisibleCells(
            this.currentlySelectedMonster.unitData.row,
            this.currentlySelectedMonster.unitData.col,
            range, allVisibleCellsToOpponent,
            this.currentlySelectedMonster.unitData.isGiant
        ).filter(x => x.occupiedBy === 'player' && !x.justRessurected);

        if (attackableTargets.length > 0) {
            const target = this.getRandomTargetForOpponent(attackableTargets);
            this.events.emit(GAME_SCENE_SCENE_EVENTS.TARGET_SELECTED, [target.row, target.col, this.currentlySelectedMonster.unitData.ranged > 0]);
        } else {
            if (!this.checkPossibleMove()) {
                this.currentlySelectedMonster.skipMove();
                return;
            }
            const closestMonster = this.findClosestPlayerMonsterToMoveTo(allVisibleCellsToOpponent);
            if (closestMonster) {
                const newPosition = this.getMove(closestMonster.unitData);
                this.events.emit(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, [newPosition.row, newPosition.col]);
            } else {
                const newPosition = this.getRandomDirection();
                this.events.emit(GAME_SCENE_SCENE_EVENTS.DIRECTION_SELECTED, [newPosition!.newRow, newPosition!.newCol]);
            }
        }
    }

    private getRandomTargetForOpponent(targets: any): any {
        for (let index = 0; index < targets.length; index++) {
            const playerMonster = this.data.list.playerMonsters.find(
                (x: Monster) => x !== null && x.unitData.row === targets[index].row && x.unitData.col === targets[index].col
            );
            if (this.currentlySelectedMonster.unitData.magic) {
                if (playerMonster.unitData.health - this.currentlySelectedMonster.unitData.magic <= 0) return targets[index];
            } else if (this.currentlySelectedMonster.unitData.ranged) {
                if (playerMonster.unitData.health + playerMonster.unitData.shield - this.currentlySelectedMonster.unitData.ranged <= 0) return targets[index];
            } else if (this.currentlySelectedMonster.unitData.melee) {
                if (playerMonster.unitData.health + playerMonster.unitData.shield - this.currentlySelectedMonster.unitData.melee <= 0) return targets[index];
            }
        }
        return targets[Phaser.Math.RND.between(0, targets.length - 1)];
    }

    private findClosestPlayerMonsterToMoveTo(allVisibleCellsToOpponent: any[][]): Monster | undefined {
        const x1 = this.currentlySelectedMonster.unitData.col;
        const y1 = this.currentlySelectedMonster.unitData.row;
        let shortestDistance = Infinity;
        let coords = { x: -1, y: -1 };
        for (let row = 0; row < main_config.gridSizeVertical; row++) {
            for (let col = 0; col < main_config.gridSizeHorizontal; col++) {
                if (allVisibleCellsToOpponent[row][col] && this.data.list.gridPositions[row][col].occupiedBy === 'player') {
                    const distance = Phaser.Math.Distance.Between(x1, y1, col, row);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        coords.x = col;
                        coords.y = row;
                    }
                }
            }
        }
        return this.data.list.playerMonsters.find(
            (m: Monster) => m && m.unitData.row === coords.y && m.unitData.col === coords.x
        );
    }

    private checkPossibleMove(): boolean {
        const d = this.currentlySelectedMonster.unitData;
        const g = this.currentlySelectedMonster.unitData.isGiant;
        const e = (r: number, c: number) => this.isCellEmpty(r, c);
        if (g) {
            return (
                (e(d.row - 1, d.col) && e(d.row - 1, d.col + 1)) ||
                (e(d.row - 1, d.col + 1) && e(d.row - 1, d.col + 2) && e(d.row, d.col + 2)) ||
                (e(d.row, d.col + 2) && e(d.row + 1, d.col + 2)) ||
                (e(d.row + 2, d.col + 1) && e(d.row + 2, d.col + 2) && e(d.row + 1, d.col + 2)) ||
                (e(d.row + 2, d.col) && e(d.row + 2, d.col + 1)) ||
                (e(d.row + 1, d.col - 1) && e(d.row + 2, d.col - 1) && e(d.row + 2, d.col)) ||
                (e(d.row, d.col - 1) && e(d.row + 1, d.col - 1)) ||
                (e(d.row, d.col - 1) && e(d.row - 1, d.col - 1) && e(d.row - 1, d.col))
            );
        }
        return (
            e(d.row - 1, d.col) || e(d.row - 1, d.col + 1) || e(d.row, d.col + 1) ||
            e(d.row + 1, d.col + 1) || e(d.row + 1, d.col) || e(d.row + 1, d.col - 1) ||
            e(d.row, d.col - 1) || e(d.row - 1, d.col - 1)
        );
    }

    private getMove(closestUnitData: IUnitData): { row: number, col: number, weight: number } {
        const currentUnitData = this.currentlySelectedMonster.unitData;
        const moves: { row: number, col: number, weight: number }[] = [];
        const tryAddMove = (row: number, col: number, skipCheck: boolean = false) => {
            if (this.isCellEmpty(row, col, skipCheck)) {
                moves.push({
                    row, col,
                    weight: (+(Math.abs(row - closestUnitData.row) < Math.abs(currentUnitData.row - closestUnitData.row)) +
                        +(Math.abs(col - closestUnitData.col) < Math.abs(currentUnitData.col - closestUnitData.col)))
                });
            }
        };
        const g = currentUnitData.isGiant;
        const d = currentUnitData;
        if (g && this.isCellEmpty(d.row - 1, d.col) && this.isCellEmpty(d.row - 1, d.col + 1)) tryAddMove(d.row - 1, d.col, true);
        else if (!g) tryAddMove(d.row - 1, d.col);
        if (g && this.isCellEmpty(d.row - 1, d.col + 1) && this.isCellEmpty(d.row - 1, d.col + 2) && this.isCellEmpty(d.row, d.col + 2)) tryAddMove(d.row - 1, d.col + 1, true);
        else if (!g) tryAddMove(d.row - 1, d.col + 1);
        if (g && this.isCellEmpty(d.row, d.col + 2) && this.isCellEmpty(d.row + 1, d.col + 2)) tryAddMove(d.row, d.col + 1, true);
        else if (!g) tryAddMove(d.row, d.col + 1);
        if (g && this.isCellEmpty(d.row + 2, d.col + 1) && this.isCellEmpty(d.row + 2, d.col + 2) && this.isCellEmpty(d.row + 1, d.col + 2)) tryAddMove(d.row + 1, d.col + 1, true);
        else if (!g) tryAddMove(d.row + 1, d.col + 1);
        if (g && this.isCellEmpty(d.row + 2, d.col) && this.isCellEmpty(d.row + 2, d.col + 1)) tryAddMove(d.row + 1, d.col, true);
        else if (!g) tryAddMove(d.row + 1, d.col);
        if (g && this.isCellEmpty(d.row + 1, d.col - 1) && this.isCellEmpty(d.row + 2, d.col - 1) && this.isCellEmpty(d.row + 2, d.col)) tryAddMove(d.row + 1, d.col - 1, true);
        else if (!g) tryAddMove(d.row + 1, d.col - 1);
        if (g && this.isCellEmpty(d.row, d.col - 1) && this.isCellEmpty(d.row + 1, d.col - 1)) tryAddMove(d.row, d.col - 1, true);
        else if (!g) tryAddMove(d.row, d.col - 1);
        if (g && this.isCellEmpty(d.row, d.col - 1) && this.isCellEmpty(d.row - 1, d.col - 1) && this.isCellEmpty(d.row - 1, d.col)) tryAddMove(d.row - 1, d.col - 1, true);
        else if (!g) tryAddMove(d.row - 1, d.col - 1);
        const maxWeight = Math.max(...moves.map(x => x.weight));
        const bestMoves = moves.filter(move => move.weight === maxWeight);
        return Phaser.Math.RND.pick(bestMoves);
    }

    private getRandomDirection(): { newRow: number, newCol: number } | undefined {
        let row = this.currentlySelectedMonster.unitData.row;
        let col = this.currentlySelectedMonster.unitData.col;
        let newRow = NaN, newCol = NaN;
        let giantMonsterCanMove = false;
        const check = () => {
            const rnd = Phaser.Math.RND.between(1, 100);
            if (rnd > 80) { newRow = row; newCol = col + 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row, col + 2) && this.isCellEmpty(row + 1, col + 2); }
            else if (rnd > 60) { newRow = row - 1; newCol = col + 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row - 1, col + 1) && this.isCellEmpty(row - 1, col + 2) && this.isCellEmpty(row, col + 2); }
            else if (rnd > 40) { newRow = row + 1; newCol = col + 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row + 2, col + 1) && this.isCellEmpty(row + 2, col + 2) && this.isCellEmpty(row + 1, col + 2); }
            else if (rnd > 25) { newRow = row - 1; newCol = col; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row - 1, col) && this.isCellEmpty(row - 1, col + 1); }
            else if (rnd > 10) { newRow = row + 1; newCol = col; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row + 2, col) && this.isCellEmpty(row + 2, col + 1); }
            else if (rnd > 7) { newRow = row + 1; newCol = col - 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row + 1, col - 1) && this.isCellEmpty(row + 2, col - 1) && this.isCellEmpty(row + 2, col); }
            else if (rnd > 4) { newRow = row; newCol = col - 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row, col - 1) && this.isCellEmpty(row + 1, col - 1); }
            else { newRow = row - 1; newCol = col - 1; if (this.currentlySelectedMonster.unitData.isGiant) giantMonsterCanMove = this.isCellEmpty(row, col - 1) && this.isCellEmpty(row - 1, col - 1) && this.isCellEmpty(row - 1, col); }
            if ((this.currentlySelectedMonster.unitData.isGiant && !giantMonsterCanMove) || (!this.currentlySelectedMonster.unitData.isGiant && !this.isCellEmpty(newRow, newCol))) {
                check();
            }
        };
        check();
        return { newRow, newCol };
    }

    private addNewSurvivalLevelMonsters(): void {
        const newMonstersCount = this.survivalLevelData.newEnemiesPerRound || 0;
        for (let index = 0; index < newMonstersCount; index++) {
            const monstersSpawned = this.data.list.opponentMonsters.length;
            if (monstersSpawned === this.survivalTotalMonstersCount) break;
            const odds = this.survivalLevelData.newEnemiesStars;
            const monsterRewardType = getRandomMonsterType();
            let monsterRewardStars = NaN;
            const randomNumber = Phaser.Math.RND.between(1, 100);
            for (let oddIndex = 0; oddIndex < odds!.length; oddIndex++) {
                if (randomNumber <= odds![oddIndex]) { monsterRewardStars = oddIndex; break; }
            }
            let unit = getMonsterDataConfig(+monsterRewardType, monsterRewardStars);
            unit.row = Phaser.Math.RND.between(0, 6);
            unit.col = 0;
            if (this.data.list.gridPositions[unit.row][unit.col].occupiedBy) continue;
            const gridPosition = this.data.list.gridPositions[unit.row][unit.col];
            gridPosition.isEmpty = false;
            gridPosition.occupiedBy = 'opponent';
            const x = this.gridDimensions.cellSize * unit.col + this.gridDimensions.cellSize / 2;
            const y = this.gridDimensions.cellSize * unit.row + this.gridDimensions.cellSize / 2;
            const width = this.gridDimensions.cellSize - main_config.lineWidth;
            const height = this.gridDimensions.cellSize - main_config.lineWidth;
            const idx = this.data.list.opponentMonsters.length;
            const monster = new Monster(this, x, y, width, height, unit, idx, false);
            monster.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: IUnitData) => {
                this.data.list.gridPositions[data.row][data.col].isEmpty = true;
                delete this.data.list.gridPositions[data.row][data.col].occupiedBy;
                this.data.list.opponentMonsters[idx] = null;
                this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, [monster, data]);
            });
            this.mainGridContainer.add(monster);
            this.data.list.opponentMonsters.push(monster);
        }
        this.updateOpponentMonstersLeft();
    }

    private createLevelOutroPopup(levelWon: boolean = false): void {
        let currentLevel = (LOCAL_STORAGE_MANAGER.get('currentLevel') as number);
        const currentWorld = LOCAL_STORAGE_MANAGER.get('currentWorld');
        currentLevel = currentWorld === 2 ? currentLevel + 1 : currentLevel - 1;
        let currentLevelData = currentLevel !== 37 ? level_config[currentLevel] : level_config[37];
        let isFirstTimeReward = currentLevelData?.levelName
            ? !(LOCAL_STORAGE_MANAGER.get('levelsWon') as any).includes(+(currentLevelData.levelName as number))
            : false;

        let hasMonsterReweard = !this.isSurvivalLevel && isFirstTimeReward &&
            (Phaser.Math.RND.between(1, 100) <= main_config.chanceToGetMonsterOnLevelWin);        let hasGemReward = !this.isSurvivalLevel && Phaser.Math.RND.between(1, 100) > main_config.chanceToGetGemOnLevelWin;
        let gemReward = hasGemReward ? 1 : 0;

        if (this.isGiantFightLevel) {
            const currentDefeatGiantsLevel = LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel');
            currentLevelData = defeat_giants_level_config[currentDefeatGiantsLevel! - 1] as any;
            isFirstTimeReward = true;
            hasMonsterReweard = (currentLevelData as any).monstersReward?.length > 0;
            hasGemReward = (currentLevelData as any).gemsReward > 0;
            gemReward = (currentLevelData as any).gemsReward;
        }

        const levelsWon: any = LOCAL_STORAGE_MANAGER.get('levelsWon');
        if (!levelsWon.includes(+(currentLevelData.levelName as number)) && levelWon) {
            levelsWon.push(+(currentLevelData.levelName as number));
            LOCAL_STORAGE_MANAGER.set('levelsWon', levelsWon);
        }

        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneBGOverlay);
        this.tweens.add({ targets: overlay, duration: 200, alpha: 0.85 });
        this.add.existing(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', (pointer: any) => { pointer.event.stopPropagation(); });

        if (!this.isSurvivalLevel) {
            this.add.text(960, 350, levelWon ? 'LEVEL WON' : 'LEVEL LOST', {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 },
                fontSize: 100, color: '#ffffff', stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0.5).setDepth(GAME_OBJECT_DEPTHS.gameSceneHeaderLevelText);
        }

        if (levelWon || this.isSurvivalLevel) {
            this.startConfettiEmitter();
            // Claim button
            new Button(this, 960, 700, 'claim', null, () => {
                const playerCoins = (LOCAL_STORAGE_MANAGER.get('coins') as number);
                const coinsWon = isFirstTimeReward ? currentLevelData.firstWinReward : currentLevelData.repeatLevelWinReward;
                LOCAL_STORAGE_MANAGER.set('coins', +playerCoins + +(coinsWon as number));
                if (hasGemReward) {
                    LOCAL_STORAGE_MANAGER.set('gems', +(LOCAL_STORAGE_MANAGER.get('gems') as number) + gemReward);
                }
                const mapLevel = (LOCAL_STORAGE_MANAGER.get('mapLevel') as number);
                if (((currentLevelData.levelName as number) + 1) > +mapLevel) {
                    LOCAL_STORAGE_MANAGER.set('mapLevel', +mapLevel + 1);
                }
                if (this.isGiantFightLevel) {
                    LOCAL_STORAGE_MANAGER.set('defeatGiantsLevel', +(LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel') as number) + 1);
                    LOCAL_STORAGE_MANAGER.set('defeatGiantsLevelUnlocked', false);
                }
                void hasMonsterReweard; // reserved for future monster reward implementation
                this.changeScene('MainMenu');
            }).setDepth(GAME_OBJECT_DEPTHS.gameSceneClaimButton);
        } else {
            this.data.list.playerMonsters.forEach((m: Monster) => {
                if (m) { m.pendingAction = false; m.disableInteractive(); this.movementArrowsContainer.removeArrows(); }
            });
            new Button(this, 760, 700, 'button', 'try\nagain', () => { this.changeScene('Game'); }, false).setDepth(GAME_OBJECT_DEPTHS.gameSceneTryAgainButton);
            new Button(this, 1160, 700, 'button', 'give\nup', () => { this.changeScene('MainMenu'); }).setDepth(GAME_OBJECT_DEPTHS.gameSceneGiveUpButton);
        }
    }

    private startConfettiEmitter(): void {
        ['confetti-blue', 'confetti-red', 'confetti-green', 'confetti-yellow', 'confetti-orange'].forEach(element => {
            let emitter = this.add.particles(0, 0, element, {
                x: { random: [0, 1920] }, y: -50, lifespan: 4000,
                scale: { min: 0.1, max: 0.3 }, rotate: { min: 0, max: 360 },
                gravityY: 200, blendMode: 'ADD', frequency: 150, advance: 2000
            }).setDepth(GAME_OBJECT_DEPTHS.gameSceneConfettiEmitter);
            this.confettiEmitters.push(emitter);
        });
    }

    // required by AbstractScene
    createBackButton(): void { /* not used in Game scene */ }

    changeScene(nextScene: string): void {
        if (this.isSurvivalLevel) {
            const hoursToReset = this.survivalLevelData.hoursToReset || 0;
            const unlockTime = Date.now() + hoursToReset * 60 * 60 * 1000;
            LOCAL_STORAGE_MANAGER.set((`${this.survivalLevelData.levelName}`) as keyof IGameData, unlockTime.toString());
        }
        Object.values(GAME_SCENE_SCENE_EVENTS).forEach(event => {
            this.events.removeListener(event);
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.confettiEmitters.forEach(e => e.destroy(true));
            this.scene.start(nextScene);
        });
    }

    private createSpellButtons(): void {
        const magicBallCooldownLevel = LOCAL_STORAGE_MANAGER.get('magicBallCooldownLevel');
        const poisonCooldownLevel = LOCAL_STORAGE_MANAGER.get('poisonCooldownLevel');
        const rainOfArrowsCooldownLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsCooldownLevel');
        const freezeCooldownLevel = LOCAL_STORAGE_MANAGER.get('freezeCooldownLevel');
        const healCooldownLevel = LOCAL_STORAGE_MANAGER.get('healCooldownLevel');
        (this.playerSpellsData as any) = {};

        if (!isNaN(magicBallCooldownLevel) && magicBallCooldownLevel !== null) {
            this.playerSpellsData.magicBall = {
                cooldown: spellsConfig.magicBall.coolDown[magicBallCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[LOCAL_STORAGE_MANAGER.get('magicBallDamageLevel')].value,
                targets: spellsConfig.magicBall.targets[LOCAL_STORAGE_MANAGER.get('magicBallTargetsLevel')].value
            };
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.magicBall
                .replace('{damage}', `${this.playerSpellsData.magicBall.damage}`)
                .replace('{targets}', `${this.playerSpellsData.magicBall.targets}`)
                .replace('{cooldown}', `${this.playerSpellsData.magicBall.cooldown}`);
            if (this.playerSpellsData.magicBall.targets === 1) desc = desc.replace('targets', 'target');
            this.playerMagicBallButton = new Button(this, 1820, 290, 'magic-ball-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.magicBall.cooldownProgress = 0;
                this.playerMagicBallButton.readyForUse = false;
                this.newMagicBallSpell(this.playerSpellsData.magicBall.cooldown);
                this.movementArrowsContainer.removeArrows();
            }, true, 0.6, true, desc, false);
            this.playerMagicBallButton.addRevealOverlay();
            this.playerMagicBallButton.updateCooldown(this.playerSpellsData.magicBall.cooldownProgress, this.playerSpellsData.magicBall.cooldown);
            this.playerMagicBallButton.updateCooldownText(`${this.playerSpellsData.magicBall.cooldown - this.playerSpellsData.magicBall.cooldownProgress}`);
        } else {
            this.add.image(1820, 290, 'magic-ball-button-locked').setOrigin(0.5).setScale(0.6);
        }

        if (!isNaN(poisonCooldownLevel) && poisonCooldownLevel !== null) {
            this.playerSpellsData.poison = {
                cooldown: spellsConfig.poison.coolDown[poisonCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[LOCAL_STORAGE_MANAGER.get('poisonDamageLevel')].value,
                targets: spellsConfig.poison.targets[LOCAL_STORAGE_MANAGER.get('poisonTargetsLevel')].value,
                duration: spellsConfig.poison.duration[LOCAL_STORAGE_MANAGER.get('poisonDurationLevel')].value
            };
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.poison
                .replace('{damage}', `${this.playerSpellsData.poison.damage}`)
                .replace('{targets}', `${this.playerSpellsData.poison.targets}`)
                .replace('{duration}', `${this.playerSpellsData.poison.duration}`)
                .replace('{cooldown}', `${this.playerSpellsData.poison.cooldown}`);
            if (this.playerSpellsData.poison.targets === 1) { desc = desc.replace('targets', 'target').replace('rounds', 'round'); }
            this.playerPoisonButton = new Button(this, 1820, 417, 'poison-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.poison.cooldownProgress = 0;
                this.playerPoisonButton.readyForUse = false;
                this.newPoisonSpell(this.playerSpellsData.poison.cooldown);
                this.movementArrowsContainer.removeArrows();
            }, true, 0.6, true, desc, false);
            this.playerPoisonButton.addRevealOverlay();
            this.playerPoisonButton.updateCooldown(this.playerSpellsData.poison.cooldownProgress, this.playerSpellsData.poison.cooldown);
            this.playerPoisonButton.updateCooldownText(`${this.playerSpellsData.poison.cooldown - this.playerSpellsData.poison.cooldownProgress}`);
        } else {
            this.add.image(1820, 417, 'poison-button-locked').setOrigin(0.5).setScale(0.6);
        }

        if (!isNaN(rainOfArrowsCooldownLevel) && rainOfArrowsCooldownLevel !== null) {
            this.playerSpellsData.rainOfArrows = {
                cooldown: spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[LOCAL_STORAGE_MANAGER.get('rainOfArrowsDamageLevel')].value,
                targets: spellsConfig.rainOfArrows.targets[LOCAL_STORAGE_MANAGER.get('rainOfArrowsTargetsLevel')].value
            };
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.rainOfArrows
                .replace('{damage}', `${this.playerSpellsData.rainOfArrows.damage}`)
                .replace('{targets}', `${this.playerSpellsData.rainOfArrows.targets}`)
                .replace('{cooldown}', `${this.playerSpellsData.rainOfArrows.cooldown}`);
            if (this.playerSpellsData.rainOfArrows.targets === 1) desc = desc.replace('targets', 'target');
            this.playerRainOfArrowsButton = new Button(this, 1820, 550, 'rain-of-arrows-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.rainOfArrows.cooldownProgress = 0;
                this.playerRainOfArrowsButton.readyForUse = false;
                this.newRainOfArrowsSpell(this.playerSpellsData.rainOfArrows.cooldown);
                this.movementArrowsContainer.removeArrows();
            }, true, 0.6, true, desc, false);
            this.playerRainOfArrowsButton.addRevealOverlay();
            this.playerRainOfArrowsButton.updateCooldown(this.playerSpellsData.rainOfArrows.cooldownProgress, this.playerSpellsData.rainOfArrows.cooldown);
            this.playerRainOfArrowsButton.updateCooldownText(`${this.playerSpellsData.rainOfArrows.cooldown - this.playerSpellsData.rainOfArrows.cooldownProgress}`);
        } else {
            this.add.image(1820, 550, 'rain-of-arrows-button-locked').setOrigin(0.5).setScale(0.6);
        }

        if (!isNaN(freezeCooldownLevel) && freezeCooldownLevel !== null) {
            this.playerSpellsData.freeze = {
                cooldown: spellsConfig.freeze.coolDown[freezeCooldownLevel].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[LOCAL_STORAGE_MANAGER.get('freezeDurationLevel')].value,
                targets: spellsConfig.freeze.targets[LOCAL_STORAGE_MANAGER.get('freezeTargetsLevel')].value
            };
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.freeze
                .replace('{targets}', `${this.playerSpellsData.freeze.targets}`)
                .replace('{duration}', `${this.playerSpellsData.freeze.duration}`)
                .replace('{cooldown}', `${this.playerSpellsData.freeze.cooldown}`);
            if (this.playerSpellsData.freeze.targets === 1) { desc = desc.replace('targets', 'target').replace('rounds', 'round'); }
            this.playerFreezeButton = new Button(this, 1820, 680, 'freeze-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.freeze.cooldownProgress = 0;
                this.playerFreezeButton.readyForUse = false;
                this.newFreezeSpell(this.playerSpellsData.freeze.cooldown);
                this.movementArrowsContainer.removeArrows();
            }, true, 0.6, true, desc, false);
            this.playerFreezeButton.addRevealOverlay();
            this.playerFreezeButton.updateCooldown(this.playerSpellsData.freeze.cooldownProgress, this.playerSpellsData.freeze.cooldown);
            this.playerFreezeButton.updateCooldownText(`${this.playerSpellsData.freeze.cooldown - this.playerSpellsData.freeze.cooldownProgress}`);
        } else {
            this.add.image(1820, 680, 'freeze-button-locked').setOrigin(0.5).setScale(0.6);
        }

        if (!isNaN(healCooldownLevel) && healCooldownLevel !== null) {
            this.playerSpellsData.heal = {
                cooldown: spellsConfig.heal.coolDown[healCooldownLevel].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[LOCAL_STORAGE_MANAGER.get('healAmountLevel')].value,
                targets: spellsConfig.heal.targets[LOCAL_STORAGE_MANAGER.get('healTargetsLevel')].value
            };
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.heal
                .replace('{targets}', `${this.playerSpellsData.heal.targets}`)
                .replace('{amount}', `${this.playerSpellsData.heal.amount}`)
                .replace('{cooldown}', `${this.playerSpellsData.heal.cooldown}`);
            if (this.playerSpellsData.heal.targets === 1) desc = desc.replace('targets', 'target');
            this.playerHealButton = new Button(this, 1820, 810, 'heal-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.heal.cooldownProgress = 0;
                this.playerHealButton.readyForUse = false;
                this.newHealSpell(this.playerSpellsData.heal.cooldown);
                this.movementArrowsContainer.removeArrows();
            }, true, 0.6, true, desc, false);
            this.playerHealButton.addRevealOverlay();
            this.playerHealButton.updateCooldown(this.playerSpellsData.heal.cooldownProgress, this.playerSpellsData.heal.cooldown);
            this.playerHealButton.updateCooldownText(`${this.playerSpellsData.heal.cooldown - this.playerSpellsData.heal.cooldownProgress}`);
        } else {
            this.add.image(1820, 810, 'heal-button-locked').setOrigin(0.5).setScale(0.6);
        }

        // OPPONENT BUTTONS
        if (this.opponentSpellsData?.magicBall) {
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.magicBall.replace('{damage}', `${this.opponentSpellsData.magicBall.damage}`).replace('{targets}', `${this.opponentSpellsData.magicBall.targets}`).replace('{cooldown}', `${this.opponentSpellsData.magicBall.cooldown}`);
            if (this.opponentSpellsData.magicBall.targets === 1) desc = desc.replace('targets', 'target');
            this.opponentMagicBallButton = new Button(this, 100, 290, 'magic-ball-button', '', () => { }, true, 0.6, true, desc, true);
            this.opponentMagicBallButton.addRevealOverlay();
            this.opponentMagicBallButton.updateCooldown(this.opponentSpellsData.magicBall.cooldownProgress, this.opponentSpellsData.magicBall.cooldown);
            this.opponentMagicBallButton.updateCooldownText(`${this.opponentSpellsData.magicBall.cooldown - this.opponentSpellsData.magicBall.cooldownProgress}`);
        } else { this.add.image(100, 290, 'magic-ball-button-locked').setOrigin(0.5).setScale(0.6); }

        if (this.opponentSpellsData?.poison) {
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.poison.replace('{damage}', `${this.opponentSpellsData.poison.damage}`).replace('{targets}', `${this.opponentSpellsData.poison.targets}`).replace('{duration}', `${this.opponentSpellsData.poison.duration}`).replace('{cooldown}', `${this.opponentSpellsData.poison.cooldown}`);
            if (this.opponentSpellsData.poison.targets === 1) { desc = desc.replace('targets', 'target').replace('rounds', 'round'); }
            this.opponentPoisonButton = new Button(this, 100, 417, 'poison-button', '', () => { }, true, 0.6, true, desc, true);
            this.opponentPoisonButton.addRevealOverlay();
            this.opponentPoisonButton.updateCooldown(this.opponentSpellsData.poison.cooldownProgress, this.opponentSpellsData.poison.cooldown);
            this.opponentPoisonButton.updateCooldownText(`${this.opponentSpellsData.poison.cooldown - this.opponentSpellsData.poison.cooldownProgress}`);
        } else { this.add.image(100, 417, 'poison-button-locked').setOrigin(0.5).setScale(0.6); }

        if (this.opponentSpellsData?.rainOfArrows) {
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.rainOfArrows.replace('{damage}', `${this.opponentSpellsData.rainOfArrows.damage}`).replace('{targets}', `${this.opponentSpellsData.rainOfArrows.targets}`).replace('{cooldown}', `${this.opponentSpellsData.rainOfArrows.cooldown}`);
            if (this.opponentSpellsData.rainOfArrows.targets === 1) desc = desc.replace('targets', 'target');
            this.opponentRainOfArrowsButton = new Button(this, 100, 550, 'rain-of-arrows-button', '', () => { }, true, 0.6, true, desc, true);
            this.opponentRainOfArrowsButton.addRevealOverlay();
            this.opponentRainOfArrowsButton.updateCooldown(this.opponentSpellsData.rainOfArrows.cooldownProgress, this.opponentSpellsData.rainOfArrows.cooldown);
            this.opponentRainOfArrowsButton.updateCooldownText(`${this.opponentSpellsData.rainOfArrows.cooldown - this.opponentSpellsData.rainOfArrows.cooldownProgress}`);
        } else { this.add.image(100, 550, 'rain-of-arrows-button-locked').setOrigin(0.5).setScale(0.6); }

        if (this.opponentSpellsData?.freeze) {
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.freeze.replace('{targets}', `${this.opponentSpellsData.freeze.targets}`).replace('{duration}', `${this.opponentSpellsData.freeze.duration}`).replace('{cooldown}', `${this.opponentSpellsData.freeze.cooldown}`);
            if (this.opponentSpellsData.freeze.targets === 1) { desc = desc.replace('targets', 'target').replace('rounds', 'round'); }
            this.opponentFreezeButton = new Button(this, 100, 680, 'freeze-button', '', () => { }, true, 0.6, true, desc, true);
            this.opponentFreezeButton.addRevealOverlay();
            this.opponentFreezeButton.updateCooldown(this.opponentSpellsData.freeze.cooldownProgress, this.opponentSpellsData.freeze.cooldown);
            this.opponentFreezeButton.updateCooldownText(`${this.opponentSpellsData.freeze.cooldown - this.opponentSpellsData.freeze.cooldownProgress}`);
        } else { this.add.image(100, 680, 'freeze-button-locked').setOrigin(0.5).setScale(0.6); }

        if (this.opponentSpellsData?.heal) {
            let desc = SPELL_BUTTONS_POPUP_DESCRIPTION.heal.replace('{targets}', `${this.opponentSpellsData.heal.targets}`).replace('{amount}', `${this.opponentSpellsData.heal.amount}`).replace('{cooldown}', `${this.opponentSpellsData.heal.cooldown}`);
            if (this.opponentSpellsData.heal.targets === 1) desc = desc.replace('targets', 'target');
            this.opponentHealButton = new Button(this, 100, 810, 'heal-button', '', () => { }, true, 0.6, true, desc, true);
            this.opponentHealButton.addRevealOverlay();
            this.opponentHealButton.updateCooldown(this.opponentSpellsData.heal.cooldownProgress, this.opponentSpellsData.heal.cooldown);
            this.opponentHealButton.updateCooldownText(`${this.opponentSpellsData.heal.cooldown - this.opponentSpellsData.heal.cooldownProgress}`);
        } else { this.add.image(100, 810, 'heal-button-locked').setOrigin(0.5).setScale(0.6); }
    }
}
