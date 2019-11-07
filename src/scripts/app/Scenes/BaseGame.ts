import { EntryPoint } from "app/EntryPoint";
import { UserInterfaceController } from "app/Controller/UserInterfaceController";
import { AnimationController } from "app/Controller/AnimationController";
import { PLAYACTION, INIT, EXTRABALL, GameSettings, blueColor } from "app/Helper/GameSettings";
import { Scene } from "app/Helper/StageManager";

export class BaseGame extends Scene {
    private _game: EntryPoint;
    private _userInterfaceController: UserInterfaceController;
    private _animationController: AnimationController;
    private _backgroundImage: PIXI.Graphics;

    constructor() {
        super();
        this._game = EntryPoint.instance;
        console.log(this);
    }

    public awake(): void {
        this._game.createWebSocket();
        this._game.sound.play("theme", 1, true);
        this._userInterfaceController = new UserInterfaceController();
        this.addChild(this._userInterfaceController);
        this._animationController = new AnimationController();
        this.addChild(this._animationController);
        this.eventListener();
    }

    private eventListener(): void {
        this._animationController.interface.on("animationstate", this.onAnimationHandler, this);
        this._userInterfaceController.on("status", this.onControlHandler, this);
        this._game.websocket.on("response", this.onWebsocketResponse, this);
        this._game.websocket.on("init", this.onWebsocketResponse, this);
    }

    private onAnimationHandler(action: string, type: any): void {
        switch (action) {
            case "balldownanimationstart":
                this._game.sound.play("balldown", 1, false);
                break;
            case "currentgamefinish":
               GameSettings.playStatus = false;
               setTimeout(() => {
                this.onControlHandler("startgame");
            }, 3000);
                break;
            case "balldownanimationcomplete":
                let cloneThis = this;
                this._userInterfaceController.selectedNumber.forEach(function (value) {
                    if (type == value) {
                        cloneThis._userInterfaceController.interface.hitAmount += 1;
                        cloneThis._userInterfaceController.interface.changeNumbersFrameColor(type, true, blueColor);
                        return;
                    } else {
                        cloneThis._userInterfaceController.interface.changeNumbersFrameColor(type, false, blueColor);
                    }
                });
                break;
        }
    }

    private onControlHandler(action: string): void {
        switch (action) {
            case "startgame":
                if (GameSettings.playStatus == false) {
                    this._animationController.clearAnimation();
                    this._userInterfaceController.clearUserInterface(true);
                    GameSettings.playStatus = true;
                    this._game.websocket.websocketRequest("play", { bet: Number(this._game.localStorage.getItem("LastBet")), selectedBalls: this._userInterfaceController.selectedNumber, session: "blabla" });
                }
                break;
            case "clearinterface":
                if(GameSettings.playStatus == false){
                    this._animationController.clearAnimation();
                    this._userInterfaceController.clearUserInterface(false);
                    this._userInterfaceController.selectedNumber = [];
                    this._userInterfaceController.interface.selectedBall = [];
                    this._userInterfaceController.interface.winAnimationBall = [];
                }
                break;
            case "extraball":
                if (this._game.localStorage.getItem("ExtraBall") == "true") {
                    this._animationController.clearAnimation();
                    this._game.websocket.websocketRequest("extraball", { bet: Number(this._game.localStorage.getItem("LastBet")), selectedBall: [1, 2, 3, 4], session: "blabla" });
                }
                break;
        }
    }



    private onWebsocketResponse(data: any): void {
        switch (data.Action) {
            case PLAYACTION:
                this._game.localStorage.setItem("SessionId", data.Session);
                this._game.localStorage.setItem("Credit", data.Credit);
                this._game.localStorage.setItem("TotalWin", data.TotalWin);
                this._game.localStorage.setItem("Win", data.Win);
                this._game.localStorage.setItem("ExtraBall", data.ExtraBall);
                this._game.localStorage.setItem("LastBet", Number(data.Bet));
                this._game.localStorage.setItem("Numbers", JSON.stringify(data.SelectedBalls));
                this._animationController.interface.createBall(10);
                break;
            case INIT:
                this._game.localStorage.removeAll();
                this._game.localStorage.setItem("SessionId", data.Session);
                this._game.localStorage.setItem("Credit", data.Credit);
                this._game.localStorage.setItem("TotalWin", 0);
                this._game.localStorage.setItem("Win", 0);
                this._game.localStorage.setItem("ExtraBall", false);
                this._game.localStorage.setItem("Hits", 0);
                this._userInterfaceController.interface.betAmount = 0;
                this._game.localStorage.setItem("LastBet", 0);
                this._game.localStorage.setItem("Spots", 0);
                this._game.localStorage.setItem("Numbers", []);
                this._userInterfaceController.clearUserInterface(false);
                this._userInterfaceController.setInterface();
                break;
            case EXTRABALL:
                this._game.localStorage.setItem("SessionId", data.Session);
                this._game.localStorage.setItem("Credit", data.Credit);
                this._game.localStorage.setItem("TotalWin", data.TotalWin);
                this._game.localStorage.setItem("Win", data.Win);
                this._game.localStorage.setItem("ExtraBall", data.ExtraBall);
                this._game.localStorage.setItem("LastBet", Number(data.Bet));
                this._game.localStorage.setItem("Numbers", JSON.stringify(data.SelectedBalls));
                this._animationController.interface.createBall(1);
                break;
        }
    }

    public killScene(): void {
        console.log(11);
    }
}