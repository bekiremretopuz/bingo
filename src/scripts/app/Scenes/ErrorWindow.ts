import { Scene } from "app/Helper/StageManager";
import { errorTextStyle } from "app/Helper/GameSettings";
import { EntryPoint } from "app/EntryPoint";
import { protocol, host, port } from "app/Helper/WebsocketConnect";

export class ErrorWindow extends Scene {
    private _game: EntryPoint;
    private _errorMessage: PIXI.Text;
    private _backgroundImage: PIXI.Graphics;
    private _errorMessageCode: PIXI.Text;
    constructor() {
        super();
        this._game = EntryPoint.instance;
    }

    public awake(): void {
        this._backgroundImage = new PIXI.Graphics().beginFill(0x32e224, 1).drawRect(0, 0, 1024, 768).endFill();
        this._backgroundImage.name = "BackgroundImage";
        this.addChild(this._backgroundImage);

        this._errorMessage = new PIXI.Text("A Technical Problem Has Occurred.\nPlease contact with authorized person.", errorTextStyle);
        this._errorMessage.anchor.set(0.5, 0.5);
        this._errorMessage.position.set(512, 384);
        this._errorMessage.name = "ErrorMessageText";
        this.addChild(this._errorMessage);

        this._errorMessageCode = new PIXI.Text("", errorTextStyle);
        this._errorMessageCode.text = "Message =>" + this._game.localStorage.getItem("ErrorCode");
        this._errorMessageCode.anchor.set(0.5, 0.5);
        this._errorMessageCode.scale.set(0.6, 0.6);
        this._errorMessageCode.position.set(512, 584);
        this._errorMessageCode.name = "ErrorMessageCodeText";
        this.addChild(this._errorMessageCode);

        setInterval(() => {
            this._game.websocket.websocketConnect(protocol + "://" + host + ":" + port + "/");
        }, 5000);
    }

    public killScene(): void {

    }

    public static reloadGame(): void {
        window.location.reload();
    }
}
