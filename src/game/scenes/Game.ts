import { addFullscreenFunctionality, GAME_OBJECT_DEPTHS, getMonsterDataConfig, getRandomMonsterType, main_config } from '../configs/main_config';
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
    'DROPPED_TOKEN_COLLECTED' = 'dropped-token-collected',
    'BUFF_BOMB_EXPLODE' = 'buff-bomb-explode',
    'ROUND_END' = 'round-end'
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
        this.opponentSpellsData = d.opponentSpellsData;
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
        this.setGridPositions(); //return;
        this.setInitialMonsters();

        Monsters.createMonsters(this, this.mainGridContainer, this.gridDimensions, d.isGiantFightLevel);
        this.addClouds();
        // this.createBulbs();
        if (!this.isSurvivalLevel) {
            this.createLevelTitle();
        }

        // buttons and popups
        this.createGiveUpButton();
        this.createEndTurnButton();
        this.createOpponentTurnMsg();
        this.addOpponentMonstersLeftText();
        this.createSpellButtons();

        this.checkMapVisibility(true);
        addFullscreenFunctionality(this, 100, 80);

        // event handlers
        this.skipButtonHandler();
        this.monsterDieHandler();
        this.opponentRepeatMoveHandler();
        this.monsterSelectHandler();
        this.directionSelectHandler();
        this.targetSelectHandler();
        this.buffBombExplodeHandler();
        // this.checkEndTurnHandler(); // it calls  this.addInteraction // BEING CALLED AFTER INITIAL BUFFS HAVE LANDED

        LOCAL_STORAGE_MANAGER.remove('survivalLevelData');

        //TODO - uncomment below
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
            this.createLevelOutroPopup(true);
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

        // this.playerMagicBallButton = null;

    }

    // region BUFFS
    private addBuff(row: number, col: number, addQuestionMarks: boolean = true) {
        if (!this.questionMarkContainer && addQuestionMarks) {
            this.addQuestionMarks();
        }
        const randomBuffType = Phaser.Math.RND.pick(Object.values(BUFF_TYPES));//BUFF_TYPES.GREEN_DOT//
        // const randomBuffType = BUFF_TYPES.BOMB; // test only

        const randomBuffQuantity = main_config.buffs.quality;
        let container = this.add.container(this.data.list.gridPositions[row][col].x + this.mainGridContainer.x, this.data.list.gridPositions[row][col].y + this.mainGridContainer.y);
        container.setDepth(GAME_OBJECT_DEPTHS.gameSceneBuffContainer);
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

        if (randomBuffType === 'bomb') {
            plate.destroy(true);
            buffText.destroy(true);
            buffTypeImage.setY(10).setScale(0.2);
        }

        console.log(this.data.list.gridPositions)

        let buffData = (this.data.list.gridPositions[row][col] as any).buff = {
            buffType: randomBuffType,
            quantity: randomBuffQuantity,
            buffContainer: container
        };
    }

    private addBuffs(buffsCount: number = NaN) {

        this.updatePlayerSpellButtonsInteraction(true);
        // this.pauseResumeInteraction(false);
        this.questionMarkContainer = this.add.container().setDepth(GAME_OBJECT_DEPTHS.gameSceneQuestionMarkContainer);
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

        let parachute = this.add.image(Phaser.Math.RND.between(850, 1070), -100, 'parachute').setScale(1).setOrigin(0.5).setAlpha(1).setDepth(GAME_OBJECT_DEPTHS.gameSceneParachute);
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
        let currentLevel = undefined;
        if (this.isGiantFightLevel) {
            currentLevel = LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel');
        } else {
            currentLevel = LOCAL_STORAGE_MANAGER.get('currentLevel');
        }
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

    // region SURVIVAL LEVELS
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

    // region BUTTONS
    private createGiveUpButton() {
        this.giveUpButton = new Button(this, 100, 1000, 'button', 'give\nup', () => {
            this.createLevelOutroPopup();
        }, true)
    }

    private createEndTurnButton() {
        this.endTurnButton = new Button(this, 1820, 1000, 'button', 'end\nturn', () => {
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
            this.checkNextTurn(false, true);
        }, true)
    }

    private createSpellButtons() {

        const magicBallCooldownLevel = LOCAL_STORAGE_MANAGER.get('magicBallCooldownLevel');
        const poisonCooldownLevel = LOCAL_STORAGE_MANAGER.get('poisonCooldownLevel');
        const rainOfArrowsCooldownLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsCooldownLevel');
        const freezeCooldownLevel = LOCAL_STORAGE_MANAGER.get('freezeCooldownLevel');
        const healCooldownLevel = LOCAL_STORAGE_MANAGER.get('healCooldownLevel');

        (this.playerSpellsData as any) = {};

        // PLAYER MAGIC BALL BUTTON
        if (!isNaN(magicBallCooldownLevel) && magicBallCooldownLevel !== null) {
            this.playerSpellsData.magicBall = {
                cooldown: spellsConfig.magicBall.coolDown[magicBallCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.magicBall.damage[LOCAL_STORAGE_MANAGER.get('magicBallDamageLevel')].value,
                targets: spellsConfig.magicBall.targets[LOCAL_STORAGE_MANAGER.get('magicBallTargetsLevel')].value
            }

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.magicBall;
            popupDescription = popupDescription
                .replace('{damage}', `${this.playerSpellsData.magicBall.damage}`)
                .replace('{targets}', `${this.playerSpellsData.magicBall.targets}`)
                .replace('{cooldown}', `${this.playerSpellsData.magicBall.cooldown}`)
            if (this.playerSpellsData.magicBall.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.playerMagicBallButton = new Button(this, 1820, 290, 'magic-ball-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.magicBall.cooldownProgress = 0;
                this.playerMagicBallButton.readyForUse = false;
                this.newMagicBallSpell(this.playerSpellsData.magicBall.cooldown);
                // this.playerMagicBallButton.tweenUpdateCooldown(0, this.playerSpellsData.magicBall.cooldown);
                this.movementArrowsContainer.removeArrows();
                this.pauseResumeInteraction(false);
            }, true, 0.6, true, popupDescription, false);

            this.playerMagicBallButton.addRevealOverlay();
            this.playerMagicBallButton.updateCooldown(
                this.playerSpellsData.magicBall.cooldownProgress,
                this.playerSpellsData.magicBall.cooldown
            );
            this.playerMagicBallButton.updateCooldownText(
                `${this.playerSpellsData.magicBall.cooldown - this.playerSpellsData.magicBall.cooldownProgress}`
            );
        } else {
            // create static image for player magic ball button
            const staticPlayerMagicBallButton = this.add.image(1820, 290, 'magic-ball-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // PLAYER POISON BUTTON
        if (!isNaN(poisonCooldownLevel) && poisonCooldownLevel !== null) {
            this.playerSpellsData.poison = {
                cooldown: spellsConfig.poison.coolDown[poisonCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.poison.damage[LOCAL_STORAGE_MANAGER.get('poisonDamageLevel')].value,
                targets: spellsConfig.poison.targets[LOCAL_STORAGE_MANAGER.get('poisonTargetsLevel')].value,
                duration: spellsConfig.poison.duration[LOCAL_STORAGE_MANAGER.get('poisonDurationLevel')].value
            }

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.poison;
            popupDescription = popupDescription
                .replace('{damage}', `${this.playerSpellsData.poison.damage}`)
                .replace('{targets}', `${this.playerSpellsData.poison.targets}`)
                .replace('{duration}', `${this.playerSpellsData.poison.duration}`)
                .replace('{cooldown}', `${this.playerSpellsData.poison.cooldown}`)
            if (this.playerSpellsData.poison.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`);
                popupDescription = popupDescription.replace('rounds', `round`);
            }

            this.playerPoisonButton = new Button(this, 1820, 417, 'poison-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.poison.cooldownProgress = 0;
                this.playerPoisonButton.readyForUse = false;
                this.newPoisonSpell(this.playerSpellsData.poison.cooldown);
                this.movementArrowsContainer.removeArrows();
                this.pauseResumeInteraction(false);
            }, true, 0.6, true, popupDescription, false);
            this.playerPoisonButton.addRevealOverlay();
            this.playerPoisonButton.updateCooldown(
                this.playerSpellsData.poison.cooldownProgress,
                this.playerSpellsData.poison.cooldown
            );
            this.playerPoisonButton.updateCooldownText(
                `${this.playerSpellsData.poison.cooldown - this.playerSpellsData.poison.cooldownProgress}`
            );
        } else {
            // create static image for player magic ball button
            const staticPlayerPoisonButton = this.add.image(1820, 417, 'poison-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // PLAYER RAIN OF ARROWS BUTTON
        if (!isNaN(rainOfArrowsCooldownLevel) && rainOfArrowsCooldownLevel !== null) {
            this.playerSpellsData.rainOfArrows = {
                cooldown: spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel].value,
                cooldownProgress: 0,
                damage: spellsConfig.rainOfArrows.damage[LOCAL_STORAGE_MANAGER.get('rainOfArrowsDamageLevel')].value,
                targets: spellsConfig.rainOfArrows.targets[LOCAL_STORAGE_MANAGER.get('rainOfArrowsTargetsLevel')].value
            }

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.rainOfArrows;
            popupDescription = popupDescription
                .replace('{damage}', `${this.playerSpellsData.rainOfArrows.damage}`)
                .replace('{targets}', `${this.playerSpellsData.rainOfArrows.targets}`)
                .replace('{cooldown}', `${this.playerSpellsData.rainOfArrows.cooldown}`)
            if (this.playerSpellsData.rainOfArrows.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.playerRainOfArrowsButton = new Button(this, 1820, 550, 'rain-of-arrows-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.rainOfArrows.cooldownProgress = 0;
                this.playerRainOfArrowsButton.readyForUse = false;
                this.newRainOfArrowsSpell(this.playerSpellsData.rainOfArrows.cooldown);
                this.movementArrowsContainer.removeArrows();
                this.pauseResumeInteraction(false);
            }, true, 0.6, true, popupDescription, false);

            this.playerRainOfArrowsButton.addRevealOverlay();
            this.playerRainOfArrowsButton.updateCooldown(
                this.playerSpellsData.rainOfArrows.cooldownProgress,
                this.playerSpellsData.rainOfArrows.cooldown
            );
            this.playerRainOfArrowsButton.updateCooldownText(
                `${this.playerSpellsData.rainOfArrows.cooldown - this.playerSpellsData.rainOfArrows.cooldownProgress}`
            );
        } else {
            // create static image for player magic ball button
            const staticPlayerRainOfArrowButton = this.add.image(1820, 550, 'rain-of-arrows-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // PLAYER FREEZE BUTTON
        if (!isNaN(freezeCooldownLevel) && freezeCooldownLevel !== null) {
            this.playerSpellsData.freeze = {
                cooldown: spellsConfig.freeze.coolDown[freezeCooldownLevel].value,
                cooldownProgress: 0,
                duration: spellsConfig.freeze.duration[LOCAL_STORAGE_MANAGER.get('freezeDurationLevel')].value,
                targets: spellsConfig.freeze.targets[LOCAL_STORAGE_MANAGER.get('freezeTargetsLevel')].value
            }

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.freeze;
            popupDescription = popupDescription
                .replace('{targets}', `${this.playerSpellsData.freeze.targets}`)
                .replace('{duration}', `${this.playerSpellsData.freeze.duration}`)
                .replace('{cooldown}', `${this.playerSpellsData.freeze.cooldown}`)
            if (this.playerSpellsData.freeze.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`);
                popupDescription = popupDescription.replace('rounds', `round`);
            }

            this.playerFreezeButton = new Button(this, 1820, 680, 'freeze-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.freeze.cooldownProgress = 0;
                this.playerFreezeButton.readyForUse = false;
                this.newFreezeSpell(this.playerSpellsData.freeze.cooldown);
                this.movementArrowsContainer.removeArrows();
                this.pauseResumeInteraction(false);
            }, true, 0.6, true, popupDescription, false);

            this.playerFreezeButton.addRevealOverlay();
            this.playerFreezeButton.updateCooldown(
                this.playerSpellsData.freeze.cooldownProgress,
                this.playerSpellsData.freeze.cooldown
            );
            this.playerFreezeButton.updateCooldownText(
                `${this.playerSpellsData.freeze.cooldown - this.playerSpellsData.freeze.cooldownProgress}`
            );
        } else {
            // create static image for player magic ball button
            const staticPlayerFreezeButton = this.add.image(1820, 680, 'freeze-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // PLAYER HEAL BUTTON
        if (!isNaN(healCooldownLevel) && healCooldownLevel !== null) {
            this.playerSpellsData.heal = {
                cooldown: spellsConfig.heal.coolDown[healCooldownLevel].value,
                cooldownProgress: 0,
                amount: spellsConfig.heal.amount[LOCAL_STORAGE_MANAGER.get('healAmountLevel')].value,
                targets: spellsConfig.heal.targets[LOCAL_STORAGE_MANAGER.get('healTargetsLevel')].value
            }

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.heal;
            popupDescription = popupDescription
                .replace('{targets}', `${this.playerSpellsData.heal.targets}`)
                .replace('{amount}', `${this.playerSpellsData.heal.amount}`)
                .replace('{cooldown}', `${this.playerSpellsData.heal.cooldown}`)
            if (this.playerSpellsData.heal.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.playerHealButton = new Button(this, 1820, 810, 'heal-button', '', () => {
                this.spellCastInProgress = true;
                this.playerSpellsData.heal.cooldownProgress = 0;
                this.playerHealButton.readyForUse = false;
                this.newHealSpell(this.playerSpellsData.heal.cooldown);
                this.movementArrowsContainer.removeArrows();
                this.pauseResumeInteraction(false);
            }, true, 0.6, true, popupDescription, false);

            this.playerHealButton.addRevealOverlay();
            this.playerHealButton.updateCooldown(
                this.playerSpellsData.heal.cooldownProgress,
                this.playerSpellsData.heal.cooldown
            );
            this.playerHealButton.updateCooldownText(
                `${this.playerSpellsData.heal.cooldown - this.playerSpellsData.heal.cooldownProgress}`
            );
        } else {
            // create static image for player heal button
            const staticPlayerHealButton = this.add.image(1820, 810, 'heal-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // OPPONENT MAGIC BALL BUTTON
        if (this.opponentSpellsData?.magicBall) {

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.magicBall;
            popupDescription = popupDescription
                .replace('{damage}', `${this.opponentSpellsData.magicBall.damage}`)
                .replace('{targets}', `${this.opponentSpellsData.magicBall.targets}`)
                .replace('{cooldown}', `${this.opponentSpellsData.magicBall.cooldown}`)
            if (this.opponentSpellsData.magicBall.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.opponentMagicBallButton = new Button(this, 100, 290, 'magic-ball-button', '', () => {
                // ...no action - opponent will use it next turn
            }, true, 0.6, true, popupDescription, true)
            this.opponentMagicBallButton.addRevealOverlay();
            this.opponentMagicBallButton.updateCooldown(
                this.opponentSpellsData.magicBall.cooldownProgress,
                this.opponentSpellsData.magicBall.cooldown
            );

            this.opponentMagicBallButton.updateCooldownText(
                `${this.opponentSpellsData.magicBall.cooldown - this.opponentSpellsData.magicBall.cooldownProgress}`
            );
        } else {
            // create static image for opponent magic ball button
            const staticOpponentMagicBallButton = this.add.image(100, 290, 'magic-ball-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // OPPONENT POISON BUTTON
        if (this.opponentSpellsData?.poison) {

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.poison;
            popupDescription = popupDescription
                .replace('{damage}', `${this.opponentSpellsData.poison.damage}`)
                .replace('{targets}', `${this.opponentSpellsData.poison.targets}`)
                .replace('{duration}', `${this.opponentSpellsData.poison.duration}`)
                .replace('{cooldown}', `${this.opponentSpellsData.poison.cooldown}`)
            if (this.opponentSpellsData.poison.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`);
                popupDescription = popupDescription.replace('rounds', `round`);
            }

            this.opponentPoisonButton = new Button(this, 100, 417, 'poison-button', '', () => {
                // ...no action - opponent will use it next turn
            }, true, 0.6, true, popupDescription, true)

            this.opponentPoisonButton.addRevealOverlay();
            this.opponentPoisonButton.updateCooldown(
                this.opponentSpellsData.poison.cooldownProgress,
                this.opponentSpellsData.poison.cooldown
            );
            this.opponentPoisonButton.updateCooldownText(
                `${this.opponentSpellsData.poison.cooldown - this.opponentSpellsData.poison.cooldownProgress}`
            );
        } else {
            // create static image for opponent magic ball button
            const staticOpponentMagicBallButton = this.add.image(100, 417, 'poison-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // OPPONENT RAIN OF ARROWS BUTTON
        if (this.opponentSpellsData?.rainOfArrows) {

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.rainOfArrows;
            popupDescription = popupDescription
                .replace('{damage}', `${this.opponentSpellsData.rainOfArrows.damage}`)
                .replace('{targets}', `${this.opponentSpellsData.rainOfArrows.targets}`)
                .replace('{cooldown}', `${this.opponentSpellsData.rainOfArrows.cooldown}`)
            if (this.opponentSpellsData.rainOfArrows.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.opponentRainOfArrowsButton = new Button(this, 100, 550, 'rain-of-arrows-button', '', () => {
                // ...no action - opponent will use it next turn
            }, true, 0.6, true, popupDescription, true);

            this.opponentRainOfArrowsButton.addRevealOverlay();
            this.opponentRainOfArrowsButton.updateCooldown(
                this.opponentSpellsData.rainOfArrows.cooldownProgress,
                this.opponentSpellsData.rainOfArrows.cooldown
            );
            this.opponentRainOfArrowsButton.updateCooldownText(
                `${this.opponentSpellsData.rainOfArrows.cooldown - this.opponentSpellsData.rainOfArrows.cooldownProgress}`
            );
        } else {
            // create static image for opponent freeze button
            const staticOpponentRainOfArrowsButton = this.add.image(100, 550, 'rain-of-arrows-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // OPPONENT FREEZE BUTTON
        if (this.opponentSpellsData?.freeze) {

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.freeze;
            popupDescription = popupDescription
                .replace('{targets}', `${this.opponentSpellsData.freeze.targets}`)
                .replace('{duration}', `${this.opponentSpellsData.freeze.duration}`)
                .replace('{cooldown}', `${this.opponentSpellsData.freeze.cooldown}`)
            if (this.opponentSpellsData.freeze.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`);
                popupDescription = popupDescription.replace('rounds', `round`);
            }

            this.opponentFreezeButton = new Button(this, 100, 680, 'freeze-button', '', () => {
                // ...no action - opponent will use it next turn
            }, true, 0.6, true, popupDescription, true);

            this.opponentFreezeButton.addRevealOverlay();
            this.opponentFreezeButton.updateCooldown(
                this.opponentSpellsData.freeze.cooldownProgress,
                this.opponentSpellsData.freeze.cooldown
            );
            this.opponentFreezeButton.updateCooldownText(
                `${this.opponentSpellsData.freeze.cooldown - this.opponentSpellsData.freeze.cooldownProgress}`
            );
        } else {
            // create static image for opponent freeze button
            const staticOpponentFreezeButton = this.add.image(100, 680, 'freeze-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }

        // OPPONENT HEAL BUTTON
        if (this.opponentSpellsData?.heal) {

            let popupDescription = SPELL_BUTTONS_POPUP_DESCRIPTION.heal;
            popupDescription = popupDescription
                .replace('{targets}', `${this.opponentSpellsData.heal.targets}`)
                .replace('{amount}', `${this.opponentSpellsData.heal.amount}`)
                .replace('{cooldown}', `${this.opponentSpellsData.heal.cooldown}`)
            if (this.opponentSpellsData.heal.targets === 1) {
                popupDescription = popupDescription.replace('targets', `target`)
            }

            this.opponentHealButton = new Button(this, 100, 810, 'heal-button', '', () => {
                // ...no action - opponent will use it next turn
            }, true, 0.6, true, popupDescription, true);

            this.opponentHealButton.addRevealOverlay();
            this.opponentHealButton.updateCooldown(
                this.opponentSpellsData.heal.cooldownProgress,
                this.opponentSpellsData.heal.cooldown
            );
            this.opponentHealButton.updateCooldownText(
                `${this.opponentSpellsData.heal.cooldown - this.opponentSpellsData.heal.cooldownProgress}`
            );
        } else {
            // create static image for opponent freeze button
            const staticOpponentHealButton = this.add.image(100, 810, 'heal-button-locked')
                .setOrigin(0.5)
                .setScale(0.6);
        }
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
            }).setOrigin(0.5).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneOpponentTurnMsg);
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
                    ease: 'Back.easeIn',
                    onComplete: () => {
                        this.checkOpponentForSpellCast();
                    }

                }
            ]
        });
    }

    private addOpponentMonstersLeftText() {
        this.opponentMonstersLeftText = this.add.text(
            200,
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

    // region HANDLERS
    private checkEndTurnHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, (skipByUser: boolean = false) => {

            if (this.levelFinished) {
                return;
            }

            if (this.currentlySelectedMonster?.unitData.movesLeft > 0 && this.currentlySelectedMonster.frozenForDuration === 0) {

                if (this.data.list.isPlayerTurn) {
                    this.currentlySelectedMonster.pendingAction = true;
                    // this.checkNextTurn(skipByUser);
                } else {
                    this.currentlySelectedMonster.pendingAction = true;
                    // this.checkNextTurn(skipByUser);
                }

            } else if (this.currentlySelectedMonster) {
                this.currentlySelectedMonster.setAlpha(0.7);
                // this.checkNextTurn(skipByUser);
            }
            else {
                if (!this.data.list.isPlayerTurn) {
                    // this.addInteraction();
                    // this.getRandomOpponentMonster();
                    this.checkOpponentForSpellCast();
                    return;
                }
                else {
                    // case: all player monsters are frozen, let player use spells and end turn manually
                    console.warn("NO currentlySelectedMonster");
                    this.updatePlayerSpellButtonsInteraction();
                    this.endTurnButton.setInteractive();
                    return;
                    // throw Error("NO currentlySelectedMonster")
                }
            }

            this.checkNextTurn(skipByUser);
        })
        this.addInteraction();
    }

    private skipButtonHandler(): void {
        this.skipButton = new Button(this, 1820, 80, 'button', 'skip\nmove', this.onSkip.bind(this), true, 1);
        this.input.keyboard!.on('keydown-SPACE', () => {
            if (this.data.list.isPlayerTurn && this.skipButton.enabled) {
                console.log('Skipped with Space');
                this.onSkip();
            }
        });
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
            this.updatePlayerSpellButtonsInteraction();

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
            delete this.data.list.gridPositions[currentData.row][currentData.col].giantData;
            if (this.currentlySelectedMonster.isGiant) {
                delete this.data.list.gridPositions[currentData.row][currentData.col + 1].occupiedBy;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col].occupiedBy;
                delete this.data.list.gridPositions[currentData.row + 1][currentData.col + 1].occupiedBy;
                this.data.list.gridPositions[currentData.row][currentData.col + 1].isEmpty = true;
                this.data.list.gridPositions[currentData.row + 1][currentData.col].isEmpty = true;
                this.data.list.gridPositions[currentData.row + 1][currentData.col + 1].isEmpty = true;

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

            if (isPlayerTurn && this.playerMagicBallButton?.readyForUse) {
                this.playerMagicBallButton.disableInteractive();
            }
            if (isPlayerTurn && this.playerPoisonButton?.readyForUse) {
                this.playerPoisonButton.disableInteractive();
            }
            if (isPlayerTurn && this.playerRainOfArrowsButton?.readyForUse) {
                this.playerRainOfArrowsButton.disableInteractive();
            }
            if (isPlayerTurn && this.playerFreezeButton?.readyForUse) {
                this.playerFreezeButton.disableInteractive();
            }
            if (isPlayerTurn && this.playerHealButton?.readyForUse) {
                this.playerHealButton.disableInteractive();
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
            let additionalDamage = 0;

            if (this.currentlySelectedMonster.unitData.ranged > 0) {
                damage = this.currentlySelectedMonster.unitData.ranged + this.currentlySelectedMonster.additionalRangedDamage;
            } else if (this.currentlySelectedMonster.unitData.magic > 0) {
                if (+this.currentlySelectedMonster.type === 3) {
                    // monster N3 special skill
                    additionalDamage = this.movementArrowsContainer.getNeighborCells(
                        this.currentlySelectedMonster.unitData.row,
                        this.currentlySelectedMonster.unitData.col,
                        1,
                        0,
                        1
                    ).filter(enc => enc.isTargetMagicMonster).length;
                }
                damage = this.currentlySelectedMonster.unitData.magic + additionalDamage;
            } else {
                if (+this.currentlySelectedMonster.type === 8) {
                    // monster N8 special skill
                    additionalDamage = this.currentlySelectedMonster.additionaMelee;
                }
                damage = this.currentlySelectedMonster.unitData.melee + additionalDamage;
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
                if (+this.currentlySelectedMonster.type === 7) {
                    // monster N7 special
                    const useFreezeSkill = Phaser.Math.RND.between(1, 100) <= 25; // 25% chance to freeze
                    if (useFreezeSkill) {
                        target.setFrozen(1, () => { });
                    }
                }
                target!.takeDamege(damage, this.currentlySelectedMonster.unitData.magic > 0);
            });


            if (isPlayerTurn) {
                this.pauseResumeInteraction(false);
            }
            else {
                //TODO - repeat // ?????????
            }

            if (isPlayerTurn && this.playerMagicBallButton?.readyForUse) {
                this.playerMagicBallButton.disableInteractive();
            }

            if (isPlayerTurn && this.playerPoisonButton?.readyForUse) {
                this.playerMagicBallButton.disableInteractive();
            }
        });
    }

    private buffBombExplodeHandler() {
        this.events.on(GAME_SCENE_SCENE_EVENTS.BUFF_BOMB_EXPLODE, (data: number[]) => {

            const row = data[0];
            const col = data[1];
            if (this.data.list.gridPositions[row][col].buff?.buffContainer) {
                this.data.list.gridPositions[row][col].buff?.buffContainer.destroy(true);
            }
            delete this.data.list.gridPositions[row][col].buff;
            this.activeExplodePositions++;

            let anyMonsterDiesFromTheExplosion = false;
            let nextBuffBomb: number[][] = [];

            let newRow = NaN;
            let newCol = NaN;

            const isValidPosition = (r: number, c: number): boolean => {
                return r >= 0 && r < 7 && c >= 0 && c < 12;
            }

            const explode = (r: number, c: number, isCenter: boolean) => {
                const { x, y } = this.data.list.gridPositions[r][c];
                let explodeImage = this.add.image(x + this.mainGridContainer.x, y + this.mainGridContainer.y, 'boom').setScale(1).setOrigin(0.5).setDepth(GAME_OBJECT_DEPTHS.gameSceneExplodeImage);
                this.tweens.chain({
                    tweens: [
                        {
                            targets: explodeImage,
                            scale: explodeImage.scale * 1.1,
                            yoyo: true,
                            duration: 150
                        },
                        {
                            targets: explodeImage,
                            alpha: 0,
                            duration: 700,
                            onComplete: () => {
                                if (isCenter) {
                                    // central position decreases activeExplodePositions and if 0 -all explosions done, so emit
                                    this.activeExplodePositions--;
                                    if (this.activeExplodePositions === 0) {
                                        this.time.delayedCall(anyMonsterDiesFromTheExplosion ? 2100 : 1100, () => {
                                            console.log(`%c ${this.activeExplodePositions}`, "background: blue");
                                            this.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                                        })


                                    }
                                }
                                explodeImage.destroy(true);
                            }
                        }
                    ]
                })
            }

            const findMonster = (r: number, c: number): Monster | undefined => {
                const position = this.data.list.gridPositions[newRow][newCol];
                const isPlayer = position.occupiedBy === 'player';
                const isOpponent = position.occupiedBy === 'opponent';
                const isBombBuff = position.buff?.buffType === 'bomb';
                const giantData = position.giantData;

                //TODO... CHECK IF GIANT !!!!!!!
                if (isPlayer) {
                    return this.data.list.playerMonsters.find((x: Monster) => x !== null && x.unitData.row === r && x.unitData.col === c);
                } else if (isOpponent) {
                    if (giantData) {
                        return this.data.list.opponentMonsters.find((x: Monster) => x !== null && x.unitData.row === giantData.row && x.unitData.col === giantData.col);
                    }
                    return this.data.list.opponentMonsters.find((x: Monster) => x !== null && x.unitData.row === r && x.unitData.col === c);
                } else if (isBombBuff) {
                    nextBuffBomb.push([newRow, newCol]);
                } else {
                    return undefined;
                }
            }

            const proceed = (r: number, c: number, isCenter: boolean = false) => {
                if (isValidPosition(r, c)) {
                    explode(r, c, isCenter);
                    const monster = findMonster(r, c);
                    if (monster) {
                        if (monster.takeDamege(isCenter ? 2 : 1, false, true, false, 0)) anyMonsterDiesFromTheExplosion = true;
                    }
                }
            }

            // left up
            newRow = row - 1;
            newCol = col - 1;
            proceed(newRow, newCol);

            // up
            newRow = row - 1;
            newCol = col;
            proceed(newRow, newCol);

            // up right
            newRow = row - 1;
            newCol = col + 1;
            proceed(newRow, newCol);

            // left
            newRow = row;
            newCol = col - 1;
            proceed(newRow, newCol);

            // center
            newRow = row;
            newCol = col;
            proceed(newRow, newCol, true);

            // right
            newRow = row;
            newCol = col + 1;
            proceed(newRow, newCol);

            // left down
            newRow = row + 1;
            newCol = col - 1;
            proceed(newRow, newCol);

            // down
            newRow = row + 1;
            newCol = col;
            proceed(newRow, newCol);

            // down right
            newRow = row + 1;
            newCol = col + 1;
            proceed(newRow, newCol);

            if (nextBuffBomb.length) {
                // chain explosion
                this.time.delayedCall(500, () => {
                    nextBuffBomb.forEach((element: number[], index: number) => {
                        if (this.data.list.gridPositions[element[0]][element[1]].buff) {
                            this.events.emit(GAME_SCENE_SCENE_EVENTS.BUFF_BOMB_EXPLODE, element);
                        }
                    });

                })
            }
        })
    }

    private monsterDieHandler(): void {
        this.events.on(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, (data: (Monster | IUnitData)[]) => {

            const monster = data[0] as Monster;
            const unitData = data[1];

            this.checkSpecificMonsterSkillOnMonsterDie(monster);

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


                this.levelFinished = true;////////////////////////////////// ??????


                this.createLevelOutroPopup();
            } else {
                this.checkMapVisibility(false);
            }
        });
    }

    private checkSpecificMonsterSkillOnMonsterDie(killedMonster: Monster) {

        /**below may not apply if a monster died from bomb-buff dmg - TODO - check this scenario */

        // monster 1 special skill 
        if (+killedMonster.type === 5) {
            const monsters = killedMonster.isPlayerMonster ? this.data.list.opponentMonsters : this.data.list.playerMonsters;
            monsters
                .filter((m: Monster) => m && +m.type === 1 && m.unitData.moves < main_config.maxMonsterMovesPerRound && m.unitData.movesLeft < main_config.maxMonsterMovesPerRound)
                .forEach((fm: Monster) => {
                    fm.addMove();
                    fm.addBUffCollected(fm.unitData.row, fm.unitData.col, 1, BUFF_TYPES.GREEN_DOT);
                });
        }

        // monster 5 special skill 
        if (+killedMonster.type === 1) {
            const monsters = killedMonster.isPlayerMonster ? this.data.list.opponentMonsters : this.data.list.playerMonsters;
            monsters
                .filter((m: Monster) => m && +m.type === 5 && m.unitData.moves < main_config.maxMonsterMovesPerRound && m.unitData.movesLeft < main_config.maxMonsterMovesPerRound)
                .forEach((fm: Monster) => {
                    fm.addMove();
                    fm.addBUffCollected(fm.unitData.row, fm.unitData.col, 1, BUFF_TYPES.GREEN_DOT);
                });
        }

        // monster 6 special skill 
        if (+this.currentlySelectedMonster?.type === 6 && this.currentlySelectedMonster?.unitData.movesLeft > 0) {
            const additionalRangedDamage = Math.ceil(this.currentlySelectedMonster.unitData.ranged * 0.5);
            this.currentlySelectedMonster.additionalRangedDamage = additionalRangedDamage;
            this.currentlySelectedMonster.updateRangedDamageText();
        }

        // monster 9 special skill 
        const monsters = this.data.list.isPlayerTurn ? this.data.list.playerMonsters : this.data.list.opponentMonsters;
        monsters
            .filter((m: Monster) => m && +m.type === 9 && m.unitData.moves < main_config.maxMonsterMovesPerRound && m.unitData.movesLeft < main_config.maxMonsterMovesPerRound)
            .forEach((fm: Monster) => {
                fm.addMove(true);
                fm.addBUffCollected(fm.unitData.row, fm.unitData.col, 1, BUFF_TYPES.GREEN_DOT);
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
        let gemReward = hasGemReward ? 1 : 0;
        let hasKeyReward = false;
        let keyReward = 0;
        let hasCommonPacks = false;
        let commonPacks = 0;
        let hasSilverPacks = false;
        let silverPacks = 0;
        let hasGoldPacks = false;
        let goldPacks = 0;
        let monstersReward = undefined;
        console.log(this.isGiantFightLevel);

        // MODIFY DATA IF LEVEL WAS DEFEAT GIANTS LEVEL
        if (this.isGiantFightLevel) {
            const currentDefeatGiantsLevel = LOCAL_STORAGE_MANAGER.get('defeatGiantsLevel')
            currentLevelData = defeat_giants_level_config[currentDefeatGiantsLevel! - 1];
            isFirstTimeReward = true;
            monstersReward = currentLevelData!.monstersReward;
            hasMonsterReweard = monstersReward.length > 0;
            hasGemReward = currentLevelData.gemsReward > 0;
            gemReward = currentLevelData.gemsReward;
        }
        // MODIFY DATA IF LEVEL WAS SURVIVAL LEVEL AND WAS WON BY KILLING MONSTERS IN ADVANCE
        const monstersSpawned = this.data.list.opponentMonsters.length;
        if (levelWon && this.isSurvivalLevel && monstersSpawned < (this.survivalTotalMonstersCount as number)) {
            const unspawnedMonstersCount = (this.survivalLevelData.totalMonstersCount as number) - monstersSpawned;
            const data: ISurvivalLevelWonInAdvanceData = this.getSurvivalLevelWonInAdvanceData(unspawnedMonstersCount);
            gemReward = data.gems;
            hasGemReward = data.gems > 0;
            hasMonsterReweard = false;
            keyReward = data.keys;
            hasKeyReward = data.keys > 0;
            commonPacks = data.commonPacks;
            hasCommonPacks = data.commonPacks > 0;
            silverPacks = data.silverPacks;
            hasSilverPacks = data.silverPacks > 0;
            goldPacks = data.goldPacks;
            hasGoldPacks = data.goldPacks > 0;

            this.survivalLevelReward = (this.survivalLevelData.totalMonstersCount as number) * (this.survivalLevelData.rewardPerKill as number);
        }

        // UPDATE LEVELS WON(LOCAL STORAGE) -- bug fixed - update only if level won!
        // THERE COULD BE PROBLEMS WHEN CHANGING WORLDS!!!!!!!
        const levelsWon: any = LOCAL_STORAGE_MANAGER.get('levelsWon');
        if (!levelsWon.includes(+(currentLevelData.levelName as number)) && levelWon) {
            levelsWon.push(+(currentLevelData.levelName as number));
            LOCAL_STORAGE_MANAGER.set('levelsWon', levelsWon);
        }

        // BG OVERLAY
        let overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneBGOverlay);
        this.tweens.add({
            targets: overlay,
            duration: 200,
            alpha: 0.85
        })

        // overlay.setInteractive();
        // overlay.on('pointerdown', function (pointer: any) {
        //     pointer.event.stopPropagation();
        // });

        this.add.existing(overlay);
        overlay.setInteractive();
        overlay.on('pointerdown', function (pointer: any) {
            pointer.event.stopPropagation();
        });

        // HEADER
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
                }).setOrigin(0.5).setDepth(GAME_OBJECT_DEPTHS.gameSceneHeaderLevelText);
        }

        const rewardsContainer = new Phaser.GameObjects.Container(this, 0, 0).setDepth(GAME_OBJECT_DEPTHS.gameSceneRewardsContainer);
        this.add.existing(rewardsContainer);

        if (levelWon || this.isSurvivalLevel) {
            // REWARD TEXT
            const rewardtext: Phaser.GameObjects.Text = this.add.text(
                0,
                500,
                'REWARDS: ',
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5, 0.5).setDepth(GAME_OBJECT_DEPTHS.gameSceneRewardText);
            rewardsContainer.add(rewardtext);

            // COIN IMAGE
            let coin = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + 20, 500, 'coin').setOrigin(0, 0.5).setScale(0.5);
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

            // DETERMINE MONSTER TYPE AND STARS
            // TODO - add more options in config - main_config.afterLevelMonsterReward
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

            // MONSTER CARD REWARD
            if (hasMonsterReweard) {
                monsterSize = 150;
                monsterPadding = 40;
                const newMonsterConfig = getMonsterDataConfig(+monsterRewardType, monsterRewardStars - 1);
                const monster = new Monster(this, cointext.x + cointext.displayWidth + monsterSize / 2 + monsterPadding, 500, monsterSize, monsterSize, newMonsterConfig, 0, true)
                monster.starsContainer.x = monsterSize / -4 + 18;
                monster.movesLeftContainer.x = monsterSize / 2 + 21;
                rewardsContainer.add(monster);
            }


            // GEM REWARD
            let gem;
            let gemPadding = 0;
            if (hasGemReward) {

                gemPadding = 20;
                gem = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + gemPadding, 500, 'gem').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(gem);
            }

            // GEM COUNT
            let gemstext;
            if (hasGemReward) {
                gemstext = this.add.text(
                    gem!.x + gem!.displayWidth,
                    500,
                    `x${gemReward}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(gemstext);
            }

            // KEY REWARD
            let key;
            let keyPadding = 0;
            if (hasKeyReward) {
                keyPadding = 20;
                key = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + keyPadding, 500, 'key').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(key);
            }

            // KEY COUNT
            let keystext;
            if (hasKeyReward) {
                keystext = this.add.text(
                    key!.x + key!.displayWidth,
                    500,
                    `x${keyReward}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(keystext);
            }

            // COMMON PACK REWARD
            let commonPack;
            let commonPacksPadding = 0;
            if (hasCommonPacks) {
                commonPacksPadding = 20;
                commonPack = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + commonPacksPadding, 500, 'common-pack').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(commonPack);
            }

            // COMMON PACK COUNT
            let commonPackstext;
            if (hasCommonPacks) {
                commonPackstext = this.add.text(
                    commonPack!.x + commonPack!.displayWidth,
                    500,
                    `x${commonPacks}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(commonPackstext);
            }

            // SILVER PACK REWARD
            let silverPack;
            let silverPacksPadding = 0;
            if (hasSilverPacks) {
                silverPacksPadding = 20;
                silverPack = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + silverPacksPadding, 500, 'silver-pack').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(silverPack);
            }

            // SILVER PACK COUNT
            let silverPackstext;
            if (hasSilverPacks) {
                silverPackstext = this.add.text(
                    silverPack!.x + silverPack!.displayWidth,
                    500,
                    `x${silverPacks}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(silverPackstext);
            }

            // GOLD PACK REWARD
            let goldPack;
            let goldPacksPadding = 0;
            if (hasGoldPacks) {
                goldPacksPadding = 20;
                goldPack = this.add.image(rewardsContainer.getBounds().x + rewardsContainer.getBounds().width + goldPacksPadding, 500, 'gold-pack').setScale(0.2).setOrigin(0, 0.5);
                rewardsContainer.add(goldPack);
            }

            // GOLD PACK COUNT
            let goldPackstext;
            if (hasGoldPacks) {
                goldPackstext = this.add.text(
                    goldPack!.x + goldPack!.displayWidth,
                    500,
                    `x${goldPacks}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 65, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                rewardsContainer.add(goldPackstext);
            }

            // CENTER REWARD CONTAINER
            const totalWidth =
                rewardtext.displayWidth / 2
                + coin.displayWidth
                + cointext.displayWidth

                + monsterPadding
                + monsterSize

                + gemPadding
                + (gem?.displayWidth || 0)
                + (gemstext?.displayWidth || 0)

                + commonPacksPadding
                + (commonPack?.displayWidth || 0)
                + (commonPackstext?.displayWidth || 0)

                + silverPacksPadding
                + (silverPack?.displayWidth || 0)
                + (silverPackstext?.displayWidth || 0)

                + goldPacksPadding
                + (goldPack?.displayWidth || 0)
                + (goldPackstext?.displayWidth || 0);

            rewardsContainer.x = 960 - totalWidth / 2;
            // if (rewardtext.displayWidth + totalWidth > 1850) {
            //     rewardsContainer.scale = 1850 / (rewardtext.displayWidth + totalWidth);
            // }

            // PARTICLES
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

            // CLAIM BUTTON
            const claimButton = new Button(this, 960, 700, 'claim', null, () => {
                emitParticles = false;

                // UPDATE PLAYER COINS(LOCALE STORAGE) 
                const playerCoins = (LOCAL_STORAGE_MANAGER.get('coins') as number);
                LOCAL_STORAGE_MANAGER.set('coins', +playerCoins + +(coinsWon as number));

                // UPDATE PLAYER GEMS(LOCALE STORAGE) 
                if (hasGemReward) {
                    const playerGems = (LOCAL_STORAGE_MANAGER.get('gems') as number);
                    LOCAL_STORAGE_MANAGER.set('gems', +playerGems + gemReward);
                }

                // UPDATE PLAYER KEYS(LOCALE STORAGE) 
                if (hasKeyReward) {
                    const playerKeys = (LOCAL_STORAGE_MANAGER.get('keys') as number);
                    LOCAL_STORAGE_MANAGER.set('keys', +playerKeys + keyReward);
                }

                // UPDATE PLAYER COMMON PACKS(LOCALE STORAGE) 
                if (hasCommonPacks) {
                    const playerCommonPacks = (LOCAL_STORAGE_MANAGER.get('freeCommonPacks') as number);
                    LOCAL_STORAGE_MANAGER.set('freeCommonPacks', +playerCommonPacks + commonPacks);
                }

                // UPDATE PLAYER SILVER PACKS(LOCALE STORAGE) 
                if (hasSilverPacks) {
                    const playerSilverPacks = (LOCAL_STORAGE_MANAGER.get('freeSilverPacks') as number);
                    LOCAL_STORAGE_MANAGER.set('freeSilverPacks', +playerSilverPacks + silverPacks);
                }

                // UPDATE PLAYER GOLD PACKS(LOCALE STORAGE) 
                if (hasGoldPacks) {
                    const playerGoldPacks = (LOCAL_STORAGE_MANAGER.get('freeGoldPacks') as number);
                    LOCAL_STORAGE_MANAGER.set('freeGoldPacks', +playerGoldPacks + goldPacks);
                }

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

            }).setDepth(GAME_OBJECT_DEPTHS.gameSceneClaimButton);
        } else {

            // DISABLE ALL AFTER PLAYER HAS GIVEN UP
            this.data.list.playerMonsters.forEach((m: Monster) => {
                if (m) {
                    m.pendingAction = false;
                    m.disableInteractive();
                    this.movementArrowsContainer.removeArrows();
                }
            });

            // TRY AGAIN BUTTON
            const tryAgain = new Button(this, 760, 700, 'button', 'try\nagain', () => {
                this.changeScene('Game');
            }, false).setDepth(GAME_OBJECT_DEPTHS.gameSceneTryAgainButton);

            // GIVE UP BUTTON
            const giveUp = new Button(this, 1160, 700, 'button', 'give\nup', () => {
                this.changeScene('MainMenu');
            }).setDepth(GAME_OBJECT_DEPTHS.gameSceneGiveUpButton)
        }
    }

    private getSurvivalLevelWonInAdvanceData(unspawnedMonstersCount: number): ISurvivalLevelWonInAdvanceData {
        let survivalLevelWonInAdvanceData: ISurvivalLevelWonInAdvanceData = {
            gems: 0,
            keys: 0,
            commonPacks: 0,
            silverPacks: 0,
            goldPacks: 0,
            token1: 0,
            token2: 0,
            token3: 0,
            token4: 0,
            token5: 0,
        }

        for (let index = 0; index < unspawnedMonstersCount; index++) {

            let rnd = Phaser.Math.RND.between(1, 1000);
            if (rnd > main_config.chanceToDropGem) survivalLevelWonInAdvanceData.gems++;

            rnd = Phaser.Math.RND.between(1, 1000);
            if (rnd > main_config.chanceToDropKey) survivalLevelWonInAdvanceData.keys++;

            rnd = Phaser.Math.RND.between(1, 1000);
            if (rnd > main_config.chanceToDropToken) {
                const randomToken = Phaser.Math.RND.between(1, 5);
                switch (randomToken) {
                    case 1:
                        survivalLevelWonInAdvanceData.token1++;
                        break;
                    case 2:
                        survivalLevelWonInAdvanceData.token2++;
                        break;
                    case 3:
                        survivalLevelWonInAdvanceData.token3++;
                        break;
                    case 4:
                        survivalLevelWonInAdvanceData.token4++;
                        break;
                    case 5:
                        survivalLevelWonInAdvanceData.token5++;
                        break;
                    default:
                        break;
                }
            }

            rnd = Phaser.Math.RND.between(1, 1000);
            if (rnd > main_config.chanceToDropPack[2]) {
                survivalLevelWonInAdvanceData.goldPacks++;
            } else if (rnd > main_config.chanceToDropPack[1]) {
                survivalLevelWonInAdvanceData.silverPacks++;
            } else if (rnd > main_config.chanceToDropPack[0]) {
                survivalLevelWonInAdvanceData.commonPacks++;
            }
        }

        return survivalLevelWonInAdvanceData;
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
            }).setDepth(GAME_OBJECT_DEPTHS.gameSceneConfettiEmitter)
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
        }).setDepth(GAME_OBJECT_DEPTHS.gameSceneLevelWonParticleEmitter)
        emitter.explode(55);
        emitter.once('complete', () => {
            emitter.destroy();
            console.log('Emitter destroyed');
        });
    }

    private monsterNotClaimedPopup() {
        const overlay = this.add.image(0, 0, 'black-overlay').setScale(192, 108).setOrigin(0).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneMonsterNotClaimedPopup);
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
        ).setOrigin(0.5).setAlpha(0).setDepth(GAME_OBJECT_DEPTHS.gameSceneMonsterNotClaimedMsg);
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
        //  TODO - OBSERVE IF COMMENTING THIS OUT CAUSED ANY ISSUES
        // if (this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.movesLeft === 0) {
        //     this.currentlySelectedMonster.unitData.movesLeft = this.currentlySelectedMonster.unitData.moves;
        // }
    }

    private changeBulbIndicators(isPlayerTurn: boolean) {
        this.playerBulb.setAlpha(isPlayerTurn ? 1 : 0.4);
        this.opponentBulb.setAlpha(isPlayerTurn ? 0.4 : 1);
    }

    private checkShouldAddBuffs() {
        // test 
        // return true
        return Phaser.Math.RND.between(0, 100) <= main_config.buffs.chanceForBuffAfterRound;
    }

    // special for monster N3
    private updateAdditionalMagicDamage() {

        const grid = this.data.list.gridPositions;

        const updateMagicText = (
            monsters: Monster[],
            enemyMonsters: Monster[],
            occupiedBy: 'player' | 'opponent'
        ) => {
            monsters
                .filter(monster => monster && Number(monster.type) === 3)
                .forEach(monster => {
                    let bonusMagic = 0;

                    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                        for (let colOffset = -1; colOffset <= 1; colOffset++) {
                            if (rowOffset === 0 && colOffset === 0) continue;

                            const row = monster.unitData.row + rowOffset;
                            const col = monster.unitData.col + colOffset;

                            if (
                                row < 0 ||
                                row >= grid.length ||
                                col < 0 ||
                                col >= grid[0].length
                            ) {
                                continue;
                            }

                            if (grid[row][col].occupiedBy !== occupiedBy) {
                                continue;
                            }

                            const neighbour = enemyMonsters.find(
                                m =>
                                    m &&
                                    m.unitData.row === row &&
                                    m.unitData.col === col
                            );

                            if (neighbour?.unitData.magic > 0) {
                                bonusMagic++;
                            }
                        }
                    }

                    monster.magic_text.setText(
                        String(monster.unitData.magic + bonusMagic)
                    );
                });
        };

        updateMagicText(
            this.data.list.playerMonsters,
            this.data.list.opponentMonsters,
            'opponent'
        );

        updateMagicText(
            this.data.list.opponentMonsters,
            this.data.list.playerMonsters,
            'player'
        );
    }

    private checkNextTurn(skipByUser: boolean, forceEndTurn: boolean = false): void {
        this.updateAdditionalMagicDamage();
        let turnEnd = false;
        if (forceEndTurn) {
            // end turn immediatelly
            turnEnd = true;
        } else if (this.data.list.isPlayerTurn) {
            const allPlayerMonstersFrozen = this.data.list.playerMonsters
                .filter((m: Monster | null) => m !== null)
                .every((fm: Monster) => fm.frozenForDuration > 0);
            if (allPlayerMonstersFrozen) {
                /**
                 * all player monsters are frozen. do not end turn now, so player 
                 * can use spells and then end turn manually
                 */
                turnEnd = false;
                this.endTurnButton.setInteractive();
            } else {
                turnEnd = this.data.list.playerMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
            }
        }
        else {
            turnEnd = this.data.list.opponentMonsters.filter((m: Monster | null) => m !== null && m.pendingAction === true).length === 0;
        }

        if (turnEnd) {

            if (!this.data.list.isPlayerTurn) {
                // ROUND ENDED
                this.events.emit(GAME_SCENE_SCENE_EVENTS.ROUND_END);
            }

            this.endTurnButton.disableInteractive();
            this.skipButton.disableInteractive();
            this.giveUpButton.disableInteractive();

            this.activeExplodePositions = 0;
            this.data.list.isPlayerTurn = !this.data.list.isPlayerTurn;
            // this.changeBulbIndicators(this.data.list.isPlayerTurn);

            this.pauseResumeInteraction(false);
            // this.updatePlayerSpellButtonsInteraction();
            this.updateFrozenMonsters();

            if (this.data.list.isPlayerTurn) {
                // player turn starts
                this.updateSpellLevelsOnTurnEnd();
                this.applyPoison(() => {
                    if (this.checkShouldAddBuffs()) {
                        console.log('checkShouldAddBuffs')
                        this.addBuffs(1);
                    } else {
                        this.addInteraction();
                    }
                })
            } else {
                // opponent turn starts 
                this.skipButton.disableInteractive();
                this.time.delayedCall(10, () => {
                    //this delay is needed to fix skip button action callback setting the currentlySelectedMonster to interactive...
                    if (this.currentlySelectedMonster) {
                        this.currentlySelectedMonster.setInteraction(false);
                        this.currentlySelectedMonster = null;
                    }
                    // this.checkOpponentForSpellCast();
                })
                this.movementArrowsContainer.removeArrows();
                this.currentlySelectedMonsterAnimation!.pause().hide();
                this.applyPoison(() => {
                    console.log('showOpponentTurnMsg')
                    if (this.levelFinished) {
                        return;
                    }
                    console.log('showOpponentTurnMsg2')
                    this.showOpponentTurnMsg();
                })
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
                this.cloudsContainer.add(cloud).setDepth(GAME_OBJECT_DEPTHS.gameSceneCloudsContainer);
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

        // //test
        // if (!this.data.list.isPlayerTurn) {

        //     this.newMagicBallSpell();
        // }


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
            // this.showOpponentTurnMsg();
            if (this.isSurvivalLevel) {
                this.addNewSurvivalLevelMonsters();
            }
            this.data.list.opponentMonsters.forEach((monster: Monster) => {
                if (monster) {
                    console.log(monster);
                    console.log(monster.unitData.row);
                    console.log(monster.unitData.movesLeft);
                    console.log(monster.pendingAction);

                    monster.resetMoves();
                }
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
                if (monster.unitData.movesLeft === 0) {
                    monster.pendingAction = false;
                } else {
                    monster.pendingAction = monster.frozenForDuration === 0 && !this.data.list.isPlayerTurn;
                }
                if (monster.bg.input) {
                    console.log('opponent monster set to interactive. row' + monster.unitData.row + 'col' + monster.unitData.col);
                }
                monster.setInteraction(false);// fix for untracked bug where random opponent monster gets selectible!!!
            }
        });


        //test
        this.data.list.opponentMonsters.forEach((monster: Monster, i: number) => {
            if (monster) {
                console.log(`opponent monster at  index ${i} is enabled => ${monster.bg.input}`);
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

    // called after every player action(select direction or attack)and after every player move
    private pauseResumeInteraction(resume: boolean, skipByUser: boolean = false): void {

        if (!resume) {
            this.skipButton.disableInteractive();
            this.endTurnButton.disableInteractive();
        } else {
            // this.skipButton.setInteractive().setAlpha(1);
        }

        this.data.list.playerMonsters.forEach((monster: Monster, index: number) => {
            if (monster && monster.frozenForDuration === 0) { //  && monster.pendingAction
                console.log(index)
                monster.setInteraction(resume && monster.pendingAction, skipByUser);
            }
        });

        //monster has no more moves or just died(from buff bomb for example)
        if ((resume && this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.movesLeft === 0) || (this.currentlySelectedMonster && this.currentlySelectedMonster.unitData.health === 0)) {
            this.autoSelectRandomPlayerMonster();
        }
        else if (resume && this.currentlySelectedMonster.unitData.movesLeft > 0) {
            this.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this.currentlySelectedMonster, this.currentlySelectedMonster.unitData, false]);
        }

        this.updatePlayerSpellButtonsInteraction();
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
                //TODO - check if giant is present in a survival level - there will be bugs
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


                        // reveal the whole giant monster
                        const giantData = array[newRow][newCol].giantData
                        if (giantData) {
                            const giantMainRow = giantData.row;
                            const giantMainCol = giantData.col;
                            visibleCells.push({ row: giantMainRow, col: giantMainCol, occupiedBy });
                            visibleCells.push({ row: giantMainRow, col: giantMainCol + 1, occupiedBy });
                            visibleCells.push({ row: giantMainRow + 1, col: giantMainCol, occupiedBy });
                            visibleCells.push({ row: giantMainRow + 1, col: giantMainCol + 1, occupiedBy });

                        }
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

        console.log(opponentMonsters);

        if (opponentMonsters.length === 0) {
            // CASE: if opponent has only 1 monster and it is frozen
            this.checkNextTurn(false);
            return;
        }

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
        console.log(this.data.list.gridPositions);
        console.log(`%c CURRENT GIANT IS AT ${currentUnitData.row} ${currentUnitData.col}`, "background: grey");
        //UP
        row = currentUnitData.row - 1;
        col = currentUnitData.col;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1))) {
            console.log(`%c GIANT CAN MOVE UP ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //UP RIGHT
        row = currentUnitData.row - 1;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2))) {
            console.log(`%c GIANT CAN MOVE UP RIGHT ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //RIGHT
        row = currentUnitData.row;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2))) {
            console.log(`%c GIANT CAN MOVE RIGHT ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //RIGHT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col + 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 2) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col + 2))) {
            console.log(`%c GIANT CAN MOVE RIGHT DOWN ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col + 1))) {
            console.log(`%c GIANT CAN MOVE DOWN ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //LEFT DOWN
        row = currentUnitData.row + 1;
        col = currentUnitData.col - 1;
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col))) {
            console.log(`%c GIANT CAN MOVE LEFT DOWN ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //LEFT
        row = currentUnitData.row;
        col = currentUnitData.col - 1;

        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1))) {
            console.log(`%c GIANT CAN MOVE LEFT ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
            return true;
        }

        //UP LEFT
        row = currentUnitData.row - 1;
        col = currentUnitData.col - 1;

        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row - 1, currentUnitData.col))) {
            console.log(`%c GIANT CAN MOVE UP LEFT ${row} ${col}`, "background: red");
            return true;
        } else if (!this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(row, col)) {
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
        if ((this.currentlySelectedMonster.unitData.isGiant && this.isCellEmpty(currentUnitData.row + 1, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col - 1) && this.isCellEmpty(currentUnitData.row + 2, currentUnitData.col))) {
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

    private checkOpponentForSpellCast() {
        if (
            // check magic ball
            this.opponentSpellsData &&
            this.opponentSpellsData.magicBall &&
            this.opponentSpellsData.magicBall.cooldownProgress === this.opponentSpellsData.magicBall.cooldown
        ) {
            this.opponentSpellsData.magicBall.cooldownProgress = 0;
            this.newMagicBallSpell(this.opponentSpellsData.magicBall.cooldown);
        } else if (
            // check poison
            this.opponentSpellsData &&
            this.opponentSpellsData.poison &&
            this.opponentSpellsData.poison.cooldownProgress === this.opponentSpellsData.poison.cooldown
        ) {
            this.opponentSpellsData.poison.cooldownProgress = 0;
            this.newPoisonSpell(this.opponentSpellsData.poison.cooldown);
        } else if (
            // check rain of arrows
            this.opponentSpellsData &&
            this.opponentSpellsData.rainOfArrows &&
            this.opponentSpellsData.rainOfArrows.cooldownProgress === this.opponentSpellsData.rainOfArrows.cooldown
        ) {
            this.opponentSpellsData.rainOfArrows.cooldownProgress = 0;
            this.newRainOfArrowsSpell(this.opponentSpellsData.rainOfArrows.cooldown);
        } else if (
            // check freeze
            this.opponentSpellsData &&
            this.opponentSpellsData.freeze &&
            this.opponentSpellsData.freeze.cooldownProgress === this.opponentSpellsData.freeze.cooldown
        ) {
            this.opponentSpellsData.freeze.cooldownProgress = 0;
            this.newFreezeSpell(this.opponentSpellsData.freeze.cooldown);
        } else if (
            // check heal
            this.opponentSpellsData &&
            this.opponentSpellsData.heal &&
            this.opponentSpellsData.heal.cooldownProgress === this.opponentSpellsData.heal.cooldown
        ) {
            this.opponentSpellsData.heal.cooldownProgress = 0;
            this.newHealSpell(this.opponentSpellsData.heal.cooldown);
        } else {
            this.addInteraction();
            this.getRandomOpponentMonster();
        }
    }

    // region SPELLS
    private newMagicBallSpell(cooldown: number) {
        const button = this.data.list.isPlayerTurn ? this.playerMagicBallButton : this.opponentMagicBallButton;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });
            new MagicBallSpell(
                this,
                this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.magicBall : this.opponentSpellsData.magicBall
            );

            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
                this.updatePlayerSpellButtonsInteraction();
            })
        })
    }

    private newPoisonSpell(cooldown: number) {
        const button = this.data.list.isPlayerTurn ? this.playerPoisonButton : this.opponentPoisonButton;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });
            new PoisonSpell(
                this,
                this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.poison : this.opponentSpellsData.poison

            );

            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
            })
        })
    }

    private newRainOfArrowsSpell(cooldown: number) {
        const button = this.data.list.isPlayerTurn ? this.playerRainOfArrowsButton : this.opponentRainOfArrowsButton;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });

            new RainOfArrowsSpell(
                this,
                this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.rainOfArrows : this.opponentSpellsData.rainOfArrows
            );

            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
            })
        })
    }

    private newFreezeSpell(cooldown: number) {
        const button = this.data.list.isPlayerTurn ? this.playerFreezeButton : this.opponentFreezeButton;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });

            new FreezeSpell(
                this,
                this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.opponentMonsters : this.data.list.playerMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.freeze : this.opponentSpellsData.freeze

            );

            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
                this.updatePlayerSpellButtonsInteraction();
            })
        })
    }

    private newHealSpell(cooldown: number) {
        const button = this.data.list.isPlayerTurn ? this.playerHealButton : this.opponentHealButton;
        button.setAlpha(1);

        button.animateSpellTrigger(() => {
            button.removeSpellFilledTween();
            button.onSpellUse();
            this.events.once(GAME_SCENE_SCENE_EVENTS.ROUND_END, () => {
                button.tweenUpdateCooldown(0, cooldown);
            });

            new HealSpell(
                this,
                this.mainGridContainer,
                this.data.list.isPlayerTurn ? this.data.list.playerMonsters : this.data.list.opponentMonsters,
                this.data.list.isPlayerTurn ? this.playerSpellsData.heal : this.opponentSpellsData.heal
            );

            this.time.delayedCall(750, () => {
                this.spellCastInProgress = false;
            })
        })
    }

    // region UPDATE SPELLS RELATED
    private updatePlayerSpellButtonsInteraction(forceDisable: boolean = false) {
        // Player Magic Ball Button
        if (this.data.list.isPlayerTurn) {

            // Player Magic Ball Button
            if (this.playerMagicBallButton) {
                if (this.playerMagicBallButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerMagicBallButton.setInteractive();
                } else {
                    this.playerMagicBallButton.disableInteractive();
                }
                this.playerMagicBallButton.setAlpha(this.playerMagicBallButton.usedCurrentRound ? 0.45 : 1);
            }

            // Player Poison Button
            if (this.playerPoisonButton) {
                if (this.playerPoisonButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerPoisonButton.setInteractive();
                } else {
                    this.playerPoisonButton.disableInteractive();
                }
                this.playerPoisonButton.setAlpha(this.playerPoisonButton.usedCurrentRound ? 0.45 : 1);
            }

            // Player Rain Of Arrows Button
            if (this.playerRainOfArrowsButton) {
                if (this.playerRainOfArrowsButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerRainOfArrowsButton.setInteractive();
                } else {
                    this.playerRainOfArrowsButton.disableInteractive();
                }
                this.playerRainOfArrowsButton.setAlpha(this.playerRainOfArrowsButton.usedCurrentRound ? 0.45 : 1);
            }

            // Player Freeze Button
            if (this.playerFreezeButton) {
                if (this.playerFreezeButton.readyForUse && !this.spellCastInProgress && !forceDisable) {
                    this.playerFreezeButton.setInteractive();
                } else {
                    this.playerFreezeButton.disableInteractive();
                }
                this.playerFreezeButton.setAlpha(this.playerFreezeButton.usedCurrentRound ? 0.45 : 1);
            }

            // Player Heal Button
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

    private updateSpellLevelsOnTurnEnd() {

        // check player magic ball cooldown filled
        if (this.playerSpellsData && this.playerSpellsData.magicBall && !isNaN(this.playerSpellsData.magicBall.cooldown)) {

            if (this.playerMagicBallButton.usedCurrentRound) {
                this.playerMagicBallButton.usedCurrentRound = false;
            } else {
                this.playerSpellsData.magicBall.cooldownProgress++;
            }

            this.playerMagicBallButton.tweenUpdateCooldown(
                this.playerSpellsData.magicBall.cooldownProgress,
                this.playerSpellsData.magicBall.cooldown
            );

            if (this.playerSpellsData.magicBall.cooldownProgress === this.playerSpellsData.magicBall.cooldown) {
                this.playerMagicBallButton.readyForUse = true;
                this.playerMagicBallButton.startSpellFilledTween(false);
            }
        }

        // check player poison cooldown filled
        if (this.playerSpellsData && this.playerSpellsData.poison && !isNaN(this.playerSpellsData.poison.cooldown)) {

            if (this.playerPoisonButton.usedCurrentRound) {
                this.playerPoisonButton.usedCurrentRound = false;
            } else {
                this.playerSpellsData.poison.cooldownProgress++;
            }

            this.playerPoisonButton.tweenUpdateCooldown(
                this.playerSpellsData.poison.cooldownProgress,
                this.playerSpellsData.poison.cooldown
            );
            if (this.playerSpellsData.poison.cooldownProgress === this.playerSpellsData.poison.cooldown) {
                this.playerPoisonButton.readyForUse = true;
                this.playerPoisonButton.startSpellFilledTween(false);
            }
        }

        // check player rain of arrows cooldown filled
        if (this.playerSpellsData && this.playerSpellsData.rainOfArrows && !isNaN(this.playerSpellsData.rainOfArrows.cooldown)) {

            if (this.playerRainOfArrowsButton.usedCurrentRound) {
                this.playerRainOfArrowsButton.usedCurrentRound = false;
            } else {
                this.playerSpellsData.rainOfArrows.cooldownProgress++;
            }

            this.playerRainOfArrowsButton.tweenUpdateCooldown(
                this.playerSpellsData.rainOfArrows.cooldownProgress,
                this.playerSpellsData.rainOfArrows.cooldown
            );
            if (this.playerSpellsData.rainOfArrows.cooldownProgress === this.playerSpellsData.rainOfArrows.cooldown) {
                this.playerRainOfArrowsButton.readyForUse = true;
                this.playerRainOfArrowsButton.startSpellFilledTween(false);
            }
        }

        // check player freeze cooldown filled
        if (this.playerSpellsData && this.playerSpellsData.freeze && !isNaN(this.playerSpellsData.freeze.cooldown)) {

            if (this.playerFreezeButton.usedCurrentRound) {
                this.playerFreezeButton.usedCurrentRound = false;
            } else {
                this.playerSpellsData.freeze.cooldownProgress++;
            }

            this.playerFreezeButton.tweenUpdateCooldown(
                this.playerSpellsData.freeze.cooldownProgress,
                this.playerSpellsData.freeze.cooldown
            );
            if (this.playerSpellsData.freeze.cooldownProgress === this.playerSpellsData.freeze.cooldown) {
                this.playerFreezeButton.readyForUse = true;
                this.playerFreezeButton.startSpellFilledTween(false);
            }
        }

        // check player heal cooldown filled
        if (this.playerSpellsData && this.playerSpellsData.heal && !isNaN(this.playerSpellsData.heal.cooldown)) {

            if (this.playerHealButton.usedCurrentRound) {
                this.playerHealButton.usedCurrentRound = false;
            } else {
                this.playerSpellsData.heal.cooldownProgress++;
            }

            this.playerHealButton.tweenUpdateCooldown(
                this.playerSpellsData.heal.cooldownProgress,
                this.playerSpellsData.heal.cooldown
            );
            if (this.playerSpellsData.heal.cooldownProgress === this.playerSpellsData.heal.cooldown) {
                this.playerHealButton.readyForUse = true;
                this.playerHealButton.startSpellFilledTween(false);
            }
        }

        // check opponent magic ball cooldown filled
        if (this.opponentSpellsData?.magicBall) {

            if (this.opponentMagicBallButton.usedCurrentRound) {
                this.opponentMagicBallButton.usedCurrentRound = false;
            } else {
                this.opponentSpellsData.magicBall.cooldownProgress++;
            }

            this.opponentMagicBallButton.tweenUpdateCooldown(
                this.opponentSpellsData.magicBall.cooldownProgress,
                this.opponentSpellsData.magicBall.cooldown
            );

            if (this.opponentSpellsData.magicBall.cooldownProgress === this.opponentSpellsData.magicBall.cooldown) {
                this.opponentMagicBallButton.startSpellFilledTween(false);
            }
        }

        // check opponent poison cooldown filled
        if (this.opponentSpellsData?.poison) {

            if (this.opponentPoisonButton.usedCurrentRound) {
                this.opponentPoisonButton.usedCurrentRound = false;
            } else {
                this.opponentSpellsData.poison.cooldownProgress++;
            }

            this.opponentPoisonButton.tweenUpdateCooldown(
                this.opponentSpellsData.poison.cooldownProgress,
                this.opponentSpellsData.poison.cooldown
            );

            if (this.opponentSpellsData.poison.cooldownProgress === this.opponentSpellsData.poison.cooldown) {
                this.opponentPoisonButton.startSpellFilledTween(false);
            }
        }

        // check opponent rain of arrows cooldown filled
        if (this.opponentSpellsData?.rainOfArrows) {

            if (this.opponentRainOfArrowsButton.usedCurrentRound) {
                this.opponentRainOfArrowsButton.usedCurrentRound = false;
            } else {
                this.opponentSpellsData.rainOfArrows.cooldownProgress++;
            }

            this.opponentRainOfArrowsButton.tweenUpdateCooldown(
                this.opponentSpellsData.rainOfArrows.cooldownProgress,
                this.opponentSpellsData.rainOfArrows.cooldown
            );

            if (this.opponentSpellsData.rainOfArrows.cooldownProgress === this.opponentSpellsData.rainOfArrows.cooldown) {
                this.opponentRainOfArrowsButton.startSpellFilledTween(false);
            }
        }

        // check opponent freeze filled
        if (this.opponentSpellsData?.freeze) {

            if (this.opponentFreezeButton.usedCurrentRound) {
                this.opponentFreezeButton.usedCurrentRound = false;
            } else {
                this.opponentSpellsData.freeze.cooldownProgress++;
            }

            this.opponentFreezeButton.tweenUpdateCooldown(
                this.opponentSpellsData.freeze.cooldownProgress,
                this.opponentSpellsData.freeze.cooldown
            );

            if (this.opponentSpellsData.freeze.cooldownProgress === this.opponentSpellsData.freeze.cooldown) {
                this.opponentFreezeButton.startSpellFilledTween(false);
            }
        }

        // check opponent heal filled
        if (this.opponentSpellsData?.heal) {

            if (this.opponentHealButton.usedCurrentRound) {
                this.opponentHealButton.usedCurrentRound = false;
            } else {
                this.opponentSpellsData.heal.cooldownProgress++;
            }

            this.opponentHealButton.tweenUpdateCooldown(
                this.opponentSpellsData.heal.cooldownProgress,
                this.opponentSpellsData.heal.cooldown
            );

            if (this.opponentSpellsData.heal.cooldownProgress === this.opponentSpellsData.heal.cooldown) {
                this.opponentHealButton.startSpellFilledTween(false);
            }
        }
    }

    updateFrozenMonsters() {
        const allFrozenMonsters: Monster[] = this.data.list.isPlayerTurn ?
            this.data.list.opponentMonsters.filter((m: Monster) => m && m.frozenForDuration > 0) :
            this.data.list.playerMonsters.filter((m: Monster) => m && m.frozenForDuration > 0);

        while (allFrozenMonsters.length) {
            const monster = allFrozenMonsters.shift();
            let emitCheckEndTurnOnComplete = false;
            monster.frozenForDuration--;
            monster.unitData.movesLeft = 0;
            monster.frozen_turns_left_text.setText(`${monster.frozenForDuration}`);
            monster.pendingAction = false;
            if (monster.frozenForDuration === 0) {
                monster.removeFrozen();
            }
        }
    }

    applyPoison(onComplete: () => void) {

        console.log(this.data.list.playerMonsters);
        console.log(this.data.list.opponentMonsters);

        const allPoisonedMonsters: Monster[] = this.data.list.isPlayerTurn ?
            this.data.list.playerMonsters.filter((m: Monster) => m && m.poisonedForDuration > 0) :
            this.data.list.opponentMonsters.filter((m: Monster) => m && m.poisonedForDuration > 0)


        if (allPoisonedMonsters.length === 0) {
            onComplete();
        } else {
            /**
             * this delayed call is a dirty hack.changing the duration will probably cause issues.
             * duration is based onthe monster.takeDamage tween duration, which is 1500.
             * TO BE FIXED...
             */
            this.time.delayedCall(2000, () => {
                onComplete();
            })
        }

        while (allPoisonedMonsters.length) {
            const monster = allPoisonedMonsters.shift();
            let emitCheckEndTurnOnComplete = false;
            monster.takePoisonDamege(emitCheckEndTurnOnComplete)
        }
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
    immuneTo?: string[];
}

export interface IBuff {
    buffType: string;
    quantity: number;
    buffContainer: Phaser.GameObjects.Container;
}

interface ISurvivalLevelWonInAdvanceData {
    keys: number;
    gems: number;
    commonPacks: number;
    silverPacks: number;
    goldPacks: number;
    token1: number;
    token2: number;
    token3: number;
    token4: number;
    token5: number;
}
