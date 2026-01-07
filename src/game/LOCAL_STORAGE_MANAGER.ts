import { main_config } from "./configs/main_config";
import { IPlayerMonstersData } from "./scenes/in-game/TestPlayerTeam";
import CryptoJS from 'crypto-js';


export interface IGameData {
    lastResetTime: string;
    questStartTime: string;
    coins: number;
    playerMonstersData: IPlayerMonstersData[];
    mapLevel: number;
    levelsWon: number[];
    freeCommonPacks: number;
    freeSilverPacks: number;
    freeGoldPacks: number;
    currentWorld: number;
    worldReached: number;
    gems: number;
    currentLevel: number;
    achievements: [] | null; //???
    questProgress: any; //???
    chests: boolean[]; //???
    survivalLevelData: any; //???

    survival_level_1: any; //?????
    survival_level_2: any; //?????
    survival_level_3: any; //?????
    survival_level_4: any; //?????
    survival_level_5: any; //?????
}

export class LOCAL_STORAGE_MANAGER {

    static STORAGE_KEY = 'game-data';
    private static SECRET_KEY = '123456789';

    // Default values
    private static defaultData: IGameData = {
        coins: main_config.playerStartingCoins,
        playerMonstersData: [],
        mapLevel: 1,
        levelsWon: [],
        freeCommonPacks: main_config.playerStartingFreeCommonPacks,
        freeSilverPacks: 0,
        freeGoldPacks: 0,
        currentWorld: 1,
        worldReached: 1,
        gems: main_config.playerStartingGems,
        currentLevel: 0,
        achievements: null, //????
        questProgress: [], //????
        chests: [], //????
        survivalLevelData: {},//???????

        survival_level_1: null,  //?????
        survival_level_2: null,  //?????
        survival_level_3: null,  //?????
        survival_level_4: null,  //?????
        survival_level_5: null,  //?????

        lastResetTime: '0',
        questStartTime: '',
    };

    static data?: IGameData; // undefined until first access

    static ensureData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                if (main_config.cryptData) {
                    const bytes = CryptoJS.AES.decrypt(stored, this.SECRET_KEY);
                    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    this.data = { ...this.defaultData, ...decrypted };
                } else {
                    this.data = { ...this.defaultData, ...JSON.parse(stored) };
                }
            } catch {
                console.warn('Failed to parse localStorage data, using defaults.');
                this.data = { ...this.defaultData };
            }
        } else {
            this.data = { ...this.defaultData };
            this.save();
        }
    }

    private static save() {
        if (this.data) {
            if (main_config.cryptData) {
                const stringData = JSON.stringify(this.data);
                console.log(this.data);
                const encrypted = CryptoJS.AES.encrypt(stringData, this.SECRET_KEY).toString();
                localStorage.setItem(this.STORAGE_KEY, encrypted);
            } else {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            }
        }
    }

    public static set<T extends keyof IGameData>(key: T, value: IGameData[T]) {
        // this.ensureData();
        this.data![key] = value;
        this.save();
    }

    public static get<T extends keyof IGameData>(key: T): IGameData[T] | null {
        if (this.data) {
            return this.data![key];
        }
        return null;
    }

    public static getAll(): IGameData {
        // this.ensureData();
        return { ...this.data! };
    }

    public static setAll(newData: Partial<IGameData>) {
        // this.ensureData();
        this.data = { ...this.data!, ...newData };
        this.save();
    }

    public static reset() {
        this.data = { ...this.defaultData };
        this.save();
    }

    public static remove<T extends keyof IGameData>(key: T) {
        // this.ensureData();
        if (key in this.data!) {
            delete this.data![key];
            this.save();
        }
    }

    public static clear() {
        localStorage.clear();
    }
}
