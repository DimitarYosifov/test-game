import { getAllMonsterTypes } from "./configs/main_config";
import { LOCAL_STORAGE_MANAGER } from "./LOCAL_STORAGE_MANAGER";
import { IPlayerMonstersData } from "./scenes/in-game/TestPlayerTeam";

export const createDebugPanel = () => {

    let panelVisible = false;

    const app = document.getElementById('app');

    const mainContainer = document.createElement('div');
    // mainContainer.style.width = '80vw';
    // mainContainer.style.height = '60vh';
    mainContainer.style.background = '#c6b6b6';
    mainContainer.style.position = 'absolute';
    mainContainer.style.color = 'black';
    mainContainer.style.fontSize = '1.5em';
    mainContainer.style.display = 'none';

    //add coins-------------------------------------------------------------------------
    const addCoinsContainer = document.createElement('div');
    addCoinsContainer.style.margin = '0.4em'
    addCoinsContainer.style.display = 'flex';
    addCoinsContainer.style['justify-content' as any] = 'center';
    const addCoinsText = document.createElement('span');
    addCoinsText.innerText = 'add coins';
    const addCoinsInput = document.createElement('input');
    addCoinsInput.type = 'number';
    addCoinsInput.value = '1';
    const addCoinsButton = document.createElement('button');
    addCoinsButton.innerText = 'add';
    addCoinsButton.onclick = () => {
        const coins = LOCAL_STORAGE_MANAGER.get('coins');
        LOCAL_STORAGE_MANAGER.set('coins', +(coins as number) + +addCoinsInput.value);
    }
    mainContainer.appendChild(addCoinsContainer);
    addCoinsContainer.appendChild(addCoinsText);
    addCoinsContainer.appendChild(addCoinsInput);
    addCoinsContainer.appendChild(addCoinsButton);

    //add gems-------------------------------------------------------------------------
    const addGemsContainer = document.createElement('div');
    addGemsContainer.style.margin = '0.4em'
    addGemsContainer.style.display = 'flex';
    addGemsContainer.style['justify-content' as any] = 'center';
    const addGemsText = document.createElement('span');
    addGemsText.innerText = 'add gems';
    const addGemsInput = document.createElement('input');
    addGemsInput.type = 'number';
    addGemsInput.value = '1';
    const addGemsButton = document.createElement('button');
    addGemsButton.innerText = 'add';
    addGemsButton.onclick = () => {
        const gems = LOCAL_STORAGE_MANAGER.get('gems');
        LOCAL_STORAGE_MANAGER.set('gems', +(gems as number) + +addGemsInput.value);
    }
    mainContainer.appendChild(addGemsContainer);
    addGemsContainer.appendChild(addGemsText);
    addGemsContainer.appendChild(addGemsInput);
    addGemsContainer.appendChild(addGemsButton);

    //add keys-------------------------------------------------------------------------
    const addKeysContainer = document.createElement('div');
    addKeysContainer.style.margin = '0.4em'
    addKeysContainer.style.display = 'flex';
    addKeysContainer.style['justify-content' as any] = 'center';
    const addKeysText = document.createElement('span');
    addKeysText.innerText = 'add keys';
    const addKeysInput = document.createElement('input');
    addKeysInput.type = 'number';
    addKeysInput.value = '1';
    const addKeysButton = document.createElement('button');
    addKeysButton.innerText = 'add';
    addKeysButton.onclick = () => {
        const keys = LOCAL_STORAGE_MANAGER.get('keys');
        LOCAL_STORAGE_MANAGER.set('keys', +(keys as number) + +addKeysInput.value);
    }
    mainContainer.appendChild(addKeysContainer);
    addKeysContainer.appendChild(addKeysText);
    addKeysContainer.appendChild(addKeysInput);
    addKeysContainer.appendChild(addKeysButton);

    //add free common pack-------------------------------------------------------------------------
    const addFreeCommonPackContainer = document.createElement('div');
    addFreeCommonPackContainer.style.margin = '0.4em'
    addFreeCommonPackContainer.style.display = 'flex';
    addFreeCommonPackContainer.style['justify-content' as any] = 'center';
    const addFreeCommonPackText = document.createElement('span');
    addFreeCommonPackText.innerText = 'add free common packs';
    const addFreeCommonPackInput = document.createElement('input');
    addFreeCommonPackInput.type = 'number';
    addFreeCommonPackInput.value = '1';
    const addFreeCommonPackButton = document.createElement('button');
    addFreeCommonPackButton.innerText = 'add';
    addFreeCommonPackButton.onclick = () => {
        const freeCommonPacks = LOCAL_STORAGE_MANAGER.get('freeCommonPacks');
        LOCAL_STORAGE_MANAGER.set('freeCommonPacks', +(freeCommonPacks as number) + +addFreeCommonPackInput.value);
    }
    mainContainer.appendChild(addFreeCommonPackContainer);
    addFreeCommonPackContainer.appendChild(addFreeCommonPackText);
    addFreeCommonPackContainer.appendChild(addFreeCommonPackInput);
    addFreeCommonPackContainer.appendChild(addFreeCommonPackButton);

    //add free silver pack-------------------------------------------------------------------------
    const addFreeSilverPackContainer = document.createElement('div');
    addFreeSilverPackContainer.style.margin = '0.4em'
    addFreeSilverPackContainer.style.display = 'flex';
    addFreeSilverPackContainer.style['justify-content' as any] = 'center';
    const addFreeSilverPackText = document.createElement('span');
    addFreeSilverPackText.innerText = 'add free silver packs';
    const addFreeSilverPackInput = document.createElement('input');
    addFreeSilverPackInput.type = 'number';
    addFreeSilverPackInput.value = '1';
    const addFreeSilverPackButton = document.createElement('button');
    addFreeSilverPackButton.innerText = 'add';
    addFreeSilverPackButton.onclick = () => {
        const freeSilverPacks = LOCAL_STORAGE_MANAGER.get('freeSilverPacks');
        LOCAL_STORAGE_MANAGER.set('freeSilverPacks', +(freeSilverPacks as number) + +addFreeSilverPackInput.value);
    }
    mainContainer.appendChild(addFreeSilverPackContainer);
    addFreeSilverPackContainer.appendChild(addFreeSilverPackText);
    addFreeSilverPackContainer.appendChild(addFreeSilverPackInput);
    addFreeSilverPackContainer.appendChild(addFreeSilverPackButton);

    //add free gold pack-------------------------------------------------------------------------
    const addFreeGoldPackContainer = document.createElement('div');
    addFreeGoldPackContainer.style.margin = '0.4em'
    addFreeGoldPackContainer.style.display = 'flex';
    addFreeGoldPackContainer.style['justify-content' as any] = 'center';
    const addFreeGoldPackText = document.createElement('span');
    addFreeGoldPackText.innerText = 'add free gold packs';
    const addFreeGoldPackInput = document.createElement('input');
    addFreeGoldPackInput.type = 'number';
    addFreeGoldPackInput.value = '1';
    const addFreeGoldPackButton = document.createElement('button');
    addFreeGoldPackButton.innerText = 'add';
    addFreeGoldPackButton.onclick = () => {
        const freeGoldPacks = LOCAL_STORAGE_MANAGER.get('freeGoldPacks');
        LOCAL_STORAGE_MANAGER.set('freeGoldPacks', +(freeGoldPacks as number) + +addFreeGoldPackInput.value);
    }
    mainContainer.appendChild(addFreeGoldPackContainer);
    addFreeGoldPackContainer.appendChild(addFreeGoldPackText);
    addFreeGoldPackContainer.appendChild(addFreeGoldPackInput);
    addFreeGoldPackContainer.appendChild(addFreeGoldPackButton);

    //go to level-------------------------------------------------------------------------
    const goToLevelContainer = document.createElement('div');
    goToLevelContainer.style.margin = '0.4em'
    goToLevelContainer.style.display = 'flex';
    goToLevelContainer.style['justify-content' as any] = 'center';
    const goToLevelText = document.createElement('span');
    goToLevelText.innerText = 'go to level';
    const goToLevelInput = document.createElement('input');
    goToLevelInput.type = 'number';
    goToLevelInput.value = '1';
    const goToLevelButton = document.createElement('button');
    goToLevelButton.innerText = 'go';
    goToLevelButton.onclick = () => {
        const goToLevel = +goToLevelInput.value;
        LOCAL_STORAGE_MANAGER.set('currentLevel', +goToLevelInput.value);

        const mapLevel = LOCAL_STORAGE_MANAGER.get('mapLevel');
        if ((goToLevel as number) > (mapLevel as number)) {
            LOCAL_STORAGE_MANAGER.set('mapLevel', +(goToLevel as number));
            const levelsWon = [];
            for (let index = 1; index < (goToLevel as number); index++) {
                levelsWon.push(index);

            }
            LOCAL_STORAGE_MANAGER.set('levelsWon', levelsWon);
        }
        const currentWorld = goToLevel > 35 ? 2 : 1;
        LOCAL_STORAGE_MANAGER.set('currentWorld', currentWorld);
    }
    mainContainer.appendChild(goToLevelContainer);
    goToLevelContainer.appendChild(goToLevelText);
    goToLevelContainer.appendChild(goToLevelInput);
    goToLevelContainer.appendChild(goToLevelButton);

    //level reached-------------------------------------------------------------------------
    const levelReachedContainer = document.createElement('div');
    levelReachedContainer.style.margin = '0.4em'
    levelReachedContainer.style.display = 'flex';
    levelReachedContainer.style['justify-content' as any] = 'center';
    const levelReachedText = document.createElement('span');
    levelReachedText.innerText = 'set level reached';
    const levelReachedInput = document.createElement('input');
    levelReachedInput.type = 'number';
    levelReachedInput.value = '1';
    const levelReachedButton = document.createElement('button');
    levelReachedButton.innerText = 'set';
    levelReachedButton.onclick = () => {

        const levelReached = +levelReachedInput.value;

        LOCAL_STORAGE_MANAGER.set('currentLevel', +levelReached);
        LOCAL_STORAGE_MANAGER.set('mapLevel', +levelReached);

        const levelsWon = [];
        for (let index = 1; index < (levelReached as number); index++) {
            levelsWon.push(index);
        }
        LOCAL_STORAGE_MANAGER.set('levelsWon', levelsWon);
        const currentWorld = levelReached > 35 ? 2 : 1;
        LOCAL_STORAGE_MANAGER.set('currentWorld', currentWorld);
    }
    mainContainer.appendChild(levelReachedContainer);
    levelReachedContainer.appendChild(levelReachedText);
    levelReachedContainer.appendChild(levelReachedInput);
    levelReachedContainer.appendChild(levelReachedButton);

    //reset daily quest-------------------------------------------------------------------------
    const resetDailyQuestContainer = document.createElement('div');
    resetDailyQuestContainer.style.margin = '0.4em'
    resetDailyQuestContainer.style.display = 'flex';
    resetDailyQuestContainer.style['justify-content' as any] = 'center';
    const resetDailyQuestText = document.createElement('span');
    resetDailyQuestText.innerText = 'reset daily quests';
    const resetDailyQuestButton = document.createElement('button');
    resetDailyQuestButton.innerText = 'reset';
    resetDailyQuestButton.onclick = () => {
        LOCAL_STORAGE_MANAGER.set('questStartTime', '');
    }
    mainContainer.appendChild(resetDailyQuestContainer);
    resetDailyQuestContainer.appendChild(resetDailyQuestText);
    resetDailyQuestContainer.appendChild(resetDailyQuestButton);

    //reset survival levels-------------------------------------------------------------------------
    const resetSurvivalLevelsContainer = document.createElement('div');
    resetSurvivalLevelsContainer.style.margin = '0.4em'
    resetSurvivalLevelsContainer.style.display = 'flex';
    resetSurvivalLevelsContainer.style['justify-content' as any] = 'center';
    const resetSurvivalLevelsText = document.createElement('span');
    resetSurvivalLevelsText.innerText = 'reset survival levels';
    const resetSurvivalLevelsButton = document.createElement('button');
    resetSurvivalLevelsButton.innerText = 'reset';
    resetSurvivalLevelsButton.onclick = () => {
        LOCAL_STORAGE_MANAGER.set('survival_level_1', null);
        LOCAL_STORAGE_MANAGER.set('survival_level_2', null);
        LOCAL_STORAGE_MANAGER.set('survival_level_3', null);
        LOCAL_STORAGE_MANAGER.set('survival_level_4', null);
        LOCAL_STORAGE_MANAGER.set('survival_level_5', null);
    }
    mainContainer.appendChild(resetSurvivalLevelsContainer);
    resetSurvivalLevelsContainer.appendChild(resetSurvivalLevelsText);
    resetSurvivalLevelsContainer.appendChild(resetSurvivalLevelsButton);

    //add monster-------------------------------------------------------------------------
    const addMonsterContainer = document.createElement('div');
    addMonsterContainer.style.margin = '0.4em'
    addMonsterContainer.style.display = 'flex';
    addMonsterContainer.style['justify-content' as any] = 'center';

    const addMonsterText = document.createElement('span');
    addMonsterText.innerText = 'add monster';

    const monsters = getAllMonsterTypes();
    let currentMonsterIndex = 0;

    const leftArrow = document.createElement('button');
    leftArrow.innerText = '<';
    leftArrow.onclick = () => {
        currentMonsterIndex--;
        if (currentMonsterIndex < 0) {
            currentMonsterIndex = monsters.length - 1;
        }
        monsterImg.src = `./assets/${monsters[currentMonsterIndex]}.png`;
    }

    const monsterImg = document.createElement('img');
    monsterImg.style.width = '2.5em';
    monsterImg.style.height = '2.5em';
    monsterImg.src = `./assets/${monsters[currentMonsterIndex]}.png`;

    const rightArrow = document.createElement('button');
    rightArrow.innerText = '>';
    rightArrow.onclick = () => {
        currentMonsterIndex++;
        if (currentMonsterIndex === monsters.length) {
            currentMonsterIndex = 0;
        }
        monsterImg.src = `./assets/${monsters[currentMonsterIndex]}.png`;
    }

    let starsSelected = 1;
    const star1 = document.createElement('img');
    const star2 = document.createElement('img');
    const star3 = document.createElement('img');
    const star4 = document.createElement('img');
    const star5 = document.createElement('img');

    star1.style.width = '1em';
    star1.style.height = '1em';
    star1.src = `./assets/star-full.png`;
    star1.onclick = () => {
        starsSelected = 1;
        star1.style.opacity = '1';
        star2.style.opacity = '0.4';
        star3.style.opacity = '0.4';
        star4.style.opacity = '0.4';
        star5.style.opacity = '0.4';
    }

    star2.style.width = '1em';
    star2.style.height = '1em';
    star2.src = `./assets/star-full.png`;
    star2.style.opacity = '0.4';
    star2.onclick = () => {
        starsSelected = 2;
        star1.style.opacity = '1';
        star2.style.opacity = '1';
        star3.style.opacity = '0.4';
        star4.style.opacity = '0.4';
        star5.style.opacity = '0.4';
    }

    star3.style.width = '1em';
    star3.style.height = '1em';
    star3.src = `./assets/star-full.png`;
    star3.style.opacity = '0.4';
    star3.onclick = () => {
        starsSelected = 3;
        star1.style.opacity = '1';
        star2.style.opacity = '1';
        star3.style.opacity = '1';
        star4.style.opacity = '0.4';
        star5.style.opacity = '0.4';
    }

    star4.style.width = '1em';
    star4.style.height = '1em';
    star4.src = `./assets/star-full.png`;
    star4.style.opacity = '0.4';
    star4.onclick = () => {
        starsSelected = 4;
        star1.style.opacity = '1';
        star2.style.opacity = '1';
        star3.style.opacity = '1';
        star4.style.opacity = '1';
        star5.style.opacity = '0.4';
    }

    star5.style.width = '1em';
    star5.style.height = '1em';
    star5.src = `./assets/star-full.png`;
    star5.style.opacity = '0.4';
    star5.onclick = () => {
        starsSelected = 5;
        star1.style.opacity = '1';
        star2.style.opacity = '1';
        star3.style.opacity = '1';
        star4.style.opacity = '1';
        star5.style.opacity = '1';
    }

    const addMonsterButton = document.createElement('button');
    addMonsterButton.innerText = 'add';
    addMonsterButton.onclick = () => {
        const monsterType = (monsterImg.src as any).split('/')
            .pop()
            .replace(/\.png$/i, '');
        const monsterStars = starsSelected;
        const monstersData = LOCAL_STORAGE_MANAGER.get('playerMonstersData');
        const newMonster = {
            type: monsterType,
            stars: monsterStars,
            row: NaN,
            col: 11
        }
        monstersData?.push(newMonster);
        console.log(`new monster added  `, newMonster);
        LOCAL_STORAGE_MANAGER.set('playerMonstersData', (monstersData as IPlayerMonstersData[]))
    }

    mainContainer.appendChild(addMonsterContainer);
    addMonsterContainer.appendChild(addMonsterText);
    addMonsterContainer.appendChild(leftArrow);
    addMonsterContainer.appendChild(monsterImg);
    addMonsterContainer.appendChild(rightArrow);
    addMonsterContainer.appendChild(star1);
    addMonsterContainer.appendChild(star2);
    addMonsterContainer.appendChild(star3);
    addMonsterContainer.appendChild(star4);
    addMonsterContainer.appendChild(star5);
    addMonsterContainer.appendChild(addMonsterButton);

    app?.appendChild(mainContainer);

    // toggle visibility when pressing "d"
    document.addEventListener("keydown", function (event) {
        if (event.key === "d" || event.key === "D") {
            panelVisible = !panelVisible;
            mainContainer.style.display = panelVisible ? 'block' : 'none';
        }
    });
}