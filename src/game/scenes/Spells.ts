import { addUICurrencies, addFullscreenFunctionality, main_config } from "../configs/main_config";
import { spellsConfig } from "../configs/spells_config";
import { LOCAL_STORAGE_MANAGER } from "../LOCAL_STORAGE_MANAGER";
import { AbstractScene } from "./AbstractScene";
import { Button } from "./in-main-menu/Button";

export class Spells extends AbstractScene {

    backButton: Button;
    spellPoints: number;
    spellPointsAvailableText: Phaser.GameObjects.Text;
    headerContainer: Phaser.GameObjects.Container;

    //magic ball
    magicBallCooldown: number;
    magicBallTargets: number;
    magicBallDamage: number;
    magicBallImage: Phaser.GameObjects.Image;
    magicBallContainer: Phaser.GameObjects.Container;

    //poison  
    poisonCooldown: number;
    poisonTargets: number;
    poisonDamage: number;
    poisonDuration: number;
    poisonImage: Phaser.GameObjects.Image;
    poisonContainer: Phaser.GameObjects.Container;

    //magic ball
    rainOfArrowsCooldown: number;
    rainOfArrowsTargets: number;
    rainOfArrowsDamage: number;
    rainOfArrowsImage: Phaser.GameObjects.Image;
    rainOfArrowsContainer: Phaser.GameObjects.Container;

    //freeze  
    freezeCooldown: number;
    freezeTargets: number;
    freezeDuration: number;
    freezeImage: Phaser.GameObjects.Image;
    freezeContainer: Phaser.GameObjects.Container;

    //freeze  
    healCooldown: number;
    healTargets: number;
    healAmount: number;
    healImage: Phaser.GameObjects.Image;
    healContainer: Phaser.GameObjects.Container;
    magicBallStar1: Phaser.GameObjects.Image;
    magicBallStar2: Phaser.GameObjects.Image;
    magicBallStar3: Phaser.GameObjects.Image;

    constructor() {
        super('Spells');
    }

    create() {
        super.create();

        this.add.image(0, 0, 'spells-bg').setOrigin(0);

        this.createBackButton();

        // addUICurrencies((this as AbstractScene), LOCAL_STORAGE_MANAGER);
        addFullscreenFunctionality(this, 100, 75);

        this.spellPoints = LOCAL_STORAGE_MANAGER.get('spellPoints');

        this.createElements();
    }

    createElements() {
        this.createHeader();
        this.createMagicBallSection();
        this.createPoisonSection();
        this.createRainOfArrowsSection();
        this.createFreezeSection();
        this.createHealSection();
    }

    recreateElements() {

        this.headerContainer.destroy(true);
        this.magicBallContainer.destroy(true);
        this.poisonContainer.destroy(true);
        this.rainOfArrowsContainer.destroy(true);
        this.freezeContainer.destroy(true);
        this.healContainer.destroy(true);

        this.createElements();
    }

    updateSpellPoints() {
        this.spellPointsAvailableText.setText(`${this.spellPoints}`);
    }

