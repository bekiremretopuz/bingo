import { EntryPoint } from "app/EntryPoint";
import { ERROR } from "app/Helper/GameSettings";
import { LoaderStage } from "app/Scenes/LoaderStage";
import { ErrorWindow } from "app/Scenes/ErrorWindow";

export class Data extends PIXI.utils.EventEmitter {
    private _game: EntryPoint;
    constructor(game: EntryPoint) {
        super();
        this._game = game;
        this.initListeners();
    }

    private initListeners(): void {
        this._game.websocket.on("status", this.onWebsocketError, this);
    }

    private onWebsocketError(data: any): void {
        switch (data.Action) {
            case ERROR:
                this._game.localStorage.setItem("ErrorCode", data.Message);
                this._game.stageManager.createScene("ErrorWindow", new ErrorWindow);
                this._game.stageManager.goToScene("ErrorWindow");
                break;
        }
    }
}