import { Scene } from 'phaser';
import { DailyQuestTimeHandler } from './in-daily-quest/DailyQuestTimeHandler';
import { DataHandler } from './in-daily-quest/DataHandler';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        // //  A simple progress bar. This is the outline of the bar.
        // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress: number) => {

        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);

        // });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('1', '1.png');
        this.load.image('2', '2.png');
        this.load.image('3', '3.png');
        this.load.image('5', '5.png');
        this.load.image('6', '6.png');
        this.load.image('7', '7.png');
        this.load.image('8', '8.png');
        this.load.image('9', '9.png');
        this.load.image('logo', 'logo.png');
        this.load.image('attack', 'attack.png');
        this.load.image('health', 'health.png');
        this.load.image('shield', 'shield.png');
        this.load.image('vision', 'vision.png');
        this.load.image('star', 'star-full.png');
        this.load.image('arrow', 'arrow.png');
        this.load.image('sword', 'sward.png');
        this.load.image('bg', 'bg3.jpg');
        this.load.image('bg-buy-packs', 'bg11.jpg');
        this.load.image('bg-card-selection', 'bg22.jpg');
        this.load.image('bg-main-menu', 'bg33.jpg');
        this.load.image('bg-map', 'bg44.jpg');
        this.load.image('bg-achievments', 'bg44.jpg');
        this.load.image('bg-casino', 'casino.jpg');
        this.load.image('bow', 'bow.png');
        this.load.image('cloud', 'cloud.png');
        this.load.image('circle', 'circle.png');
        this.load.image('blood-drop', 'blood-drop.png');
        this.load.image('skip', 'skip-btn.png');
        this.load.image('bow-arrow', 'bow-arrow.png');
        this.load.image('green-dot', 'green-dot.png');
        this.load.image('grey-dot', 'grey-dot.png');
        this.load.image('ball', 'ball.png');
        this.load.image('ok-btn', 'ok-btn.png');
        this.load.image('back-btn', 'back-btn.png');
        this.load.image('deck', 'deck.png');
        this.load.image('coin', 'coin.png');
        this.load.image('black-overlay', 'black-overlay.png');
        this.load.image('claim', 'claim.png');
        this.load.image('try-again', 'try-again.png');
        this.load.image('give-up', 'give-up.png');
        this.load.image('upgrade', 'upgrade.png');
        this.load.image('sell-btn', 'sell-btn.png');
        this.load.image('shop-icon', 'shop-icon.png');
        this.load.image('map', 'map.png');
        this.load.image('common-pack', 'common-pack.png');
        this.load.image('silver-pack', 'silver-pack.png');
        this.load.image('gold-pack', 'gold-pack.png');
        this.load.image('buy', 'buy.png');
        this.load.image('bulb', 'bulb.png');
        this.load.image('lvl-plate', 'lvl-plate.png');
        this.load.image('pointer', 'pointer.png');
        this.load.image('location', 'location.png');
        this.load.image('button', 'button.png');
        this.load.image('survival1', 'survival1.png');
        this.load.image('clock', 'clock.png');
        this.load.image('checked', 'checked.png');
        this.load.image('chest', 'chest.png');
        this.load.image('mark', 'mark.png');
        this.load.image('achievements', 'achievements.png');
        this.load.image('info', 'info.png');
        this.load.image('parachute', 'parachute.png');
        this.load.image('question-mark', 'question-mark.png');
        this.load.image('flare', 'flare.png');

        this.load.image('confetti-yellow', 'confetti-yellow.png');
        this.load.image('confetti-orange', 'confetti-orange.png');
        this.load.image('confetti-red', 'confetti-red.png');
        this.load.image('confetti-green', 'confetti-green.png');
        this.load.image('confetti-blue', 'confetti-blue.png');

        this.load.image('world-arrow', 'world-arrow.png');
        this.load.image('gem', 'gem.png');
        this.load.image('slot-circle', 'slot-circle.png');
        this.load.image('slot-machine', 'slot-machine.png');
        this.load.image('on', 'on.png');
        this.load.image('off', 'off.png');

        //  F O N T S
        this.load.font('main-font', 'Oups.otf');

        //  A N I M A T I O N S
        this.load.atlas('meterbox', 'meter-box-win.png', 'meter-box-win.json');
        this.load.atlas('bg-fire', 'bg-fire.png', 'bg-fire.json');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        DailyQuestTimeHandler.initialCheck();
        DataHandler.setInitialAchievements();
        this.scene.start('MainMenu');

    }
}
