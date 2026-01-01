import { Scene } from 'phaser';
import { BUFF_TYPES, GAME_SCENE_SCENE_EVENTS, IBuff, IUnitData } from '../Game';
import { main_config } from '../../configs/main_config';
import { IGameData, LOCAL_STORAGE_MANAGER } from '../../LOCAL_STORAGE_MANAGER';

export class Monster extends Phaser.GameObjects.Container {
    bg: Phaser.GameObjects.Image;
    private melee: Phaser.GameObjects.Image;
    private melee_text: Phaser.GameObjects.Text;
    private health_text: Phaser.GameObjects.Text;
    private health: Phaser.GameObjects.Image;
    private shield: Phaser.GameObjects.Image;
    private shield_text: Phaser.GameObjects.Text;
    private vision_text: Phaser.GameObjects.Text;
    private vision: Phaser.GameObjects.Image;
    unitData: IUnitData;
    idleTween: Phaser.Tweens.Tween | null;
    index: number;
    pendingAction: boolean;
    ranged: Phaser.GameObjects.Image;
    ranged_text: Phaser.GameObjects.Text;
    magic: Phaser.GameObjects.Image;
    magic_text: Phaser.GameObjects.Text;
    outline: Phaser.GameObjects.Graphics;
    outlineColor: number;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    movesLeftContainer: Phaser.GameObjects.Container;
    starsContainer: Phaser.GameObjects.Container;
    startX: number;
    startY: number;
    positionIndex: number = NaN;
    upgradePostionIndex: number = NaN;
    originalIndex: number;
    addedForSale: boolean = false;
    isPlayerMonster: boolean;
    private _displayWidth: number;

    constructor(scene: Scene, x: number, y: number, displayWidth: number, displayHeight: number, unit: IUnitData, index: number, isPlayerMonster: boolean) {
        super(scene, x, y);
        this.scene = scene;
        this.unitData = unit;
        this.type = this.unitData.type;
        this.unitData.movesLeft = this.unitData.moves;
        this.index = index;
        this.isPlayerMonster = isPlayerMonster;
        this._displayWidth = displayWidth;

        //bg
        this.bg = scene.add.image(0, 0, unit.type).setOrigin(0.5);
        this.bg.displayWidth = displayWidth;
        this.bg.displayHeight = displayHeight;
        this.add([this.bg]);

        //emitter
        this.addEmitter();

        //outline
        this.outlineColor = isPlayerMonster ? 0x22c422 : 0xff0000;
        this.outline = this.scene.add.graphics();
        this.outline.lineStyle(5, this.outlineColor);
        // this.outline.moveTo(this.bg.displayWidth / -2, this.bg.displayHeight / -2);
        // this.outline.lineTo(this.bg.displayWidth / 2, this.bg.displayHeight / -2);
        // this.outline.lineTo(this.bg.displayWidth / 2, this.bg.displayHeight / 2);
        // this.outline.lineTo(this.bg.displayWidth / -2, this.bg.displayHeight / 2);
        // this.outline.lineTo(this.bg.displayWidth / -2, this.bg.displayHeight / -2);
        // this.outline.strokePath();

        this.outline.strokeRect(
            -this.bg.displayWidth / 2,
            -this.bg.displayHeight / 2,
            this.bg.displayWidth,
            this.bg.displayHeight
        );

        this.outline.setPosition(0, 0);
        this.add(this.outline);



        // U N I T   I S   M E L E E
        if (unit.melee > 0) {
            //melee img
            this.melee = scene.add.image(0, 0, 'attack').setScale(displayWidth * 0.15 / 100).setOrigin(0);
            this.melee.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
            this.melee.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

            //melee text
            this.melee_text = scene.add.text(
                this.melee.x + this.melee.displayWidth,
                this.melee.y - 2,
                unit.melee.toString(),
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                    stroke: '#000000ff', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                });
            this.melee_text.setOrigin(0);
            this.add([this.melee, this.melee_text]);
        }