    addInteractionToBGFrame(frame: Phaser.GameObjects.Image, container: Phaser.GameObjects.Container) {
        frame.setInteractive();
        frame.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scale: 1.01,
                duration: 200
            })
        })
        frame.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 200
            })
        })
    }

    createHeader() {
        this.headerContainer = this.add.container(960, 50);
        const spellPointsImage = this.add.image(0, 0, 'spell-point').setOrigin(1, 0.5).setScale(0.35);
        this.spellPointsAvailableText = this.add.text(
            spellPointsImage.x + 10,
            spellPointsImage.y,
            `${this.spellPoints}`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);
        this.headerContainer.add([spellPointsImage, this.spellPointsAvailableText]);
    }

    createMagicBallSection() {
        this.magicBallContainer = this.add.container(550, 250);
        const frame = this.add.image(20, 0, 'frame').setOrigin(0.5).setScale(1.2, 1);

        // this.addInteractionToBGFrame(frame, this.magicBallContainer);

        const magicBallCooldownLevel = LOCAL_STORAGE_MANAGER.get('magicBallCooldownLevel');
        const magicBallTargetsLevel = LOCAL_STORAGE_MANAGER.get('magicBallTargetsLevel');
        const magicBallDamageLevel = LOCAL_STORAGE_MANAGER.get('magicBallDamageLevel')

        // title
        const magicBallTitleText = this.add.text(
            -200,
            -75,
            `magic ball`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);
        this.magicBallContainer.add([frame, magicBallTitleText]);

        // icon
        this.magicBallImage = this.add.image(-300, -75, 'magic-ball-button').setOrigin(0, 0.5).setScale(0.45);
        this.magicBallContainer.add(this.magicBallImage);

        //magic ball cooldown text

        if (!isNaN(magicBallCooldownLevel) && magicBallCooldownLevel !== null) {

            //========================== MAGIC BALL COOLDOWN=================================
            const magicBallCooldownText = this.add.text(
                -300, 10,
                `cooldown`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);

            this.magicBallContainer.add(magicBallCooldownText);
            this.magicBallCooldown = spellsConfig.magicBall.coolDown[magicBallCooldownLevel].value;

            // STARS
            const star1 = this.add.image(-100, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star2 = this.add.image(-70, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star3 = this.add.image(-40, 13, 'star').setOrigin(0.5).setScale(0.26);
            this.magicBallContainer.add([star1, star2, star3]);
            star1.setAlpha(1);
            star2.setAlpha(magicBallCooldownLevel >= 1 ? 1 : 0.3);
            star3.setAlpha(magicBallCooldownLevel === 2 ? 1 : 0.3);

            //magic ball cooldown value
            const magicBallCooldownValue = this.add.text(
                5,
                10,
                `${this.magicBallCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.magicBallContainer.add(magicBallCooldownValue);

            const nextLevelCooldown = spellsConfig.magicBall.coolDown[magicBallCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const magicBallCooldownArrow = this.add.image(
                    45,
                    13,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.magicBallContainer.add(magicBallCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    85,
                    10,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(nextLevelCooldownText);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    10,
                    `cost:${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    10,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallCooldownLevel', magicBallCooldownLevel + 1);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }

            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    10,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#fcfffc',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                maxText.setTint(0x42ff3c);
                this.magicBallContainer.add(maxText);
            }

            //========================== MAGIC BALL TARGETS=================================
            //magic ball targets img
            this.magicBallTargets = spellsConfig.magicBall.targets[magicBallTargetsLevel].value;

            //magic ball targets text
            const targetsCooldownText = this.add.text(
                -300, 50,
                `targets`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);

            this.magicBallContainer.add(targetsCooldownText);
            this.magicBallCooldown = spellsConfig.magicBall.coolDown[magicBallTargetsLevel].value;
            // STARS
            const targetsStar1 = this.add.image(-100, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar2 = this.add.image(-70, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar3 = this.add.image(-40, 53, 'star').setOrigin(0.5).setScale(0.26);
            this.magicBallContainer.add([targetsStar1, targetsStar2, targetsStar3]);
            targetsStar1.setAlpha(1);
            targetsStar2.setAlpha(magicBallTargetsLevel >= 1 ? 1 : 0.3);
            targetsStar3.setAlpha(magicBallTargetsLevel === 2 ? 1 : 0.3);

            const nextLevelTargets = spellsConfig.magicBall.targets[magicBallTargetsLevel + 1];


            //magic ball targets text
            const magicBallTargetsText = this.add.text(
                5,
                50,
                `${this.magicBallTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.magicBallContainer.add(magicBallTargetsText);


            // next level
            if (nextLevelTargets) {
                // arrow img
                const magicBallTargetsArrow = this.add.image(
                    45,
                    53,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.magicBallContainer.add(magicBallTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    85,
                    50,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(nextLevelTargetsText);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    50,
                    `cost:${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    50,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', magicBallTargetsLevel + 1);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    50,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(maxText);
            }

            //========================== MAGIC BALL DAMAGE =================================
            //magic ball damage img
            this.magicBallDamage = spellsConfig.magicBall.damage[magicBallDamageLevel].value;
            const magicBallDamageHeader = this.add.text(
                -300, 90,
                `phy dmg`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);

            const damageStar1 = this.add.image(-100, 93, 'star').setOrigin(0.5).setScale(0.26);
            const damageStar2 = this.add.image(-70, 93, 'star').setOrigin(0.5).setScale(0.26);
            const damageStar3 = this.add.image(-40, 93, 'star').setOrigin(0.5).setScale(0.26);
            this.magicBallContainer.add([damageStar1, damageStar2, damageStar3]);
            damageStar1.setAlpha(1);
            damageStar2.setAlpha(magicBallDamageLevel >= 1 ? 1 : 0.3);
            damageStar3.setAlpha(magicBallDamageLevel === 2 ? 1 : 0.3);


            this.magicBallContainer.add(magicBallDamageHeader);
            //magic ball damage text
            const magicBallDamageText = this.add.text(
                5,
                90,
                `${this.magicBallDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.magicBallContainer.add(magicBallDamageText);

            const nextLevelDamage = spellsConfig.magicBall.damage[magicBallDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const magicBallDamageArrow = this.add.image(
                    45,
                    93,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.magicBallContainer.add(magicBallDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    85,
                    90,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(nextLevelDamageText);


                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    90,
                    `cost:${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    90,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', magicBallDamageLevel + 1);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    90,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.magicBallContainer.add(maxText);
            }
        } else {
            // spell is locked
            this.magicBallImage.setTexture('magic-ball-button-locked');
            const spellPointsToUnlockMagicBall = main_config.spellPointsToUnlockMagicBall;

            const unlockButton = new Button(
                this,
                0, 30,
                'unlock',
                '',
                () => {
                    LOCAL_STORAGE_MANAGER.set('magicBallCooldownLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', 0);
                    this.spellPoints -= spellPointsToUnlockMagicBall;
                    LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                    this.recreateElements();
                },
                true,
                0.6
            );
            // unlockButton.x += unlockButton.bg.displayWidth / 2;
            this.magicBallContainer.add(unlockButton);

            const unlockSpellPointsImg = this.add.image(unlockButton.x + unlockButton.bg.displayWidth / 2, unlockButton.y, 'spell-point').setOrigin(0.5).setScale(0.25);
            this.magicBallContainer.add(unlockSpellPointsImg);

            //magic ball spell Points Needed Text
            const spellPointsNeededText = this.add.text(
                unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth / 2 + 10,
                unlockSpellPointsImg.y,
                `${spellPointsToUnlockMagicBall}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.magicBallContainer.add(spellPointsNeededText);

            if (this.spellPoints >= spellPointsToUnlockMagicBall) {
                unlockButton.setInteractive();
            }
        }
    }

    createPoisonSection() {

        const poisonCooldownLevel = LOCAL_STORAGE_MANAGER.get('poisonCooldownLevel');
        const poisonTargetsLevel = LOCAL_STORAGE_MANAGER.get('poisonTargetsLevel');
        const poisonDamageLevel = LOCAL_STORAGE_MANAGER.get('poisonDamageLevel')
        const poisonDurationLevel = LOCAL_STORAGE_MANAGER.get('poisonDurationLevel')

        this.poisonContainer = this.add.container(1370, 250);
        const frame = this.add.image(20, 0, 'frame').setOrigin(0.5).setScale(1.2, 1);

        // title
        const poisonTitleText = this.add.text(
            -200,
            -75,
            `poison`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);

        // icon
        this.poisonImage = this.add.image(-300, -75, 'poison-button').setOrigin(0, 0.5).setScale(0.45);
        this.poisonContainer.add([frame, this.poisonImage, poisonTitleText]);

        //poison ball cooldown img
        if (!isNaN(poisonCooldownLevel) && poisonCooldownLevel !== null) {

            //========================== POISON COOLDOWN=================================
            const poisonCooldownImage = this.add.text(
                -300, -15,
                `cooldown`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonCooldownImage);
            this.poisonCooldown = spellsConfig.poison.coolDown[poisonCooldownLevel].value;

            // STARS
            const star1 = this.add.image(-100, -12, 'star').setOrigin(0.5).setScale(0.26);
            const star2 = this.add.image(-70, -12, 'star').setOrigin(0.5).setScale(0.26);
            const star3 = this.add.image(-40, -12, 'star').setOrigin(0.5).setScale(0.26);
            this.poisonContainer.add([star1, star2, star3]);
            star1.setAlpha(1);
            star2.setAlpha(poisonCooldownLevel >= 1 ? 1 : 0.3);
            star3.setAlpha(poisonCooldownLevel === 2 ? 1 : 0.3);


            //poison ball cooldown text
            const poisonCooldownText = this.add.text(
                5,
                -15,
                `${this.poisonCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.poisonContainer.add(poisonCooldownText);

            const nextLevelCooldown = spellsConfig.poison.coolDown[poisonCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const poisonCooldownArrow = this.add.image(
                    45,
                    -12,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.poisonContainer.add(poisonCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    85,
                    -15,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(nextLevelCooldownText);


                //poison ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    -15,
                    `cost:${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    -15,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonCooldownLevel', poisonCooldownLevel + 1);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    -15,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON TARGETS=================================
            //poison ball targets img
            this.poisonTargets = spellsConfig.poison.targets[poisonTargetsLevel].value;
            const poisonTargetsImage = this.add.text(
                -300, 25,
                `targets`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonTargetsImage);

            // STARS
            const poisonStar1 = this.add.image(-100, 28, 'star').setOrigin(0.5).setScale(0.26);
            const poisonStar2 = this.add.image(-70, 28, 'star').setOrigin(0.5).setScale(0.26);
            const poisonStar3 = this.add.image(-40, 28, 'star').setOrigin(0.5).setScale(0.26);
            this.poisonContainer.add([poisonStar1, poisonStar2, poisonStar3]);
            poisonStar1.setAlpha(1);
            poisonStar2.setAlpha(poisonTargetsLevel >= 1 ? 1 : 0.3);
            poisonStar3.setAlpha(poisonTargetsLevel === 2 ? 1 : 0.3);

            //poison ball targets text
            const poisonTargetsText = this.add.text(
                5,
                25,
                `${this.poisonTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.poisonContainer.add(poisonTargetsText);

            const nextLevelTargets = spellsConfig.poison.targets[poisonTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const poisonTargetsArrow = this.add.image(
                    45,
                    28,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.poisonContainer.add(poisonTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    85,
                    25,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(nextLevelTargetsText);

                //poison spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    25,
                    `cost:${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    25,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', poisonTargetsLevel + 1);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    25,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON DAMAGE =================================
            //poison damage img
            this.poisonDamage = spellsConfig.poison.damage[poisonDamageLevel].value;
            const poisonDamageImage = this.add.text(
                -300, 65,
                `magic dmg`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.poisonContainer.add(poisonDamageImage);

            // STARS
            const damageStar1 = this.add.image(-100, 68, 'star').setOrigin(0.5).setScale(0.26);
            const damageStar2 = this.add.image(-70, 68, 'star').setOrigin(0.5).setScale(0.26);
            this.poisonContainer.add([damageStar1, damageStar2]);
            damageStar1.setAlpha(1);
            damageStar2.setAlpha(poisonDamageLevel === 1 ? 1 : 0.3);

            //poison ball damage text
            const poisonDamageText = this.add.text(
                5,
                65,
                `${this.poisonDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.poisonContainer.add(poisonDamageText);

            const nextLevelDamage = spellsConfig.poison.damage[poisonDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const poisonDamageArrow = this.add.image(
                    45,
                    68,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.poisonContainer.add(poisonDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    85,
                    65,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(nextLevelDamageText);

                //poison ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    65,
                    `cost:${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    65,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', poisonDamageLevel + 1);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    65,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON DURATION =================================
            //poison ball damage img
            this.poisonDuration = spellsConfig.poison.duration[poisonDurationLevel].value;
            const poisonDurationImage = this.add.text(
                -300, 105,
                `duration`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.poisonContainer.add(poisonDurationImage);

            // STARS
            const durationStar1 = this.add.image(-100, 108, 'star').setOrigin(0.5).setScale(0.26);
            const durationStar2 = this.add.image(-70, 108, 'star').setOrigin(0.5).setScale(0.26);
            const durationStar3 = this.add.image(-40, 108, 'star').setOrigin(0.5).setScale(0.26);
            this.poisonContainer.add([durationStar1, durationStar2, durationStar3]);
            durationStar1.setAlpha(1);
            durationStar2.setAlpha(poisonDurationLevel >= 1 ? 1 : 0.3);
            durationStar3.setAlpha(poisonDurationLevel === 2 ? 1 : 0.3);

            //poison  Duration text
            const poisonDurationText = this.add.text(
                5,
                105,
                `${this.poisonDuration}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.poisonContainer.add(poisonDurationText);

            const nextLevelDuration = spellsConfig.poison.duration[poisonDurationLevel + 1];

            // next level
            if (nextLevelDuration) {
                // arrow img
                const poisonDurationArrow = this.add.image(
                    45,
                    108,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.poisonContainer.add(poisonDurationArrow);

                //next lvl Duration text
                const nextLevelDurationText = this.add.text(
                    85,
                    105,
                    `${nextLevelDuration.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(nextLevelDurationText);

                //poison Duration Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    105,
                    `cost:${nextLevelDuration.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    105,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonDurationLevel', poisonDurationLevel + 1);
                        this.spellPoints -= nextLevelDuration.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDuration.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    105,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.poisonContainer.add(maxText);
            }

        } else {
            // spell is locked
            this.poisonImage.setTexture('poison-button-locked');
            const spellPointsToUnlockpoison = main_config.spellPointsToUnlockPoison;

            const unlockButton = new Button(
                this,
                0, 30,
                'unlock',
                '',
                () => {
                    LOCAL_STORAGE_MANAGER.set('poisonCooldownLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('poisonDurationLevel', 0);
                    this.spellPoints -= spellPointsToUnlockpoison;
                    LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                    this.recreateElements();
                },
                true,
                0.6
            );
            // unlockButton.x += unlockButton.bg.displayWidth / 2;
            this.poisonContainer.add(unlockButton);

            const unlockSpellPointsImg = this.add.image(unlockButton.x + unlockButton.bg.displayWidth / 2, unlockButton.y, 'spell-point').setOrigin(0.5).setScale(0.25);
            this.poisonContainer.add(unlockSpellPointsImg);

            //poison  spell Points Needed Text
            const spellPointsNeededText = this.add.text(
                unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth / 2 + 10,
                unlockSpellPointsImg.y,
                `${spellPointsToUnlockpoison}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.poisonContainer.add(spellPointsNeededText);

            if (this.spellPoints >= spellPointsToUnlockpoison) {
                unlockButton.setInteractive();
            }
        }
    }

    createRainOfArrowsSection() {

        const frame = this.add.image(20, 0, 'frame').setOrigin(0.5).setScale(1.2, 1);
        this.rainOfArrowsContainer = this.add.container(550, 580);

        const rainOfArrowsCooldownLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsCooldownLevel');
        const rainOfArrowsTargetsLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsTargetsLevel');
        const rainOfArrowsDamageLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsDamageLevel')

        // title
        const rainOfArrowsTitleText = this.add.text(
            -200,
            -75,
            `rain of arrows`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);

        // icon
        this.rainOfArrowsImage = this.add.image(-300, -75, 'rain-of-arrows-button').setOrigin(0, 0.5).setScale(0.45);
        this.rainOfArrowsContainer.add([frame, this.rainOfArrowsImage, rainOfArrowsTitleText]);


        if (!isNaN(rainOfArrowsCooldownLevel) && rainOfArrowsCooldownLevel !== null) {

            //========================== RAIN OF ARROWS COOLDOWN=================================
            const rainOfArrowsCooldownImage = this.add.text(
                -300, 10,
                `cooldown`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);

            this.rainOfArrowsContainer.add(rainOfArrowsCooldownImage);

            // STARS
            const star1 = this.add.image(-100, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star2 = this.add.image(-70, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star3 = this.add.image(-40, 13, 'star').setOrigin(0.5).setScale(0.26);
            this.rainOfArrowsContainer.add([star1, star2, star3]);
            star1.setAlpha(1);
            star2.setAlpha(rainOfArrowsCooldownLevel >= 1 ? 1 : 0.3);
            star3.setAlpha(rainOfArrowsCooldownLevel === 2 ? 1 : 0.3);


            this.rainOfArrowsCooldown = spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel].value;
            // rain of arrows cooldown text
            const rainOfArrowsCooldownText = this.add.text(
                5,
                10,
                `${this.rainOfArrowsCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsCooldownText);



            const nextLevelCooldown = spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const rainOfArrowsCooldownArrow = this.add.image(
                    45, 13,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    85, 10,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(nextLevelCooldownText);

                //rain of arrows spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    10,
                    `cost:${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    10,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsCooldownLevel', rainOfArrowsCooldownLevel + 1);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    10,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(maxText);
            }

            //========================== RAIN OF ARROWS TARGETS=================================
            // rain of arrows targets img
            this.rainOfArrowsTargets = spellsConfig.rainOfArrows.targets[rainOfArrowsTargetsLevel].value;
            const rainOfArrowsTargetsImage = this.add.text(
                -300, 50,
                `targets`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);

            this.rainOfArrowsContainer.add(rainOfArrowsTargetsImage);

            // STARS
            const targetStar1 = this.add.image(-100, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetStar2 = this.add.image(-70, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetStar3 = this.add.image(-40, 53, 'star').setOrigin(0.5).setScale(0.26);
            this.rainOfArrowsContainer.add([targetStar1, targetStar2, targetStar3]);
            targetStar1.setAlpha(1);
            targetStar2.setAlpha(rainOfArrowsTargetsLevel >= 1 ? 1 : 0.3);
            targetStar3.setAlpha(rainOfArrowsTargetsLevel === 2 ? 1 : 0.3);

            // rain of arrows targets text
            const rainOfArrowsTargetsText = this.add.text(
                5,
                50,
                `${this.rainOfArrowsTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsTargetsText);
            const nextLevelTargets = spellsConfig.rainOfArrows.targets[rainOfArrowsTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const rainOfArrowsTargetsArrow = this.add.image(
                    45,
                    53,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    85,
                    50,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(nextLevelTargetsText);


                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    50,
                    `cost:${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    50,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', rainOfArrowsTargetsLevel + 1);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    50,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(maxText);
            }
            //========================== RAIN OF ARROWS DAMAGE =================================
            // rain of arrows damage img
            this.rainOfArrowsDamage = spellsConfig.rainOfArrows.damage[rainOfArrowsDamageLevel].value;
            const rainOfArrowsDamageImage = this.add.text(
                -300, 90,
                `magic dmg`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.rainOfArrowsContainer.add(rainOfArrowsDamageImage);


            const rainOfArrowsstar1 = this.add.image(-100, 93, 'star').setOrigin(0.5).setScale(0.26);
            const rainOfArrowsstar2 = this.add.image(-70, 93, 'star').setOrigin(0.5).setScale(0.26);
            const rainOfArrowsstar3 = this.add.image(-40, 93, 'star').setOrigin(0.5).setScale(0.26);
            this.rainOfArrowsContainer.add([rainOfArrowsstar1, rainOfArrowsstar2, rainOfArrowsstar3]);
            rainOfArrowsstar1.setAlpha(1);
            rainOfArrowsstar2.setAlpha(rainOfArrowsDamageLevel >= 1 ? 1 : 0.3);
            rainOfArrowsstar3.setAlpha(rainOfArrowsDamageLevel === 2 ? 1 : 0.3);

            // rain of arrows damage text
            const rainOfArrowsDamageText = this.add.text(
                5,
                90,
                `${this.rainOfArrowsDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsDamageText);

            const nextLevelDamage = spellsConfig.rainOfArrows.damage[rainOfArrowsDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const rainOfArrowsDamageArrow = this.add.image(
                    45,
                    93,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    85,
                    90,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(nextLevelDamageText);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    90,
                    `cost:${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    90,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', rainOfArrowsDamageLevel + 1);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    90,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.rainOfArrowsContainer.add(maxText);
            }
        } else {
            // spell is locked
            this.rainOfArrowsImage.setTexture('magic-ball-button-locked');
            const spellPointsToUnlockrainOfArrows = main_config.spellPointsToUnlockRainOfArrows;

            const unlockButton = new Button(
                this,
                0, 30,
                'unlock',
                '',
                () => {
                    LOCAL_STORAGE_MANAGER.set('rainOfArrowsCooldownLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', 0);
                    this.spellPoints -= spellPointsToUnlockrainOfArrows;
                    LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                    this.recreateElements();
                },
                true,
                0.6
            );
            // unlockButton.x += unlockButton.bg.displayWidth / 2;
            this.rainOfArrowsContainer.add(unlockButton);

            const unlockSpellPointsImg = this.add.image(unlockButton.x + unlockButton.bg.displayWidth / 2, unlockButton.y, 'spell-point').setOrigin(0.5).setScale(0.25);
            this.rainOfArrowsContainer.add(unlockSpellPointsImg);

            //magic ball spell Points Needed Text
            const spellPointsNeededText = this.add.text(
                unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth / 2 + 10,
                unlockSpellPointsImg.y,
                `${spellPointsToUnlockrainOfArrows}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.rainOfArrowsContainer.add(spellPointsNeededText);

            if (this.spellPoints >= spellPointsToUnlockrainOfArrows) {
                unlockButton.setInteractive();
            }
        }
    }

    createFreezeSection() {

        const freezeCooldownLevel = LOCAL_STORAGE_MANAGER.get('freezeCooldownLevel');
        const freezeTargetsLevel = LOCAL_STORAGE_MANAGER.get('freezeTargetsLevel');
        const freezeDurationLevel = LOCAL_STORAGE_MANAGER.get('freezeDurationLevel')

        this.freezeContainer = this.add.container(1370, 580);

        const frame = this.add.image(20, 0, 'frame').setOrigin(0.5).setScale(1.2, 1);
        // title
        const freezeTitleText = this.add.text(
            -200,
            -75,
            `freeze`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);

        // icon
        this.freezeImage = this.add.image(-300, -75, 'freeze-button').setOrigin(0, 0.5).setScale(0.45);
        this.freezeContainer.add([frame, this.freezeImage, freezeTitleText]);
        //freeze ball cooldown img

        if (!isNaN(freezeCooldownLevel) && freezeCooldownLevel !== null) {

            //========================== FREEZE COOLDOWN=================================
            const freezeCooldownImage = this.add.text(
                -300, 10,
                `cooldown`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeCooldownImage);
            this.freezeCooldown = spellsConfig.freeze.coolDown[freezeCooldownLevel].value;

            // STARS
            const star1 = this.add.image(-100, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star2 = this.add.image(-70, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star3 = this.add.image(-40, 13, 'star').setOrigin(0.5).setScale(0.26);
            this.freezeContainer.add([star1, star2, star3]);
            star1.setAlpha(1);
            star2.setAlpha(freezeCooldownLevel >= 1 ? 1 : 0.3);
            star3.setAlpha(freezeCooldownLevel === 2 ? 1 : 0.3);


            //freeze ball cooldown text
            const freezeCooldownText = this.add.text(
                5,
                10,
                `${this.freezeCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.freezeContainer.add(freezeCooldownText);

            const nextLevelCooldown = spellsConfig.freeze.coolDown[freezeCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const freezeCooldownArrow = this.add.image(
                    45,
                    13,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.freezeContainer.add(freezeCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    85,
                    10,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(nextLevelCooldownText);


                //freeze ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    10,
                    `cost:${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    10,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeCooldownLevel', freezeCooldownLevel + 1);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    10,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(maxText);
            }

            //========================== FREEZE TARGETS=================================
            //freeze ball targets img
            this.freezeTargets = spellsConfig.poison.targets[freezeTargetsLevel].value;
            const freezeTargetsImage = this.add.text(
                -300, 50,
                `targets`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeTargetsImage);


            // STARS
            const targetsStar1 = this.add.image(-100, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar2 = this.add.image(-70, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar3 = this.add.image(-40, 53, 'star').setOrigin(0.5).setScale(0.26);
            this.freezeContainer.add([targetsStar1, targetsStar2, targetsStar3]);
            targetsStar1.setAlpha(1);
            targetsStar2.setAlpha(freezeTargetsLevel >= 1 ? 1 : 0.3);
            targetsStar3.setAlpha(freezeTargetsLevel === 2 ? 1 : 0.3);


            //freeze ball targets text
            const freezeTargetsText = this.add.text(
                5,
                50,
                `${this.freezeTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.freezeContainer.add(freezeTargetsText);

            const nextLevelTargets = spellsConfig.freeze.targets[freezeTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const freezeTargetsArrow = this.add.image(
                    45,
                    53,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.freezeContainer.add(freezeTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    85,
                    50,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(nextLevelTargetsText);

                //freeze spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    50,
                    `cost:${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    50,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeTargetsLevel', freezeTargetsLevel + 1);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    50,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(maxText);
            }

            //========================== POISON DURATION =================================
            // freeze ball damage img
            this.freezeDuration = spellsConfig.freeze.duration[freezeDurationLevel].value;
            const freezeDurationImage = this.add.text(
                -300, 90,
                `duration`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeDurationImage);

            // STARS
            const durationStar1 = this.add.image(-100, 93, 'star').setOrigin(0.5).setScale(0.26);
            const durationStar2 = this.add.image(-70, 93, 'star').setOrigin(0.5).setScale(0.26);
            const durationStar3 = this.add.image(-40, 93, 'star').setOrigin(0.5).setScale(0.26);
            this.freezeContainer.add([durationStar1, durationStar2, durationStar3]);
            durationStar1.setAlpha(1);
            durationStar2.setAlpha(freezeDurationLevel >= 1 ? 1 : 0.3);
            durationStar3.setAlpha(freezeDurationLevel === 2 ? 1 : 0.3);

            //freeze  Duration text
            const freezeDurationText = this.add.text(
                5,
                90,
                `${this.freezeDuration}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.freezeContainer.add(freezeDurationText);

            const nextLevelDuration = spellsConfig.freeze.duration[freezeDurationLevel + 1];

            // next level
            if (nextLevelDuration) {
                // arrow img
                const freezeDurationArrow = this.add.image(
                    45,
                    93,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.freezeContainer.add(freezeDurationArrow);

                //next lvl Duration text
                const nextLevelDurationText = this.add.text(
                    85,
                    90,
                    `${nextLevelDuration.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(nextLevelDurationText);

                //freeze Duration Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    90,
                    `cost:${nextLevelDuration.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    90,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeDurationLevel', freezeDurationLevel + 1);
                        this.spellPoints -= nextLevelDuration.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDuration.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    90,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.freezeContainer.add(maxText);
            }
        } else {
            // spell is locked
            this.freezeImage.setTexture('freeze-button-locked');
            const spellPointsToUnlockFreeze = main_config.spellPointsToUnlockFreeze;

            const unlockButton = new Button(
                this,
                0, 30,
                'unlock',
                '',
                () => {
                    LOCAL_STORAGE_MANAGER.set('freezeCooldownLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('freezeTargetsLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('freezeDurationLevel', 0);
                    this.spellPoints -= spellPointsToUnlockFreeze;
                    LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                    this.recreateElements();
                },
                true,
                0.6
            );
            // unlockButton.x += unlockButton.bg.displayWidth / 2;
            this.freezeContainer.add(unlockButton);

            const unlockSpellPointsImg = this.add.image(unlockButton.x + unlockButton.bg.displayWidth / 2, unlockButton.y, 'spell-point').setOrigin(0.5).setScale(0.25);
            this.freezeContainer.add(unlockSpellPointsImg);

            //freeze  spell Points Needed Text
            const spellPointsNeededText = this.add.text(
                unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth / 2 + 10,
                unlockSpellPointsImg.y,
                `${spellPointsToUnlockFreeze}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.freezeContainer.add(spellPointsNeededText);

            if (this.spellPoints >= spellPointsToUnlockFreeze) {
                unlockButton.setInteractive();
            }
        }
    }

    createHealSection() {

        const frame = this.add.image(20, 0, 'frame').setOrigin(0.5).setScale(1.2, 1);


        const healCooldownLevel = LOCAL_STORAGE_MANAGER.get('healCooldownLevel');
        const healTargetsLevel = LOCAL_STORAGE_MANAGER.get('healTargetsLevel');
        const healAmountLevel = LOCAL_STORAGE_MANAGER.get('healAmountLevel')

        this.healContainer = this.add.container(960, 910);
        // title
        const healTitleText = this.add.text(
            -200,
            -75,
            `heal`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 45, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);

        // icon
        this.healImage = this.add.image(-300, -75, 'heal-button').setOrigin(0, 0.5).setScale(0.45);
        this.healContainer.add([frame, this.healImage, healTitleText]);

        //heal ball cooldown img

        if (!isNaN(healCooldownLevel) && healCooldownLevel !== null) {

            //========================== HEAL COOLDOWN=================================
            const healCooldownImage = this.add.text(
                -300, 10,
                `cooldown`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.healContainer.add(healCooldownImage);
            this.healCooldown = spellsConfig.heal.coolDown[healCooldownLevel].value;


            // STARS
            const star1 = this.add.image(-100, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star2 = this.add.image(-70, 13, 'star').setOrigin(0.5).setScale(0.26);
            const star3 = this.add.image(-40, 13, 'star').setOrigin(0.5).setScale(0.26);
            this.healContainer.add([star1, star2, star3]);
            star1.setAlpha(1);
            star2.setAlpha(healCooldownLevel >= 1 ? 1 : 0.3);
            star3.setAlpha(healCooldownLevel === 2 ? 1 : 0.3);

            //heal cooldown text
            const healCooldownText = this.add.text(
                5,
                10,
                `${this.healCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.healContainer.add(healCooldownText);

            const nextLevelCooldown = spellsConfig.heal.coolDown[healCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const healCooldownArrow = this.add.image(
                    45,
                    13,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.healContainer.add(healCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    85,
                    10,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(nextLevelCooldownText);


                //heal spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    10,
                    `cost:${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    10,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healCooldownLevel', healCooldownLevel + 1);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    10,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(maxText);
            }

            //========================== HEAL TARGETS=================================
            // heal targets img
            this.healTargets = spellsConfig.poison.targets[healTargetsLevel].value;
            const healTargetsImage = this.add.text(
                -300, 50,
                `targets`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.healContainer.add(healTargetsImage);


            // STARS
            const targetsStar1 = this.add.image(-100, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar2 = this.add.image(-70, 53, 'star').setOrigin(0.5).setScale(0.26);
            const targetsStar3 = this.add.image(-40, 53, 'star').setOrigin(0.5).setScale(0.26);
            this.healContainer.add([targetsStar1, targetsStar2, targetsStar3]);
            targetsStar1.setAlpha(1);
            targetsStar2.setAlpha(healTargetsLevel >= 1 ? 1 : 0.3);
            targetsStar3.setAlpha(healTargetsLevel === 2 ? 1 : 0.3);


            // heal targets text
            const healTargetsText = this.add.text(
                5,
                50,
                `${this.healTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.healContainer.add(healTargetsText);

            const nextLevelTargets = spellsConfig.heal.targets[healTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const healTargetsArrow = this.add.image(
                    45,
                    53,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.healContainer.add(healTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    85,
                    50,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(nextLevelTargetsText);

                // heal Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    50,
                    `cost:${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    50,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healTargetsLevel', healTargetsLevel + 1);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    50,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(maxText);
            }

            //========================== HEAL AMOUNT =================================
            // heal amount img
            this.healAmount = spellsConfig.heal.amount[healAmountLevel].value;
            const healAmountImage = this.add.text(
                -300,
                90,
                `amount`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5); this.healContainer.add(healAmountImage);

            // STARS
            const amountStar1 = this.add.image(-100, 93, 'star').setOrigin(0.5).setScale(0.26);
            const amountStar2 = this.add.image(-70, 93, 'star').setOrigin(0.5).setScale(0.26);
            const amountStar3 = this.add.image(-40, 93, 'star').setOrigin(0.5).setScale(0.26);
            this.healContainer.add([amountStar1, amountStar2, amountStar3]);
            amountStar1.setAlpha(1);
            amountStar2.setAlpha(healAmountLevel >= 1 ? 1 : 0.3);
            amountStar3.setAlpha(healAmountLevel === 2 ? 1 : 0.3);

            //heal amount text
            const healAmountText = this.add.text(
                5,
                90,
                `${this.healAmount}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.healContainer.add(healAmountText);

            const nextLevelAmount = spellsConfig.heal.amount[healAmountLevel + 1];

            // next level
            if (nextLevelAmount) {
                // arrow img
                const healAmountArrow = this.add.image(
                    45,
                    93,
                    'arrow'
                ).setOrigin(0.5).setScale(0.2).setAngle(90);
                this.healContainer.add(healAmountArrow);

                //next lvl amount text
                const nextLevelAmountText = this.add.text(
                    85,
                    90,
                    `${nextLevelAmount.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(nextLevelAmountText);

                //heal Amount Points Needed Text
                const spellPointsNeededText = this.add.text(
                    200,
                    90,
                    `cost:${nextLevelAmount.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 30, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    235,
                    90,
                    'plus-button',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healAmountLevel', healAmountLevel + 1);
                        this.spellPoints -= nextLevelAmount.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.3
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelAmount.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    200,
                    90,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                this.healContainer.add(maxText);
            }

        } else {
            // spell is locked
            this.healImage.setTexture('heal-button-locked');
            const spellPointsToUnlockHeal = main_config.spellPointsToUnlockHeal;

            const unlockButton = new Button(
                this,
                0, 30,
                'unlock',
                '',
                () => {
                    LOCAL_STORAGE_MANAGER.set('healCooldownLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('healTargetsLevel', 0);
                    LOCAL_STORAGE_MANAGER.set('healAmountLevel', 0);
                    this.spellPoints -= spellPointsToUnlockHeal;
                    LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                    this.recreateElements();
                },
                true,
                0.6
            );
            // unlockButton.x += unlockButton.bg.displayWidth / 2;
            this.healContainer.add(unlockButton);

            const unlockSpellPointsImg = this.add.image(unlockButton.x + unlockButton.bg.displayWidth / 2, unlockButton.y, 'spell-point').setOrigin(0.5).setScale(0.25);
            this.healContainer.add(unlockSpellPointsImg);

            //heal  spell Points Needed Text
            const spellPointsNeededText = this.add.text(
                unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth / 2 + 10,
                unlockSpellPointsImg.y,
                `${spellPointsToUnlockHeal}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0.5);
            this.healContainer.add(spellPointsNeededText);

            if (this.spellPoints >= spellPointsToUnlockHeal) {
                unlockButton.setInteractive();
            }
        }
    }
























    changeScene(nextScene: string): void {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(nextScene);
        });
    }

    createBackButton() {
        this.backButton = new Button(this, 100, 950, 'button', 'back', () => {
            this.changeScene('MainMenu');
        });
    }
}
