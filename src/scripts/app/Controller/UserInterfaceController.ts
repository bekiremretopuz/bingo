import { UserInterface } from "app/View/UserInterface";
import { EntryPoint } from "app/EntryPoint";
import { fakeKey, GameSettings, yellowColor } from "app/Helper/GameSettings";
import { TweenMax } from "gsap";
import { forEach } from "vendor/basarat/typescript-collections/arrays";

export class UserInterfaceController extends PIXI.Container {
    private _userInterface: UserInterface;
    private _selectedNumberCount: number = 0;
    private _game: EntryPoint;
    private _selectedNumbers: number[] = [];
    constructor() {
        super();
        this._game = EntryPoint.instance;
        this.awake();
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    private awake(): void {
        this._userInterface = new UserInterface();
        this._game.localStorage.on("update", this.onLocalStorageUpdate, this);
        this.addChild(this._userInterface);
        this._selectedNumbers = [];
        this.selectedNumberCount = 0;
    }

    private onKeyDown(key: KeyboardEvent): void {
        for (let entry in fakeKey) {
            let keyElement: any = fakeKey[entry];
            if (key.key == keyElement[0]) {
                if (this._selectedNumbers.indexOf(Number(keyElement[1])) == -1 && GameSettings.isEligibleNumbers == true) {
                    this._selectedNumbers.push(Number(keyElement[1]));
                    this.selectedNumberCount++;
                    this.interface.spotsAmount++;
                    this._game.sound.play("button", 1, false);
                    this.interface.okaySpriteVisibility(Number(keyElement[1]), true);
                } else {
                    for (var i = 0; i < this._selectedNumbers.length; i++) {
                        if (this._selectedNumbers[i] === keyElement[1]) {
                            this._selectedNumbers.splice(i, 1);
                            this.selectedNumberCount--;
                            this.interface.spotsAmount--;
                            this._game.sound.play("button", 1, false);
                            this.interface.okaySpriteVisibility(Number(keyElement[1]), false);
                        }
                    }
                }
            }
        }
        switch (key.key) {
            case "Enter":
                if (GameSettings.playAccessible == true) {
                    this.emit("status", "startgame");
                    this._game.localStorage.setItem("Spots", this.selectedNumberCount);
                }
                break;
            case "Shift":
                this.emit("status", "clearinterface");
                break;
            case "Control":
                this.emit("status", "extraball");
                break;
            case "ArrowUp":
                //TODO: credits control.
                this.emit("status", "betincrease");
                this.interface.betAmount += 10;
                this._game.localStorage.setItem("LastBet", Number(this.interface.betAmount));
                break;
            case "ArrowDown":
                if (this.interface.betAmount > 0) {
                    this.emit("status", "betdecrease");
                    this.interface.betAmount -= 10;
                    this._game.localStorage.setItem("LastBet", Number(this.interface.betAmount));
                }
                break;
        }
    }

    public isYellowColor(i: number, j: number): boolean {
        let firstIndex = i;
        let secondIndex = j;
        return this._userInterface.numberSelectText[firstIndex][secondIndex].style.fill == yellowColor;
    }

    public isOkaySpriteVisibility(i: number, j: number): boolean {
        let firstIndex = i;
        let secondIndex = j;
        return this._userInterface.okaySprite[firstIndex][secondIndex].visible;
    }

    public clearUserInterface(againGame: boolean): void {
        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 8; j++) {
                if (this._userInterface.numberSelectFrame[i][j])
                    this._userInterface.numberSelectFrame[i][j].texture = PIXI.Texture.from("rectangle");
                if (this._userInterface.okaySprite[i][j] && againGame == false)
                    this._userInterface.okaySprite[i][j].visible = false;
                if (this._userInterface.numberSelectText[i][j])
                    this._userInterface.numberSelectText[i][j].style.fill = yellowColor;
            }
        }
        this._userInterface.winAnimationBall = [];

        if (this._userInterface.winAnimationBallTween) {
            this._userInterface.winAnimationBallTween.seek(this._userInterface.winAnimationBallTween.duration, false);
            this._userInterface.winAnimationBallTween.kill();
        }

        if (againGame == false) {
            this.selectedNumberCount = 0;
            this.interface.spotsAmount = 0;
            this._selectedNumbers = [];
            this._userInterface.spotsText.text = "SPOTS\n";
        } else {
            this._userInterface.wellPlayerText.text = "WELL PLAYED !";
            this._userInterface.winText.text = "WIN\n";
        }
        this._userInterface.hitAmount = 0;
        this._userInterface.hitText.text = "HITS\n";
    }

    public setInterface(): void {
        this._userInterface.wellPlayerText.text = "WELL PLAYED !";
        this._userInterface.creditsText.text = "CREDIT\n" + this._game.localStorage.getItem("Credit");
        this._userInterface.betText.text = "LAST\nBET\n" + Number(this._game.localStorage.getItem("LastBet"));
        //this._userInterface.winText.text = "WIN\n" + this._game.localStorage.getItem("Win");
        //this._userInterface.spotsText.text = "SPOTS\n" + this._game.localStorage.getItem("Spots"); 
    }


    private onLocalStorageUpdate(key: string, value: string): void {
        switch (key) {
            case "LastBet":
                this._userInterface.betText.text = "LAST\nBET\n" + value;
                break;
            case "Credit":
                this._userInterface.creditsText.text = "CREDIT\n" + value;
                break;
            case "Win":
                this._userInterface.winText.text = "WIN\n" + value;
                break;
            case "Spots":
                this._userInterface.spotsText.text = "SPOTS\n" + value;
                break;
            case "Hits":
                this._userInterface.hitText.text = "HITS\n" + value;
                break;
        }
    }

    //GETTER AND SETTER
    public get interface(): UserInterface {
        return this._userInterface;
    }

    public get selectedNumber(): number[] {
        return this._selectedNumbers;
    }

    public set selectedNumber(value: number[]){
        this._selectedNumbers = value;
    }

    public get selectedNumberCount(): number {
        return this._selectedNumberCount;
    }

    public set selectedNumberCount(value: number) {
        if (this._selectedNumberCount != value) {
            GameSettings.resolveEligibleNumbers(value);
            GameSettings.resolvePlayAccessinble(value);
            GameSettings.resolveBetAccessible(value);
            this._selectedNumberCount = value;
        }
    }
}