        // U N I T   I S   R A N G E D
        if (unit.ranged > 0) {
            //ranged img
            this.ranged = scene.add.image(0, 0, 'bow').setScale(displayWidth * 0.15 / 100).setOrigin(0);
            this.ranged.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
            this.ranged.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

            //ranged text
            this.ranged_text = scene.add.text(
                this.ranged.x + this.ranged.displayWidth,
                this.ranged.y - 2,
                unit.ranged.toString(),
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                });
            this.ranged_text.setOrigin(0);
            this.add([this.ranged, this.ranged_text]);
        }

        // U N I T   I S   M A G I C
        if (unit.magic > 0) {
            //magic img
            this.magic = scene.add.image(0, 0, 'ball').setScale(displayWidth * 0.15 / 100).setOrigin(0);
            this.magic.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
            this.magic.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;

            //ranged text
            this.magic_text = scene.add.text(
                this.magic.x + this.magic.displayWidth,
                this.magic.y - 2,
                unit.magic.toString(),
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                    align: 'center'
                });
            this.magic_text.setOrigin(0);
            this.add([this.magic, this.magic_text]);
        }

        //health text
        this.health_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02 - 2,
            unit.health.toString(),
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                align: 'center'
            });
        this.health_text.setOrigin(1, 0);

        // //health img
        this.health = scene.add.image(0, 0, 'health').setScale(displayWidth * 0.15 / 100).setOrigin(1, 0);
        this.health.x = this.health_text.x - this.health_text.width;
        this.health.y = this.bg.displayHeight / -2 + this.bg.displayHeight * 0.02;
        this.add([this.health_text, this.health]);

        // shield img
        this.shield = scene.add.image(0, 0, 'shield').setScale(displayWidth * 0.15 / 100).setOrigin(0, 1);
        this.shield.x = this.bg.displayWidth / -2 + this.bg.displayWidth * 0.02;
        this.shield.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02;

        //shield text
        this.shield_text = scene.add.text(
            this.shield.x + this.shield.displayWidth,
            this.shield.y - 2,
            unit.shield.toString(),
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                align: 'center'
            });
        this.shield_text.setOrigin(0, 1);
        this.add([this.shield, this.shield_text]);

        //vision text
        this.vision_text = scene.add.text(
            this.bg.displayWidth / 2 - this.bg.displayWidth * 0.02,
            this.bg.displayHeight / 2 - this.bg.displayHeight * 0.02 - 2,
            unit.vision.toString(),
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: displayWidth * 15 / 100, color: '#ffffff',
                stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                align: 'center'
            });
        this.vision_text.setOrigin(1);

        // //vision img
        this.vision = scene.add.image(0, 0, 'vision').setScale(displayWidth * 0.15 / 100).setOrigin(1, 1);
        this.vision.x = this.vision_text.x - this.vision_text.width;
        this.vision.y = this.bg.displayHeight / 2 - this.bg.displayHeight * 0.075;
        this.add([this.vision_text, this.vision]);

        //stars
        this.starsContainer = scene.add.container(0, 0);
        for (let index = 0; index < unit.stars; index++) {
            const star = scene.add.image(0, 0, 'star').setScale(displayWidth * 0.15 / 100).setOrigin(0, 0.5);
            this.starsContainer.add(star);
        }

        Phaser.Actions.GridAlign(this.starsContainer.list, {
            width: 0,
            height: this.starsContainer.list.length,
            cellWidth: 0,
            cellHeight: displayWidth * 0.1, // spacing between items vertically
            position: Phaser.Display.Align.CENTER
        });
        this.starsContainer.y = this.starsContainer.getBounds().height / -2;
        this.starsContainer.x = -5;
        this.add([this.starsContainer])

        //moves
        this.movesLeftContainer = scene.add.container(0, 0);
        for (let index = 0; index < unit.moves; index++) {
            const dot = scene.add.image(0, 0, 'green-dot').setScale(displayWidth * 0.15 / 100).setOrigin(0, 0.5);
            this.movesLeftContainer.add(dot);
        }

        Phaser.Actions.GridAlign(this.movesLeftContainer.list, {
            width: 0,
            height: this.movesLeftContainer.list.length,
            cellWidth: 0,
            cellHeight: displayWidth * 0.15, // spacing between items vertically
            position: Phaser.Display.Align.CENTER
        });
        this.movesLeftContainer.y = this.movesLeftContainer.getBounds().height / -2;
        this.movesLeftContainer.x = this.bg.displayWidth - 32;
        this.add([this.movesLeftContainer])

        this.addInteraction();
    }


    repeatMove(): void {
        console.log('repeatMove');
        this.pendingAction = true;
        if (this.scene.data.list.isPlayerTurn) {
            // this.scene.events.emit('monster-selected', [this, this.unitData, true]);
        } else {
            this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.REPEAT_OPPONENT_MOVE);
        }
    }

    private addInteraction(): void {
        this.bg.on('pointerdown', () => {
            this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this, this.unitData, false]);
        });
    }

    setInteraction(interactive: boolean, skipByUser: boolean = false): void {
        // skipByUser is false for the currentlySelectedMonster when skipped
        interactive ? this.bg.setInteractive() : this.bg.disableInteractive();
        if (interactive && !skipByUser) {
            // this.setIdlePendingMove(); // do not use scale tween for now...
        } else {
            if (this.idleTween && !skipByUser) {
                this.scale = 1;
                this.idleTween.remove();
                this.idleTween = null;
            }
        }
    }

    addEmitter() {
        this.emitter = this.scene.add.particles(this.bg.x, this.bg.y, 'blood-drop', {
            x: this.bg.x,
            y: this.bg.y,
            speed: { min: 85, max: 180 },
            angle: { min: 0, max: 360 },
            lifespan: 800,
            quantity: 100,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitting: false
        })
        // this.emitter.startFollow(this.bg);
        this.addAt(this.emitter, 0);
    }

    move(row: number, col: number) {

        // if hidden below clouds - no particles and no scale while moving
        const isVisible = this.scene.data.list.clouds[row][col].alpha === 0;
        const scaleWhileMoving = isVisible ? 1.15 : 1;
        const duration = isVisible ? 500 : 100;

        this.emitter.emitting = isVisible;
        this.pendingAction = false;
        const position = this.scene.data.list.gridPositions[row][col];
        this.unitData.row = row;
        this.unitData.col = col;

        this.scene.tweens.add({
            delay: this.scene.data.list.isPlayerTurn ? 250 : 100,
            targets: this,
            scale: { value: scaleWhileMoving, yoyo: true, duration: duration / 2 },
            x: position.x,
            y: position.y,
            duration,
            ease: 'Cubic.easeInOut',
            onStart: () => {
                this.emitter.emitting = false;
                this.setInteraction(false);
            },
            onComplete: () => {
                this.checkForBuff(row, col);
                this.decreaseMoves();
                const movesLeft = this.unitData.movesLeft;
                this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                if (movesLeft > 0 && this.isPlayerMonster) {
                    this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_SELECTED, [this, this.unitData, false]);
                }
            }
        })
    }

    checkForBuff(row: number, col: number) {
        const buff: IBuff = this.scene.data.list.gridPositions[row][col].buff;
        if (buff) {
            //hass buff on new position



            if (
                (buff.buffType === 'attack' && this.unitData.melee === 0) || // monster not suitable for attack buff
                (buff.buffType === 'bow' && this.unitData.ranged === 0) ||   // monster not suitable for ranged buff
                (buff.buffType === 'ball' && this.unitData.magic === 0)      // monster not suitable for magic buff
            ) {
                return;
            } else {
                //add buff
                if (this.scene.data.list.isPlayerTurn) {
                    this.scene.cameras.main.shake(1000, 0.002)
                }

                let buffImageKey = '';
                switch (buff.buffType) {
                    case BUFF_TYPES.ATTACK:
                        this.unitData.melee++;
                        this.melee_text.setText(`${this.unitData.melee}`);
                        this.melee_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.ATTACK;
                        break;
                    case BUFF_TYPES.BOW:
                        this.unitData.ranged++;
                        this.ranged_text.setText(`${this.unitData.ranged}`);
                        this.ranged_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.BOW;
                        break;
                    case BUFF_TYPES.BALL:
                        this.unitData.magic++;
                        this.magic_text.setText(`${this.unitData.magic}`);
                        this.magic_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.BALL;
                        break;
                    case BUFF_TYPES.HEALTH:
                        this.unitData.health++;
                        this.health_text.setText(`${this.unitData.health}`);
                        this.health_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.HEALTH;
                        break;
                    case BUFF_TYPES.SHIELD:
                        this.unitData.shield++;
                        this.shield_text.setText(`${this.unitData.shield}`);
                        this.shield_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.SHIELD;
                        break;
                    case BUFF_TYPES.VISION:
                        this.unitData.vision++;
                        this.vision_text.setText(`${this.unitData.vision}`);
                        this.vision_text.tint = 0x4bcc0f;
                        buffImageKey = BUFF_TYPES.VISION;
                        break;
                    case BUFF_TYPES.GREEN_DOT:
                        this.unitData.moves++;
                        const dot = this.scene.add.image(0, 0, 'grey-dot').setScale(this._displayWidth * 0.15 / 100).setOrigin(0, 0.5);
                        this.movesLeftContainer.add(dot);
                        Phaser.Actions.GridAlign(this.movesLeftContainer.list, {
                            width: 0,
                            height: this.movesLeftContainer.list.length,
                            cellWidth: 0,
                            cellHeight: this._displayWidth * 0.15, // spacing between items vertically
                            position: Phaser.Display.Align.CENTER
                        });
                        this.movesLeftContainer.y = this.movesLeftContainer.getBounds().height / -2;
                        this.movesLeftContainer.x = this.bg.displayWidth - 32;
                        buffImageKey = BUFF_TYPES.GREEN_DOT;
                        break;
                    default:
                        break;
                }

                // add visual  display of the buff and tween
                const glbPos = this.bg.getBounds()
                const x = glbPos.x + this.bg.displayWidth / 2;
                const y = glbPos.y + this.bg.displayHeight / 2;
                let buffImage = this.scene.add.image(x, y, buffImageKey).setOrigin(0, 0.5).setScale(0.35).setDepth(12);
                const buffQuantityText = this.scene.add.text(
                    x,
                    y,
                    `+${buff.quantity}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#4bcc0f',
                        stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                        align: 'center'
                    });
                buffQuantityText.setOrigin(1, 0.5).setDepth(12);
                this.scene.tweens.add({
                    targets: [buffQuantityText, buffImage],
                    y: y - 75,
                    duration: 1500,
                    onComplete: () => {
                        buffQuantityText.destroy(true);
                        buffImage.destroy(true);
                    }
                })

                //remove buff data and visually
                buff.buffContainer.destroy(true);
                delete this.scene.data.list.gridPositions[row][col].buff;
                console.log(this.scene.data.list.gridPositions[row][col]);
            }

        }
    }

    skipMove(skipByUser: boolean = false): void {
        this.pendingAction = false;
        this.setInteraction(false, skipByUser);
        this.decreaseMoves();
        this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN, skipByUser);
    }

    performHit(target: Monster | null, isTargetToTheLeft: boolean, complete: Function): void {

        this.emitter.emitting = true;
        this.pendingAction = false;
        this.setInteraction(false);
        this.decreaseMoves();

        const glbPos = this.bg.getBounds()
        const x = glbPos.x + this.bg.displayWidth / 2;
        const y = glbPos.y + this.bg.displayHeight / 2;
        const targetGlobalPos = target!.bg.getBounds();
        const targetX = targetGlobalPos.x + target!.bg.displayWidth / 2;

        const targetY = targetGlobalPos.y + target!.bg.displayHeight / 2;
        const weaponImg = this.scene.add.image(x, y, 'sword').setScale(this.bg.displayWidth * 0.5 / 100).setOrigin(0.5).setDepth(12);
        const startAngle = isTargetToTheLeft ? 45 : -45;
        const endAngle = isTargetToTheLeft ? -45 : 45;
        const isRangedAttack = this.unitData.ranged > 0;
        const isMagicAttack = this.unitData.magic > 0;

        const emitter: Phaser.GameObjects.Particles.ParticleEmitter = this.scene.add.particles(targetX, targetY, 'blood-drop', {
            lifespan: 1400,
            speed: { random: [75, 150] },
            scale: { start: 0.75, end: 0.2 },
            gravityY: 125,
            emitting: false
        }).setDepth(15)

        // A R R O W   A T T A C K
        if (isRangedAttack) {
            weaponImg.setTexture('bow-arrow');
            let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(target!.x, target!.y, this.x, this.y));
            angle -= 90;
            weaponImg.setScale(this.bg.displayWidth * 1 / 100);
            weaponImg.angle = angle;
            this.scene.tweens.chain({
                targets: weaponImg,
                tweens: [
                    {
                        x: targetX,
                        y: targetY,
                        duration: 300,
                        ease: 'Cubic.easeIn',
                        onStart: () => {
                            this.emitter.emitting = false;
                        },
                        onComplete: () => {
                            complete();
                            this.emitter.emitting = false;
                            emitter.explode(48);
                        }
                    },
                    {
                        alpha: { value: 0, duration: 1000 },
                        delay: 1250,
                        onComplete: () => {
                            emitter.destroy(true);
                            weaponImg.destroy(true);
                        }
                    }
                ]
            })
        }

        //M A G I C    A T T A C K
        else if (isMagicAttack) {
            weaponImg.setTexture('ball');
            weaponImg.setScale(this.bg.displayWidth * 0.4 / 100);
            this.scene.tweens.chain({
                targets: weaponImg,
                tweens: [
                    {
                        x: targetX,
                        y: targetY,
                        duration: 300,
                        ease: 'Cubic.easeIn',
                        onStart: () => {
                            this.emitter.emitting = false;
                        },
                        onComplete: () => {
                            complete();
                            this.emitter.emitting = false;
                            emitter.explode(48);
                        }
                    },
                    {
                        alpha: { value: 0, duration: 1000 },
                        delay: 750,
                        onComplete: () => {
                            emitter.destroy(true);
                            weaponImg.destroy(true);
                        }
                    }
                ]
            })
        }

        //S W O R D    A T T A C K
        else {
            this.scene.tweens.chain({
                targets: weaponImg,
                tweens: [
                    {
                        targets: weaponImg,
                        angle: startAngle,
                        duration: 150,
                        delay: this.scene.data.list.isPlayerTurn ? 250 : 1000,
                        onStart: () => {
                            this.emitter.emitting = false;
                        }
                    },
                    {
                        angle: { value: endAngle, duration: 150 },
                        x: targetX,
                        y: targetY,
                        duration: 150,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            complete();
                            this.emitter.emitting = false;
                            emitter.explode(48);
                        }
                    },
                    {
                        alpha: { value: 0, duration: 1000 },
                        delay: 500,
                        onComplete: () => {
                            emitter.destroy(true);
                            weaponImg.destroy(true);
                        }
                    }
                ]
            })
        }
    }

    takeDamege(damage: number, isMagicAttack: boolean): void {

        let dmg = 0;
        if (isMagicAttack) {
            // magic attack - no shield
            dmg = damage;
        } else {
            //other attack - shield applies
            dmg = damage - this.unitData.shield;
        }

        if (dmg > this.unitData.health) dmg = this.unitData.health;
        if (dmg < 0) dmg = 0;

        let healthLeft = this.unitData.health - dmg;
        if (healthLeft < 0) healthLeft = 0;

        this.unitData.health = healthLeft;
        this.health_text.setText(healthLeft.toString());


        const glbPos = this.bg.getBounds()
        const x = glbPos.x + this.bg.displayWidth / 2;
        const y = glbPos.y + this.bg.displayHeight / 2;
        const lostHealth = this.scene.add.text(
            x,
            y,
            (dmg * -1).toString(),
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 40, color: '#ff0000',
                stroke: '#000000', strokeThickness: 4, letterSpacing: 4,
                align: 'center'
            });
        lostHealth.setOrigin(0.5).setDepth(15);
        // this.add(lostHealth);
        this.scene.tweens.add({
            targets: lostHealth,
            // alpha: { value: 0, delay: 2750 },
            y: y + 75,
            duration: 1500,
            onComplete: () => {
                if (healthLeft === 0) {
                    this.die();
                } else {
                    this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                }
                lostHealth.destroy(true);
            }
        })
    }

    die() {
        // this.alpha = 0.5;
        this.emit(GAME_SCENE_SCENE_EVENTS.MONSTER_DIED, this.unitData);
        let waitForPackDropped = false;
        let waitForGemDropped = false;
        if (!this.isPlayerMonster) {
            const checkFreePackDrop = this.checkFreePackDrop();
            if (!checkFreePackDrop) {// if no pack drop, check gem drop
                waitForGemDropped = this.checkGemDrop();
            } else {
                waitForPackDropped = true;
            }
        }
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                if (waitForPackDropped) {
                    // SOMETIMES THERES A BUG HERE - this.scene is undefined !!!!
                    this.scene.events.once(GAME_SCENE_SCENE_EVENTS.DROPPED_PACK_COLLECTED, () => {
                        this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                    })
                }
                else if (waitForGemDropped) {
                    this.scene.events.once(GAME_SCENE_SCENE_EVENTS.DROPPED_GEM_COLLECTED, () => {
                        this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                    })
                }
                else {
                    this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.CHECK_END_TURN);
                }
            }
        })
    }

    checkGemDrop() {
        const odds = main_config.chanceToDropGem;
        const randomNumber = Phaser.Math.RND.between(1, 1000);
        if (randomNumber >= odds) {

            const gem = this.scene.add.image(this.bg.getBounds().x + this.bg.getBounds().width / 2, this.bg.getBounds().y + this.bg.getBounds().height / 2, 'gem').setScale(0).setOrigin(0.5).setAlpha(0).setDepth(100);
            const data = (LOCAL_STORAGE_MANAGER.get('gems') as number);
            LOCAL_STORAGE_MANAGER.set('gems', +data + 1);

            this.scene.tweens.chain({
                tweens: [
                    {
                        targets: gem,
                        alpha: 1,
                        scale: 0.15,
                        duration: 350,
                        delay: 550,
                        ease: 'Back.easeOut'
                    },
                    {
                        targets: gem,
                        x: 960,
                        y: 540,
                        scale: 0.75,
                        duration: 300
                    },
                    {
                        targets: gem,
                        delay: 1100,
                        alpha: 0,
                        scale: 0,
                        duration: 300,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.DROPPED_GEM_COLLECTED);
                            gem.destroy(true);
                        }
                    },
                ]
            });
            return true;
        } else {
            return false;
        }
    }

    checkFreePackDrop(): boolean {
        const odds = main_config.chanceToDropPack;
        const randomNumber = Phaser.Math.RND.between(1, 1000);
        let packDropped = '';
        let packTexture = '';
        for (let index = 0; index < odds.length; index++) {
            const odd = odds[index];
            if (randomNumber <= odd) {
                if (index === 0) {
                    //no pack drop
                    return false;
                } else if (index === 1) {
                    packDropped = 'common';
                    packTexture = 'common-pack';
                    break;
                } else if (index === 2) {
                    packDropped = 'silver';
                    packTexture = 'silver-pack';
                    break;
                } else if (index === 3) {
                    packDropped = 'gold';
                    packTexture = 'gold-pack';
                    break;
                }
                // alert(packTexture);
            }
        }
        const pack = this.scene.add.image(this.bg.getBounds().x + this.bg.getBounds().width / 2, this.bg.getBounds().y + this.bg.getBounds().height / 2, packTexture).setScale(0).setOrigin(0.5).setAlpha(0).setDepth(100);
        let storedItem = '';
        switch (packDropped) {
            case 'common':
                storedItem = 'freeCommonPacks';
                break;
            case 'silver':
                storedItem = 'freeSilverPacks';
                break;
            case 'gold':
                storedItem = 'freeGoldPacks';
                break;
            default:
                break;
        }
        const data = LOCAL_STORAGE_MANAGER.get(storedItem as keyof IGameData);
        LOCAL_STORAGE_MANAGER.set(storedItem as keyof IGameData, +data + 1);

        this.scene.tweens.chain({
            tweens: [
                {
                    targets: pack,
                    alpha: 1,
                    scale: 0.15,
                    duration: 350,
                    delay: 550,
                    ease: 'Back.easeOut'
                },
                {
                    targets: pack,
                    x: 960,
                    y: 540,
                    scale: 0.75,
                    duration: 300
                },
                {
                    targets: pack,
                    delay: 1100,
                    alpha: 0,
                    scale: 0,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.scene.events.emit(GAME_SCENE_SCENE_EVENTS.DROPPED_PACK_COLLECTED);
                        pack.destroy(true);
                    }
                },
            ]
        });

        return true;
    }

    setIdlePendingMove(): void {
        const initialScale = this.scale;
        this.idleTween = this.scene.tweens.add({
            targets: this,
            scale: 1.05,
            yoyo: true,
            repeat: -1,
            duration: 650,
            // ease: 'Back.easeOut'  
        })


        // const shape = new Phaser.Geom.Rectangle(this.bg.width / -4, this.bg.height / -4, this.bg.width / 2, this.bg.height / 2);
        // const emitter: Phaser.GameObjects.Particles.ParticleEmitter = this.scene.add.particles(0, 0, 'circle', {
        //     // frame: { frames: ['pendinMoveParticle'] }
        //     // blendMode: 'ADD',
        //     lifespan: 500,
        //     scale: { start: 0.3, end: 0.1 }
        // })
        // emitter.addEmitZone({ type: 'edge', source: shape, quantity: 64, total: 64 });
        // this.add(emitter)

        // this.bg.postFX.addGlow(0xffffff, 8, 0, false, 0.1, 16);
    }

    decreaseMoves(): void {

        //================== hack to fix nasty bug!===========================||
        if (this.unitData.movesLeft === 0) return;
        //====================================================================||

        this.unitData.movesLeft--;
        (this.movesLeftContainer.list[this.unitData.movesLeft] as Phaser.GameObjects.Image).setTexture('grey-dot');
    }

    resetMoves(): void {
        this.movesLeftContainer.list.forEach(dot => {
            (dot as Phaser.GameObjects.Image).setTexture('green-dot');
        });
        this.unitData.movesLeft = this.unitData.moves;
    }
}
