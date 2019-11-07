import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";

export class StageManager extends PIXI.utils.EventEmitter {
    private _app: Wrapper;
    private _rootContainer: PIXI.Container = new PIXI.Container();
    private _scenes: any = {};
    private _currentStage: Scene;
    private _backgroundImage: PIXI.Graphics;
    private _backgroundImageDefault: PIXI.Graphics;
    constructor() {
        super();
    }

    public create() {
        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>("app-canvas", "canvas", document.getElementById("app-root"));
        const appOptions: WrapperOpts = {
            width: 1024,
            height: 768,
            scale: "keep-aspect-ratio",
            align: "middle",
            resolution: window.devicePixelRatio || 1,
            antialias: true,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x000000,
            view: canvas,
            showFPS: false,
            showMediaInfo: false,
            changeOrientation: false,
        };
        this._app = new Wrapper(appOptions);
        this._app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));
        this._rootContainer.name = "RootContainer";
        this._app.stage.addChild(this._rootContainer);
        this.drawScreenBorder();
    }

    public createScene(id: string, TScene: Scene): Scene | any {
        if (this._scenes[id]) return undefined;
        var scene = TScene;
        this._scenes[id] = scene;
        this._rootContainer.addChild(this._scenes[id]);
        return scene;
    }

    public goToScene(id: string, reset?: boolean): boolean {
        if (this._scenes[id]) {
            if (this._currentStage) {
                this._currentStage.visible = false;
                this._currentStage.killScene();
            }
            this._currentStage = this._scenes[id];
            this._currentStage.visible = true;
            this._currentStage.awake();
            return true;
        } else {

        }
        return false;
    }

    private drawScreenBorder(width = 4): void {
        // const halfWidth = width / 2;
        // this._backgroundImage = new PIXI.Graphics().beginFill(0x35a30e, 1).drawRect(halfWidth, halfWidth, this._app.initialWidth - width, this._app.initialHeight - width).endFill();
        // this._backgroundImage.name = "ScreenBorder";
        // this._rootContainer.addChild(this._backgroundImage);

        this._backgroundImage = new PIXI.Graphics().beginFill(0xffffff, 0).drawRect(0, 0, 1024, 768).endFill();
        this._backgroundImage.name = "BackgroundImageMask";
        this._rootContainer.mask = this._backgroundImage; 
        this._rootContainer.addChild(this._backgroundImage);

        this._backgroundImageDefault = new PIXI.Graphics().beginFill(0x35a30e, 1).drawRect(0, 0, 1024, 768).endFill();
        this._backgroundImageDefault.name = "BackgroundImageDef";  
        this._rootContainer.addChild(this._backgroundImageDefault);
    }

    private onResizeEnd(args: any): void {
        if (args.stage.orientation.changed) {
            this.relocateViews();
        }
    }

    private relocateViews(): void { 
        this.drawScreenBorder();
    }

    public get root(): PIXI.Container {
        return this._rootContainer;
    }
}

export abstract class Scene extends PIXI.Container {
    public abstract awake(...args: any[]): void;
    public abstract killScene(...args: any[]): void;
}

