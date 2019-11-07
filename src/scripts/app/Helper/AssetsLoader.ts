import { Asset, AssetPriority, LoadAsset, PixiAssetsLoader, SoundAsset } from "pixi-assets-loader";  
import SoundManager from "./SoundManager";
  
export class AssetsLoader extends PIXI.utils.EventEmitter { 
    private _loader: PixiAssetsLoader;
    private _assetsCount: { [key: number]: { total: number, progress: number } } = {};
    private _totalAssets: number;
    private _loadingProgress: number; 
    private _soundManager: SoundManager = new SoundManager();
    private _isSoundLoaded: boolean;
    private _soundCount: number = 0;
    private _doubleCheck: boolean = false;
    constructor() {
        super();
        this.isSoundLoaded = false;
        this._soundManager.on("sound", this.onSoundManager, this);
        this.loadAssets(); 
    }

    private onSoundManager(value: string): void{
        switch(value){
            case "create":
                this.isSoundLoaded = true; 
                this.onAllAssetsLoaded();
            break;
        }
    }

    private loadAssets(): void {
        let assets = [ 
            { id: "Topaz-8-remake", url: "assets/fonts/stylesheet.css", priority: AssetPriority.HIGHEST, type: "fonts" },
            { id: "loading", url: "assets/gfx/loading.png", priority: AssetPriority.HIGHEST, type: "texture" },
            { id: "rectangle_yellow", url: "assets/gfx/rectangle_yellow.png", priority: AssetPriority.HIGHEST, type: "texture" },
            { id: "okay", url: "assets/gfx/okay.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "yellowBall", url: "assets/gfx/yellowBall.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "redBall", url: "assets/gfx/redBall.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "blueBall", url: "assets/gfx/blueBall.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "blackBall", url: "assets/gfx/blackBall.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "bingo_back", url: "assets/gfx/bingo_back.png", priority: AssetPriority.NORMAL, type: "texture" }, 
            { id: "theme", url: "assets/sfx/theme.mp3", priority: AssetPriority.LOW, autoplay: false, loop: false, mute: false, rate: 1, type: "sound" } as Asset,
            { id: "balldown", url: "assets/sfx/balldown.mp3", priority: AssetPriority.LOW, autoplay: false, loop: false, mute: false, rate: 1, type: "sound" } as Asset,
            { id: "button", url: "assets/sfx/button.mp3", priority: AssetPriority.NORMAL, autoplay: false, loop: false, mute: false, rate: 1, type: "sound" } as Asset,
            { id: "rectangle", url: "assets/gfx/rectangle.png", priority: AssetPriority.NORMAL, type: "texture" },
        ]; 
        assets.forEach(asset => {
            if (!this._assetsCount[asset.priority]) {
                this._assetsCount[asset.priority] = { total: 1, progress: 0 };   
            } else {
                this._assetsCount[asset.priority].total++;
            }
            if(asset.type == "sound")
                this._soundCount++;
        });

        this._loadingProgress = 0;
        this._totalAssets = assets.length;

        this._loader = new PixiAssetsLoader();
        this._loader.on(PixiAssetsLoader.PRIORITY_GROUP_LOADED, this.onAssetsLoaded.bind(this));
        this._loader.on(PixiAssetsLoader.PRIORITY_GROUP_PROGRESS, this.onAssetsProgress.bind(this));
        this._loader.on(PixiAssetsLoader.ASSET_ERROR, this.onAssetsError.bind(this));
        this._loader.on(PixiAssetsLoader.ALL_ASSETS_LOADED, this.onAllAssetsLoaded.bind(this));

        this._loader.addAssets(assets).load();
    }
    private onAssetsProgress(args: { priority: number, progress: number }): void {
        const percentFactor = this._assetsCount[args.priority].total / this._totalAssets;
        this._loadingProgress += (args.progress - this._assetsCount[args.priority].progress) * percentFactor;
        this._assetsCount[args.priority].progress = args.progress;
    }

    private onAssetsError(args: LoadAsset): void {
        this.emit("assetloadfailed");
    }

    private onAllAssetsLoaded(): void {  
        if(this._doubleCheck == false){
            if(this.isSoundLoaded){
                this._doubleCheck = true;
                this.emit("completeLoadAsset"); 
            }
        } 
    }

    private onAssetsLoaded(args: { priority: number, assets: LoadAsset[] }): void {
        args.assets.forEach(loadAsset => {  
            if(loadAsset.asset.type == "sound"){
                this._soundManager.addSound(loadAsset, this._soundCount); 
            } 
             if(loadAsset.asset.type == "fonts"){
                WebFont.load({
                    custom: {
                        families: ['Topaz-8-remake'],
                        urls: ['assets/fonts/stylesheet.css']
                    },
                  });
            }
        });
        this.createViewsByPriority(args.priority);
    } 

    private createViewsByPriority(priority: number): void {
        switch (priority) {
            case AssetPriority.HIGHEST:
                this.emit("completeLoadHighAsset");
                break;
            case AssetPriority.NORMAL:
                break;
            case AssetPriority.LOW:
                break;
        }
    }

    public get soundManager(): SoundManager{
        return this._soundManager;
    }

    public get isSoundLoaded(): boolean{
        return this._isSoundLoaded;
    }

    public set isSoundLoaded(value: boolean){ 
            this._isSoundLoaded = value; 
    }
}
