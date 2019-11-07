import { TweenMax, Power0 } from "gsap";
import { Scene } from "app/Helper/StageManager";
import { AssetsLoader } from "app/Helper/AssetsLoader";
import { EntryPoint } from "app/EntryPoint";
import { BaseGame } from "./BaseGame";

export class LoaderStage extends Scene {
    private _assetLoader: AssetsLoader;
    private _loadingSprite: PIXI.Sprite; 
    private _loadingProgressText: PIXI.Text;
    private _game: EntryPoint;  
    constructor() {
        super();
        this._game = EntryPoint.instance; 
    }

    public awake(): void {   

        this._loadingSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this._loadingSprite.position.set(512, 384);
        this._loadingSprite.anchor.set(0.5, 0.5);
        this._loadingSprite.name = "LoadingSprite";
        this.addChild(this._loadingSprite);

        this._loadingProgressText = new PIXI.Text("Loading", {});
        this._loadingProgressText.anchor.set(0.5, 0.5);
        this._loadingProgressText.position.set(512, 378);
        this._loadingProgressText.visible = false;
        this.addChild(this._loadingProgressText); 

        this._assetLoader = new AssetsLoader(); 
        this._assetLoader.on("completeLoadHighAsset", this.loadingAnimation, this);
        this._assetLoader.on("completeLoadAsset", this.completeLoadAsset, this);
    }

    private completeLoadAsset(): void {
        this._game.stageManager.createScene("BaseGame", new BaseGame);
        this._game.stageManager.goToScene("BaseGame");
    }

    private loadingAnimation(): void {
        this._loadingSprite.texture = PIXI.Texture.from("loading");
        let loadingAnimation: TweenMax = TweenMax.to(this._loadingSprite, 90, {
            rotation: 360, yoyo: true, ease: Power0.easeNone, repeat: -1
        });
    }

    public get assetsLoader(): AssetsLoader{
        return this._assetLoader;
    }

    public killScene(): void {
    }
}
