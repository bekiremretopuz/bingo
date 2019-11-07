import { LoaderStage } from "./Scenes/LoaderStage"; 
import { LocalStorage } from "./Helper/LocalStorage";
import { WebsocketConnect } from "./Helper/WebsocketConnect";
import { Data } from "./Model/Data"; 
import { StageManager } from "./Helper/StageManager";  
import SoundManager from "./Helper/SoundManager";

export class EntryPoint {
    private static _instance: EntryPoint;
    private _stageManager: StageManager;
    private _localStorage: LocalStorage;
    private _websocket: WebsocketConnect;
    private _data: Data;   
    private _loader: LoaderStage;
    constructor() { 
        EntryPoint._instance = this; 
        this._stageManager = new StageManager();
        this._localStorage = new LocalStorage();
        this._loader = new LoaderStage();  
        this._stageManager.create();
        this._stageManager.createScene("LoaderStage", this._loader);
        this._stageManager.goToScene("LoaderStage"); 
    }

    public createWebSocket(): void{
        this._websocket = new WebsocketConnect();  
        this._websocket.connectWebSocket();
        this._data = new Data(this);
    }

    public get localStorage(): LocalStorage {
        return this._localStorage;
    }

    public get data(): Data {
        return this._data;
    }

    public get sound(): SoundManager{
        return this._loader.assetsLoader.soundManager;
    }

    public get stageManager(): StageManager{
        return this._stageManager;
    }

    public get websocket(): WebsocketConnect {
        return this._websocket;
    }

    public static get instance(): EntryPoint {
        return EntryPoint._instance;
    }
}
