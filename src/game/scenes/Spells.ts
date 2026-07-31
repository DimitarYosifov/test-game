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

    //heal  
    healCooldown: number;
    healTargets: number;
    healAmount: number;
    healImage: Phaser.GameObjects.Image;
    healContainer: Phaser.GameObjects.Container;

    constructor() {
        super('Spells');
    }

    create() {
        super.create();
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

    createHeader() {
        this.headerContainer = this.add.container(960, 50);
        const spellPointsImage = this.add.image(0, 0, 'spell-point').setOrigin(1, 0.5).setScale(0.35);
        this.spellPointsAvailableText = this.add.text(
            spellPointsImage.x + 10,
            spellPointsImage.y,
            `${this.spellPoints} available`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(0, 0.5);
        this.headerContainer.add([spellPointsImage, this.spellPointsAvailableText]);
    }

    createMagicBallSection() {

        const magicBallCooldownLevel = LOCAL_STORAGE_MANAGER.get('magicBallCooldownLevel');
        const magicBallTargetsLevel = LOCAL_STORAGE_MANAGER.get('magicBallTargetsLevel');
        const magicBallDamageLevel = LOCAL_STORAGE_MANAGER.get('magicBallDamageLevel')

        this.magicBallContainer = this.add.container(850, 180);
        // title
        const magicBallTitleText = this.add.text(
            0,
            0,
            `magic ball`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.magicBallContainer.add(magicBallTitleText);

        // icon
        this.magicBallImage = this.add.image(10, 0, 'magic-ball-button').setOrigin(0, 0.5).setScale(0.45);
        this.magicBallContainer.add(this.magicBallImage);

        //magic ball cooldown img

        if (!isNaN(magicBallCooldownLevel) && magicBallCooldownLevel !== null) {

            //========================== MAGIC BALL COOLDOWN=================================
            const magicBallCooldownImage = this.add.image(this.magicBallImage.x + this.magicBallImage.displayWidth + 35, this.magicBallImage.y - this.magicBallImage.displayHeight / 3 - 20, 'cooldown').setOrigin(0, 0.5).setScale(0.2);
            this.magicBallContainer.add(magicBallCooldownImage);
            this.magicBallCooldown = spellsConfig.magicBall.coolDown[magicBallCooldownLevel].value;
            //magic ball cooldown text
            const magicBallCooldownText = this.add.text(
                magicBallCooldownImage.x + magicBallCooldownImage.displayWidth + 10,
                magicBallCooldownImage.y,
                `${this.magicBallCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.magicBallContainer.add(magicBallCooldownText);

            const nextLevelCooldown = spellsConfig.magicBall.coolDown[magicBallCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const magicBallCooldownArrow = this.add.image(
                    magicBallCooldownText.x + magicBallCooldownText.displayWidth + 50,
                    magicBallCooldownText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.magicBallContainer.add(magicBallCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    magicBallCooldownArrow.x + magicBallCooldownArrow.displayWidth + 20,
                    magicBallCooldownArrow.y,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(nextLevelCooldownText);

                const unlockSpellPointsImg = this.add.image(nextLevelCooldownText.x + nextLevelCooldownText.displayWidth + 50, nextLevelCooldownText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.magicBallContainer.add(unlockSpellPointsImg);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallCooldownLevel', magicBallCooldownLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', 0);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    magicBallCooldownText.x + magicBallCooldownText.displayWidth + 50,
                    magicBallCooldownText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(maxText);
            }

            //========================== MAGIC BALL TARGETS=================================
            //magic ball targets img
            this.magicBallTargets = spellsConfig.magicBall.targets[magicBallTargetsLevel].value;
            const magicBallTargetsImage = this.add.image(this.magicBallImage.x + this.magicBallImage.displayWidth + 35, this.magicBallImage.y, 'number-of-targets').setOrigin(0, 0.5).setScale(0.2);
            this.magicBallContainer.add(magicBallTargetsImage);

            //magic ball targets text
            const magicBallTargetsText = this.add.text(
                magicBallTargetsImage.x + magicBallTargetsImage.displayWidth + 10,
                magicBallTargetsImage.y,
                `${this.magicBallTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.magicBallContainer.add(magicBallTargetsText);

            const nextLevelTargets = spellsConfig.magicBall.targets[magicBallTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const magicBallTargetsArrow = this.add.image(
                    magicBallTargetsText.x + magicBallTargetsText.displayWidth + 50,
                    magicBallTargetsText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.magicBallContainer.add(magicBallTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    magicBallTargetsArrow.x + magicBallTargetsArrow.displayWidth + 20,
                    magicBallTargetsArrow.y,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(nextLevelTargetsText);

                const unlockSpellPointsImg = this.add.image(nextLevelTargetsText.x + nextLevelTargetsText.displayWidth + 50, nextLevelTargetsText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.magicBallContainer.add(unlockSpellPointsImg);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', magicBallTargetsLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', 0);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    magicBallTargetsText.x + magicBallTargetsText.displayWidth + 50,
                    magicBallTargetsText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(maxText);
            }

            //========================== MAGIC BALL DAMAGE =================================
            //magic ball damage img
            this.magicBallDamage = spellsConfig.magicBall.damage[magicBallDamageLevel].value;
            const magicBallDamageImage = this.add.image(this.magicBallImage.x + this.magicBallImage.displayWidth + 35, this.magicBallImage.y + this.magicBallImage.displayHeight / 3 + 20, 'ball-black-and-white').setOrigin(0, 0.5).setScale(0.2);
            this.magicBallContainer.add(magicBallDamageImage);

            //magic ball damage text
            const magicBallDamageText = this.add.text(
                magicBallDamageImage.x + magicBallDamageImage.displayWidth + 10,
                magicBallDamageImage.y,
                `${this.magicBallDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.magicBallContainer.add(magicBallDamageText);

            const nextLevelDamage = spellsConfig.magicBall.damage[magicBallDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const magicBallDamageArrow = this.add.image(
                    magicBallDamageText.x + magicBallDamageText.displayWidth + 50,
                    magicBallDamageText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.magicBallContainer.add(magicBallDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    magicBallDamageArrow.x + magicBallDamageArrow.displayWidth + 20,
                    magicBallDamageArrow.y,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(nextLevelDamageText);

                const unlockSpellPointsImg = this.add.image(nextLevelDamageText.x + nextLevelDamageText.displayWidth + 50, nextLevelDamageText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.magicBallContainer.add(unlockSpellPointsImg);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', magicBallDamageLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('magicBallDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('magicBallTargetsLevel', 0);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.magicBallContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    magicBallDamageText.x + magicBallDamageText.displayWidth + 50,
                    magicBallDamageText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.magicBallContainer.add(maxText);
            }
        } else {
            // spell is locked
            this.magicBallImage.setTexture('magic-ball-button-locked');
            const spellPointsToUnlockMagicBall = main_config.spellPointsToUnlockMagicBall;

            const unlockButton = new Button(
                this,
                this.magicBallImage.x + this.magicBallImage.displayWidth + 10,
                this.magicBallImage.y,
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
            unlockButton.x += unlockButton.bg.displayWidth / 2;
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

        this.poisonContainer = this.add.container(850, 380);
        // title
        const poisonTitleText = this.add.text(
            0,
            0,
            `poison`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.poisonContainer.add(poisonTitleText);

        // icon
        this.poisonImage = this.add.image(10, 0, 'poison-button').setOrigin(0, 0.5).setScale(0.45);
        this.poisonContainer.add(this.poisonImage);

        //poison ball cooldown img

        if (!isNaN(poisonCooldownLevel) && poisonCooldownLevel !== null) {

            //========================== POISON COOLDOWN=================================
            const poisonCooldownImage = this.add.image(this.poisonImage.x + this.poisonImage.displayWidth + 35, this.poisonImage.y - 75, 'cooldown').setOrigin(0, 0.5).setScale(0.2);
            this.poisonContainer.add(poisonCooldownImage);
            this.poisonCooldown = spellsConfig.poison.coolDown[poisonCooldownLevel].value;
            //poison ball cooldown text
            const poisonCooldownText = this.add.text(
                poisonCooldownImage.x + poisonCooldownImage.displayWidth + 10,
                poisonCooldownImage.y,
                `${this.poisonCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonCooldownText);

            const nextLevelCooldown = spellsConfig.poison.coolDown[poisonCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const poisonCooldownArrow = this.add.image(
                    poisonCooldownText.x + poisonCooldownText.displayWidth + 50,
                    poisonCooldownText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.poisonContainer.add(poisonCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    poisonCooldownArrow.x + poisonCooldownArrow.displayWidth + 20,
                    poisonCooldownArrow.y,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(nextLevelCooldownText);

                const unlockSpellPointsImg = this.add.image(nextLevelCooldownText.x + nextLevelCooldownText.displayWidth + 50, nextLevelCooldownText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.poisonContainer.add(unlockSpellPointsImg);

                //poison ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonCooldownLevel', poisonCooldownLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    poisonCooldownText.x + poisonCooldownText.displayWidth + 50,
                    poisonCooldownText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON TARGETS=================================
            //poison ball targets img
            this.poisonTargets = spellsConfig.poison.targets[poisonTargetsLevel].value;
            const poisonTargetsImage = this.add.image(this.poisonImage.x + this.poisonImage.displayWidth + 35, this.poisonImage.y - 25, 'number-of-targets').setOrigin(0, 0.5).setScale(0.2);
            this.poisonContainer.add(poisonTargetsImage);

            //poison ball targets text
            const poisonTargetsText = this.add.text(
                poisonTargetsImage.x + poisonTargetsImage.displayWidth + 10,
                poisonTargetsImage.y,
                `${this.poisonTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonTargetsText);

            const nextLevelTargets = spellsConfig.poison.targets[poisonTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const poisonTargetsArrow = this.add.image(
                    poisonTargetsText.x + poisonTargetsText.displayWidth + 50,
                    poisonTargetsText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.poisonContainer.add(poisonTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    poisonTargetsArrow.x + poisonTargetsArrow.displayWidth + 20,
                    poisonTargetsArrow.y,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(nextLevelTargetsText);

                const unlockSpellPointsImg = this.add.image(nextLevelTargetsText.x + nextLevelTargetsText.displayWidth + 50, nextLevelTargetsText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.poisonContainer.add(unlockSpellPointsImg);

                //poison spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', poisonTargetsLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    poisonTargetsText.x + poisonTargetsText.displayWidth + 50,
                    poisonTargetsText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON DAMAGE =================================
            //poison damage img
            this.poisonDamage = spellsConfig.poison.damage[poisonDamageLevel].value;
            const poisonDamageImage = this.add.image(this.poisonImage.x + this.poisonImage.displayWidth + 35, this.poisonImage.y + 25, 'ball-black-and-white').setOrigin(0, 0.5).setScale(0.2);
            this.poisonContainer.add(poisonDamageImage);

            //poison ball damage text
            const poisonDamageText = this.add.text(
                poisonDamageImage.x + poisonDamageImage.displayWidth + 10,
                poisonDamageImage.y,
                `${this.poisonDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonDamageText);

            const nextLevelDamage = spellsConfig.poison.damage[poisonDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const poisonDamageArrow = this.add.image(
                    poisonDamageText.x + poisonDamageText.displayWidth + 50,
                    poisonDamageText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.poisonContainer.add(poisonDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    poisonDamageArrow.x + poisonDamageArrow.displayWidth + 20,
                    poisonDamageArrow.y,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(nextLevelDamageText);

                const unlockSpellPointsImg = this.add.image(nextLevelDamageText.x + nextLevelDamageText.displayWidth + 50, nextLevelDamageText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.poisonContainer.add(unlockSpellPointsImg);

                //poison ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', poisonDamageLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    poisonDamageText.x + poisonDamageText.displayWidth + 50,
                    poisonDamageText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(maxText);
            }

            //========================== POISON DURATION =================================
            //poison ball damage img
            this.poisonDuration = spellsConfig.poison.duration[poisonDurationLevel].value;
            const poisonDurationImage = this.add.image(this.poisonImage.x + this.poisonImage.displayWidth + 35, this.poisonImage.y + 75, 'duration').setOrigin(0, 0.5).setScale(0.2);
            this.poisonContainer.add(poisonDurationImage);

            //poison  Duration text
            const poisonDurationText = this.add.text(
                poisonDurationImage.x + poisonDurationImage.displayWidth + 10,
                poisonDurationImage.y,
                `${this.poisonDuration}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.poisonContainer.add(poisonDurationText);

            const nextLevelDuration = spellsConfig.poison.duration[poisonDurationLevel + 1];

            // next level
            if (nextLevelDuration) {
                // arrow img
                const poisonDurationArrow = this.add.image(
                    poisonDurationText.x + poisonDurationText.displayWidth + 50,
                    poisonDurationText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.poisonContainer.add(poisonDurationArrow);

                //next lvl Duration text
                const nextLevelDurationText = this.add.text(
                    poisonDurationArrow.x + poisonDurationArrow.displayWidth + 20,
                    poisonDurationArrow.y,
                    `${nextLevelDuration.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(nextLevelDurationText);

                const unlockSpellPointsImg = this.add.image(nextLevelDurationText.x + nextLevelDurationText.displayWidth + 50, nextLevelDurationText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.poisonContainer.add(unlockSpellPointsImg);

                //poison Duration Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelDuration.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('poisonDurationLevel', poisonDurationLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelDuration.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.poisonContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDuration.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    poisonDurationText.x + poisonDurationText.displayWidth + 50,
                    poisonDurationText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.poisonContainer.add(maxText);
            }

        } else {
            // spell is locked
            this.poisonImage.setTexture('poison-button-locked');
            const spellPointsToUnlockpoison = main_config.spellPointsToUnlockPoison;

            const unlockButton = new Button(
                this,
                this.poisonImage.x + this.poisonImage.displayWidth + 10,
                this.poisonImage.y,
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
            unlockButton.x += unlockButton.bg.displayWidth / 2;
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

        const rainOfArrowsCooldownLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsCooldownLevel');
        const rainOfArrowsTargetsLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsTargetsLevel');
        const rainOfArrowsDamageLevel = LOCAL_STORAGE_MANAGER.get('rainOfArrowsDamageLevel')

        this.rainOfArrowsContainer = this.add.container(850, 580);
        // title
        const rainOfArrowsTitleText = this.add.text(
            0,
            0,
            `rain of arrows`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.rainOfArrowsContainer.add(rainOfArrowsTitleText);

        // icon
        this.rainOfArrowsImage = this.add.image(10, 0, 'rain-of-arrows-button').setOrigin(0, 0.5).setScale(0.45);
        this.rainOfArrowsContainer.add(this.rainOfArrowsImage);

        //rain of arrows cooldown img

        if (!isNaN(rainOfArrowsCooldownLevel) && rainOfArrowsCooldownLevel !== null) {

            //========================== RAIN OF ARROWS COOLDOWN=================================
            const rainOfArrowsCooldownImage = this.add.image(this.rainOfArrowsImage.x + this.rainOfArrowsImage.displayWidth + 35, this.rainOfArrowsImage.y - this.rainOfArrowsImage.displayHeight / 3 - 20, 'cooldown').setOrigin(0, 0.5).setScale(0.2);
            this.rainOfArrowsContainer.add(rainOfArrowsCooldownImage);
            this.rainOfArrowsCooldown = spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel].value;
            // rain of arrows cooldown text
            const rainOfArrowsCooldownText = this.add.text(
                rainOfArrowsCooldownImage.x + rainOfArrowsCooldownImage.displayWidth + 10,
                rainOfArrowsCooldownImage.y,
                `${this.rainOfArrowsCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsCooldownText);

            const nextLevelCooldown = spellsConfig.rainOfArrows.coolDown[rainOfArrowsCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const rainOfArrowsCooldownArrow = this.add.image(
                    rainOfArrowsCooldownText.x + rainOfArrowsCooldownText.displayWidth + 50,
                    rainOfArrowsCooldownText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    rainOfArrowsCooldownArrow.x + rainOfArrowsCooldownArrow.displayWidth + 20,
                    rainOfArrowsCooldownArrow.y,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(nextLevelCooldownText);

                const unlockSpellPointsImg = this.add.image(nextLevelCooldownText.x + nextLevelCooldownText.displayWidth + 50, nextLevelCooldownText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.rainOfArrowsContainer.add(unlockSpellPointsImg);

                //rain of arrows spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsCooldownLevel', rainOfArrowsCooldownLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', 0);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    rainOfArrowsCooldownText.x + rainOfArrowsCooldownText.displayWidth + 50,
                    rainOfArrowsCooldownText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(maxText);
            }

            //========================== RAIN OF ARROWS TARGETS=================================
            // rain of arrows targets img
            this.rainOfArrowsTargets = spellsConfig.rainOfArrows.targets[rainOfArrowsTargetsLevel].value;
            const rainOfArrowsTargetsImage = this.add.image(this.rainOfArrowsImage.x + this.rainOfArrowsImage.displayWidth + 35, this.rainOfArrowsImage.y, 'number-of-targets').setOrigin(0, 0.5).setScale(0.2);
            this.rainOfArrowsContainer.add(rainOfArrowsTargetsImage);

            // rain of arrows targets text
            const rainOfArrowsTargetsText = this.add.text(
                rainOfArrowsTargetsImage.x + rainOfArrowsTargetsImage.displayWidth + 10,
                rainOfArrowsTargetsImage.y,
                `${this.rainOfArrowsTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsTargetsText);

            const nextLevelTargets = spellsConfig.rainOfArrows.targets[rainOfArrowsTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const rainOfArrowsTargetsArrow = this.add.image(
                    rainOfArrowsTargetsText.x + rainOfArrowsTargetsText.displayWidth + 50,
                    rainOfArrowsTargetsText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    rainOfArrowsTargetsArrow.x + rainOfArrowsTargetsArrow.displayWidth + 20,
                    rainOfArrowsTargetsArrow.y,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(nextLevelTargetsText);

                const unlockSpellPointsImg = this.add.image(nextLevelTargetsText.x + nextLevelTargetsText.displayWidth + 50, nextLevelTargetsText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.rainOfArrowsContainer.add(unlockSpellPointsImg);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', rainOfArrowsTargetsLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', 0);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    rainOfArrowsTargetsText.x + rainOfArrowsTargetsText.displayWidth + 50,
                    rainOfArrowsTargetsText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(maxText);
            }

            //========================== RAIN OF ARROWS DAMAGE =================================
            // rain of arrows damage img
            this.rainOfArrowsDamage = spellsConfig.rainOfArrows.damage[rainOfArrowsDamageLevel].value;
            const rainOfArrowsDamageImage = this.add.image(this.rainOfArrowsImage.x + this.rainOfArrowsImage.displayWidth + 35, this.rainOfArrowsImage.y + this.rainOfArrowsImage.displayHeight / 3 + 20, 'bow-black-and-white').setOrigin(0, 0.5).setScale(0.2);
            this.rainOfArrowsContainer.add(rainOfArrowsDamageImage);

            // rain of arrows damage text
            const rainOfArrowsDamageText = this.add.text(
                rainOfArrowsDamageImage.x + rainOfArrowsDamageImage.displayWidth + 10,
                rainOfArrowsDamageImage.y,
                `${this.rainOfArrowsDamage}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.rainOfArrowsContainer.add(rainOfArrowsDamageText);

            const nextLevelDamage = spellsConfig.rainOfArrows.damage[rainOfArrowsDamageLevel + 1];

            // next level
            if (nextLevelDamage) {
                // arrow img
                const rainOfArrowsDamageArrow = this.add.image(
                    rainOfArrowsDamageText.x + rainOfArrowsDamageText.displayWidth + 50,
                    rainOfArrowsDamageText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.rainOfArrowsContainer.add(rainOfArrowsDamageArrow);

                //next lvl damage text
                const nextLevelDamageText = this.add.text(
                    rainOfArrowsDamageArrow.x + rainOfArrowsDamageArrow.displayWidth + 20,
                    rainOfArrowsDamageArrow.y,
                    `${nextLevelDamage.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(nextLevelDamageText);

                const unlockSpellPointsImg = this.add.image(nextLevelDamageText.x + nextLevelDamageText.displayWidth + 50, nextLevelDamageText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.rainOfArrowsContainer.add(unlockSpellPointsImg);

                //magic ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelDamage.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', rainOfArrowsDamageLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('rainOfArrowsTargetsLevel', 0);
                        this.spellPoints -= nextLevelDamage.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.rainOfArrowsContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDamage.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    rainOfArrowsDamageText.x + rainOfArrowsDamageText.displayWidth + 50,
                    rainOfArrowsDamageText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.rainOfArrowsContainer.add(maxText);
            }
        } else {
            // spell is locked
            this.rainOfArrowsImage.setTexture('magic-ball-button-locked');
            const spellPointsToUnlockrainOfArrows = main_config.spellPointsToUnlockRainOfArrows;

            const unlockButton = new Button(
                this,
                this.rainOfArrowsImage.x + this.rainOfArrowsImage.displayWidth + 10,
                this.rainOfArrowsImage.y,
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
            unlockButton.x += unlockButton.bg.displayWidth / 2;
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

        this.freezeContainer = this.add.container(850, 760);
        // title
        const freezeTitleText = this.add.text(
            0,
            0,
            `freeze`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.freezeContainer.add(freezeTitleText);

        // icon
        this.freezeImage = this.add.image(10, 0, 'freeze-button').setOrigin(0, 0.5).setScale(0.45);
        this.freezeContainer.add(this.freezeImage);

        //freeze ball cooldown img

        if (!isNaN(freezeCooldownLevel) && freezeCooldownLevel !== null) {

            //========================== FREEZE COOLDOWN=================================
            const freezeCooldownImage = this.add.image(this.freezeImage.x + this.freezeImage.displayWidth + 35, this.freezeImage.y - this.freezeImage.displayHeight / 3 - 20, 'cooldown').setOrigin(0, 0.5).setScale(0.2);
            this.freezeContainer.add(freezeCooldownImage);
            this.freezeCooldown = spellsConfig.freeze.coolDown[freezeCooldownLevel].value;
            //freeze ball cooldown text
            const freezeCooldownText = this.add.text(
                freezeCooldownImage.x + freezeCooldownImage.displayWidth + 10,
                freezeCooldownImage.y,
                `${this.freezeCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeCooldownText);

            const nextLevelCooldown = spellsConfig.freeze.coolDown[freezeCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const freezeCooldownArrow = this.add.image(
                    freezeCooldownText.x + freezeCooldownText.displayWidth + 50,
                    freezeCooldownText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.freezeContainer.add(freezeCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    freezeCooldownArrow.x + freezeCooldownArrow.displayWidth + 20,
                    freezeCooldownArrow.y,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(nextLevelCooldownText);

                const unlockSpellPointsImg = this.add.image(nextLevelCooldownText.x + nextLevelCooldownText.displayWidth + 50, nextLevelCooldownText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.freezeContainer.add(unlockSpellPointsImg);

                //freeze ball spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeCooldownLevel', freezeCooldownLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    freezeCooldownText.x + freezeCooldownText.displayWidth + 50,
                    freezeCooldownText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(maxText);
            }

            //========================== FREEZE TARGETS=================================
            //freeze ball targets img
            this.freezeTargets = spellsConfig.poison.targets[freezeTargetsLevel].value;
            const freezeTargetsImage = this.add.image(this.freezeImage.x + this.freezeImage.displayWidth + 35, this.freezeImage.y, 'number-of-targets').setOrigin(0, 0.5).setScale(0.2);
            this.freezeContainer.add(freezeTargetsImage);

            //freeze ball targets text
            const freezeTargetsText = this.add.text(
                freezeTargetsImage.x + freezeTargetsImage.displayWidth + 10,
                freezeTargetsImage.y,
                `${this.freezeTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeTargetsText);

            const nextLevelTargets = spellsConfig.freeze.targets[freezeTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const freezeTargetsArrow = this.add.image(
                    freezeTargetsText.x + freezeTargetsText.displayWidth + 50,
                    freezeTargetsText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.freezeContainer.add(freezeTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    freezeTargetsArrow.x + freezeTargetsArrow.displayWidth + 20,
                    freezeTargetsArrow.y,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(nextLevelTargetsText);

                const unlockSpellPointsImg = this.add.image(nextLevelTargetsText.x + nextLevelTargetsText.displayWidth + 50, nextLevelTargetsText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.freezeContainer.add(unlockSpellPointsImg);

                //freeze spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeTargetsLevel', freezeTargetsLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    freezeTargetsText.x + freezeTargetsText.displayWidth + 50,
                    freezeTargetsText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(maxText);
            }

            //========================== POISON DURATION =================================
            // freeze ball damage img
            this.freezeDuration = spellsConfig.freeze.duration[freezeDurationLevel].value;
            const freezeDurationImage = this.add.image(this.freezeImage.x + this.freezeImage.displayWidth + 35, this.freezeImage.y + this.freezeImage.displayHeight / 3 + 20, 'duration').setOrigin(0, 0.5).setScale(0.2);
            this.freezeContainer.add(freezeDurationImage);

            //freeze  Duration text
            const freezeDurationText = this.add.text(
                freezeDurationImage.x + freezeDurationImage.displayWidth + 10,
                freezeDurationImage.y,
                `${this.freezeDuration}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.freezeContainer.add(freezeDurationText);

            const nextLevelDuration = spellsConfig.freeze.duration[freezeDurationLevel + 1];

            // next level
            if (nextLevelDuration) {
                // arrow img
                const freezeDurationArrow = this.add.image(
                    freezeDurationText.x + freezeDurationText.displayWidth + 50,
                    freezeDurationText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.freezeContainer.add(freezeDurationArrow);

                //next lvl Duration text
                const nextLevelDurationText = this.add.text(
                    freezeDurationArrow.x + freezeDurationArrow.displayWidth + 20,
                    freezeDurationArrow.y,
                    `${nextLevelDuration.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(nextLevelDurationText);

                const unlockSpellPointsImg = this.add.image(nextLevelDurationText.x + nextLevelDurationText.displayWidth + 50, nextLevelDurationText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.freezeContainer.add(unlockSpellPointsImg);

                //freeze Duration Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelDuration.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('freezeDurationLevel', freezeDurationLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelDuration.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.freezeContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelDuration.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    freezeDurationText.x + freezeDurationText.displayWidth + 50,
                    freezeDurationText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.freezeContainer.add(maxText);
            }

        } else {
            // spell is locked
            this.freezeImage.setTexture('freeze-button-locked');
            const spellPointsToUnlockFreeze = main_config.spellPointsToUnlockFreeze;

            const unlockButton = new Button(
                this,
                this.freezeImage.x + this.freezeImage.displayWidth + 10,
                this.freezeImage.y,
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
            unlockButton.x += unlockButton.bg.displayWidth / 2;
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

        const healCooldownLevel = LOCAL_STORAGE_MANAGER.get('healCooldownLevel');
        const healTargetsLevel = LOCAL_STORAGE_MANAGER.get('healTargetsLevel');
        const healAmountLevel = LOCAL_STORAGE_MANAGER.get('healAmountLevel')

        this.healContainer = this.add.container(850, 940);
        // title
        const healTitleText = this.add.text(
            0,
            0,
            `heal`,
            {
                fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                stroke: '#000000', letterSpacing: 4,
                align: 'center'
            }).setOrigin(1, 0.5);
        this.healContainer.add(healTitleText);

        // icon
        this.healImage = this.add.image(10, 0, 'heal-button').setOrigin(0, 0.5).setScale(0.45);
        this.healContainer.add(this.healImage);

        //heal ball cooldown img

        if (!isNaN(healCooldownLevel) && healCooldownLevel !== null) {

            //========================== HEAL COOLDOWN=================================
            const healCooldownImage = this.add.image(this.healImage.x + this.healImage.displayWidth + 35, this.healImage.y - this.healImage.displayHeight / 3 - 20, 'cooldown').setOrigin(0, 0.5).setScale(0.2);
            this.healContainer.add(healCooldownImage);
            this.healCooldown = spellsConfig.heal.coolDown[healCooldownLevel].value;
            //heal cooldown text
            const healCooldownText = this.add.text(
                healCooldownImage.x + healCooldownImage.displayWidth + 10,
                healCooldownImage.y,
                `${this.healCooldown}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.healContainer.add(healCooldownText);

            const nextLevelCooldown = spellsConfig.heal.coolDown[healCooldownLevel + 1];

            // next level
            if (nextLevelCooldown) {
                // arrow img
                const healCooldownArrow = this.add.image(
                    healCooldownText.x + healCooldownText.displayWidth + 50,
                    healCooldownText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.healContainer.add(healCooldownArrow);

                //next lvl cooldown text
                const nextLevelCooldownText = this.add.text(
                    healCooldownArrow.x + healCooldownArrow.displayWidth + 20,
                    healCooldownArrow.y,
                    `${nextLevelCooldown.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(nextLevelCooldownText);

                const unlockSpellPointsImg = this.add.image(nextLevelCooldownText.x + nextLevelCooldownText.displayWidth + 50, nextLevelCooldownText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.healContainer.add(unlockSpellPointsImg);

                //heal spell Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelCooldown.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healCooldownLevel', healCooldownLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelCooldown.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelCooldown.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    healCooldownText.x + healCooldownText.displayWidth + 50,
                    healCooldownText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(maxText);
            }

            //========================== HEAL TARGETS=================================
            // heal targets img
            this.healTargets = spellsConfig.poison.targets[healTargetsLevel].value;
            const healTargetsImage = this.add.image(this.healImage.x + this.healImage.displayWidth + 35, this.healImage.y, 'number-of-targets').setOrigin(0, 0.5).setScale(0.2);
            this.healContainer.add(healTargetsImage);

            // heal targets text
            const healTargetsText = this.add.text(
                healTargetsImage.x + healTargetsImage.displayWidth + 10,
                healTargetsImage.y,
                `${this.healTargets}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.healContainer.add(healTargetsText);

            const nextLevelTargets = spellsConfig.heal.targets[healTargetsLevel + 1];

            // next level
            if (nextLevelTargets) {
                // arrow img
                const healTargetsArrow = this.add.image(
                    healTargetsText.x + healTargetsText.displayWidth + 50,
                    healTargetsText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.healContainer.add(healTargetsArrow);

                //next lvl targets text
                const nextLevelTargetsText = this.add.text(
                    healTargetsArrow.x + healTargetsArrow.displayWidth + 20,
                    healTargetsArrow.y,
                    `${nextLevelTargets.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(nextLevelTargetsText);

                const unlockSpellPointsImg = this.add.image(nextLevelTargetsText.x + nextLevelTargetsText.displayWidth + 50, nextLevelTargetsText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.healContainer.add(unlockSpellPointsImg);

                // heal Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelTargets.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healTargetsLevel', healTargetsLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelTargets.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelTargets.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    healTargetsText.x + healTargetsText.displayWidth + 50,
                    healTargetsText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(maxText);
            }

            //========================== HEAL AMOUNT =================================
            // heal amount img
            this.healAmount = spellsConfig.heal.amount[healAmountLevel].value;
            const healAmountImage = this.add.image(this.healImage.x + this.healImage.displayWidth + 35, this.healImage.y + this.healImage.displayHeight / 3 + 20, 'duration').setOrigin(0, 0.5).setScale(0.2);
            this.healContainer.add(healAmountImage);

            //heal amount text
            const healAmountText = this.add.text(
                healAmountImage.x + healAmountImage.displayWidth + 10,
                healAmountImage.y,
                `${this.healAmount}`,
                {
                    fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                    stroke: '#000000', letterSpacing: 4,
                    align: 'center'
                }).setOrigin(0, 0.5);
            this.healContainer.add(healAmountText);

            const nextLevelAmount = spellsConfig.heal.amount[healAmountLevel + 1];

            // next level
            if (nextLevelAmount) {
                // arrow img
                const healAmountArrow = this.add.image(
                    healAmountText.x + healAmountText.displayWidth + 50,
                    healAmountText.y,
                    'arrow'
                ).setOrigin(0.5).setScale(0.3).setAngle(90);
                this.healContainer.add(healAmountArrow);

                //next lvl amount text
                const nextLevelAmountText = this.add.text(
                    healAmountArrow.x + healAmountArrow.displayWidth + 20,
                    healAmountArrow.y,
                    `${nextLevelAmount.value}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(nextLevelAmountText);

                const unlockSpellPointsImg = this.add.image(nextLevelAmountText.x + nextLevelAmountText.displayWidth + 50, nextLevelAmountText.y, 'spell-point').setOrigin(0, 0.5).setScale(0.25);
                this.healContainer.add(unlockSpellPointsImg);

                //heal Amount Points Needed Text
                const spellPointsNeededText = this.add.text(
                    unlockSpellPointsImg.x + unlockSpellPointsImg.displayWidth + 10,
                    unlockSpellPointsImg.y,
                    `${nextLevelAmount.cost}`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(spellPointsNeededText);

                // upgrade button
                const upgradeButton = new Button(
                    this,
                    spellPointsNeededText.x + spellPointsNeededText.displayWidth,
                    spellPointsNeededText.y,
                    'upgrade',
                    '',
                    () => {
                        LOCAL_STORAGE_MANAGER.set('healAmountLevel', healAmountLevel + 1);
                        // LOCAL_STORAGE_MANAGER.set('poisonDamageLevel', 0);
                        // LOCAL_STORAGE_MANAGER.set('poisonTargetsLevel', 0);
                        this.spellPoints -= nextLevelAmount.cost;
                        LOCAL_STORAGE_MANAGER.set('spellPoints', this.spellPoints);
                        this.recreateElements();
                    },
                    true,
                    0.35
                );
                upgradeButton.x += upgradeButton.bg.displayWidth / 2;
                this.healContainer.add(upgradeButton);
                if (this.spellPoints >= nextLevelAmount.cost) {
                    upgradeButton.setInteractive();
                }
            } else {
                // SPELL MAXED
                const maxText = this.add.text(
                    healAmountText.x + healAmountText.displayWidth + 50,
                    healAmountText.y,
                    `max`,
                    {
                        fontFamily: 'main-font', padding: { left: 2, right: 4, top: 0, bottom: 0 }, fontSize: 35, color: '#ffffff',
                        stroke: '#000000', letterSpacing: 4,
                        align: 'center'
                    }).setOrigin(0, 0.5);
                this.healContainer.add(maxText);
            }

        } else {
            // spell is locked
            this.healImage.setTexture('heal-button-locked');
            const spellPointsToUnlockHeal = main_config.spellPointsToUnlockHeal;

            const unlockButton = new Button(
                this,
                this.healImage.x + this.healImage.displayWidth + 10,
                this.healImage.y,
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
            unlockButton.x += unlockButton.bg.displayWidth / 2;
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
            this.headerContainer.add(spellPointsNeededText);

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
