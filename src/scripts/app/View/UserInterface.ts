import { numbersTextStyle } from "app/Helper/GameSettings";
import { GameSettings, wellPlayerTextStyle, creditsTextStyle, betTextStyle, winTextStyle, spotsTextStyle, hitTextStyle, gameResultTextStyle, makeBetTextStyle } from "app/Helper/GameSettings";
import { TweenLite, TweenMax, Power3, Power0, SteppedEase } from "gsap";
import { EntryPoint } from "app/EntryPoint";
export class UserInterface extends PIXI.Container {
    private _wellPlayedText: PIXI.Text;
    private _creditsText: PIXI.Text;
    private _betText: PIXI.Text;
    private _betAmount: number = 0;
    private _winText: PIXI.Text;
    private _spotsText: PIXI.Text;
    private _spotsAmount: number = 0;
    private _hitText: PIXI.Text;
    private _hitAmount: number = 0;
    private _makeBetText: PIXI.Text;
    private _gameResultText: PIXI.Text;
    private _userInterfaceContainer: PIXI.Container = new PIXI.Container();
    private _numbersText: PIXI.Text[][];
    private _bingoBackMachine: PIXI.Sprite;
    private _numberSelectedFrame: PIXI.Sprite[][];
    private _okaySprite: PIXI.Sprite[][];
    private _machine: PIXI.Container = new PIXI.Container();
    private _selectedBall: number[] = [];
    private _winAnimationBall: PIXI.Sprite[] = [];
    private _winAnimationBallTween: TweenMax;
    private _offsetX: number = 74;
    private _offsetY: number = 57;
    private _game: EntryPoint;
    constructor() {
        super();
        this._game = EntryPoint.instance;
        this.addChild(this._userInterfaceContainer);
        this._machine.name = "BingoMachine";
        this._userInterfaceContainer.addChild(this._machine);
        this.awake();
    }
    private awake(): void {
        this._bingoBackMachine = new PIXI.Sprite(PIXI.Texture.from("bingo_back"));
        this._bingoBackMachine.position.set(472, 494);
        this._bingoBackMachine.anchor.set(0.5, 0.5);
        this._bingoBackMachine.name = "BingoBackMachine";
        this._machine.addChild(this._bingoBackMachine);

        this._wellPlayedText = new PIXI.Text("WELL PLAYED !", wellPlayerTextStyle);
        this._wellPlayedText.position.set(512, 50);
        this._wellPlayedText.anchor.set(0.5, 0.5);
        this._wellPlayedText.name = "WellPlayedText";
        this._userInterfaceContainer.addChild(this._wellPlayedText);

        this._creditsText = new PIXI.Text("CREDIT\n", creditsTextStyle);
        this._creditsText.position.set(160, 140);
        this._creditsText.anchor.set(0.5, 0.5);
        this._creditsText.name = "CreditText";
        this._userInterfaceContainer.addChild(this._creditsText);

        this._betText = new PIXI.Text("LAST\nBET", betTextStyle);
        this._betText.position.set(320, 140);
        this._betText.anchor.set(0.5, 0.5);
        this._betText.name = "BetText";
        this._userInterfaceContainer.addChild(this._betText);

        this._winText = new PIXI.Text("WIN\n", winTextStyle);
        this._winText.position.set(510, 190);
        this._winText.anchor.set(0.5, 0.5);
        this._winText.name = "WinText";
        this._userInterfaceContainer.addChild(this._winText);

        this._spotsText = new PIXI.Text("SPOTS\n", spotsTextStyle);
        this._spotsText.position.set(650, 190);
        this._spotsText.anchor.set(0.5, 0.5);
        this._spotsText.name = "SpotsText";
        this._userInterfaceContainer.addChild(this._spotsText);

        this._hitText = new PIXI.Text("HITS\n", hitTextStyle);
        this._hitText.position.set(790, 190);
        this._hitText.anchor.set(0.5, 0.5);
        this._hitText.name = "HitText";
        this._userInterfaceContainer.addChild(this._hitText);

        this._gameResultText = new PIXI.Text("GAME\nOVER", gameResultTextStyle);
        this._gameResultText.position.set(70, 225);
        this._gameResultText.anchor.set(0.5, 0.5);
        this._gameResultText.name = "GameResultText";
        this._userInterfaceContainer.addChild(this._gameResultText);

        this._makeBetText = new PIXI.Text("MAKE A BET", makeBetTextStyle);
        this._makeBetText.position.set(512, 240);
        this._makeBetText.anchor.set(0.5, 0.5);
        this._makeBetText.name = "MakeBetText";
        this._userInterfaceContainer.addChild(this._makeBetText);
        this.createNumberText();

        this._selectedBall = [];
        this._winAnimationBall = [];
    }
    private createNumberText(): void {
        this._numbersText = [];
        this._numberSelectedFrame = [];
        this._okaySprite = [];
        for (let i = 1; i <= 10; i++) {
            this._numbersText[i] = [];
            this._numberSelectedFrame[i] = [];
            this._okaySprite[i] = [];
            for (let j = 1; j <= 8; j++) {
                this._numberSelectedFrame[i][j] = new PIXI.Sprite(PIXI.Texture.from("rectangle"));
                this._numberSelectedFrame[i][j].anchor.set(0.5, 0.5);
                if (j >= 5) {
                    this._numberSelectedFrame[i][j].position.set(-333 + ((i - 1) * this._offsetX), 38 + ((j - 5) * (this._offsetY)));
                } else {
                    this._numberSelectedFrame[i][j].position.set(-333 + ((i - 1) * this._offsetX), -210 + ((j - 1) * (this._offsetY)));
                }
                this._numberSelectedFrame[i][j].name = "SelectedFrame" + i + j;

                this._numbersText[i][j] = new PIXI.Text("", numbersTextStyle);
                this._numbersText[i][j].text = (((j - 1) * 10) + i).toString();
                this._numbersText[i][j].anchor.set(0.5, 0.5);
                this._numbersText[i][j].name = "NumbersText" + i + j;

                this._okaySprite[i][j] = new PIXI.Sprite(PIXI.Texture.from("okay"));
                this._okaySprite[i][j].scale.set(1, 1);
                this._okaySprite[i][j].anchor.set(0.5, 0.5);
                this._okaySprite[i][j].visible = false;

                this._bingoBackMachine.addChild(this._numberSelectedFrame[i][j]);
                this._numberSelectedFrame[i][j].addChild(this._numbersText[i][j]);
                this._numberSelectedFrame[i][j].addChild(this._okaySprite[i][j]);

            }
        }
    }

    public okaySpriteVisibility(tag: number, visibility: boolean): void {
        let firstIndex, secondIndex;
        let convertToString = tag.toLocaleString();
        if (convertToString.length == 2) {
            secondIndex = tag % 10;
            tag = tag / 10;
            firstIndex = Math.floor(tag % 10);
            tag = tag / 10;
            if (secondIndex == 0) secondIndex = 10;
            else firstIndex++;
            if (visibility) {
                this._selectedBall.push(Number(this._numbersText[secondIndex][firstIndex].text));
                this._okaySprite[secondIndex][firstIndex].visible = true;
            }
            else {
                this._okaySprite[secondIndex][firstIndex].visible = false;
                for (var i = 0; i < this._selectedBall.length; i++) {
                    if (this._selectedBall[i] == tag) {
                        this._selectedBall.splice(i, 1);
                        break;
                    }

                }
            }
        } else {
            firstIndex = tag % 10;
            tag = tag / 10;
            if (visibility) {
                this._selectedBall.push(Number(this._numbersText[firstIndex][1].text));
                this._okaySprite[firstIndex][1].visible = true;
            }
            else {
                this._okaySprite[firstIndex][1].visible = false;
                for (var i = 0; i < this._selectedBall.length; i++) {
                    if (this._selectedBall[i] == tag) {
                        this._selectedBall.splice(i, 1);
                        break;
                    }

                }
            }
        }
    }

    private winAlphaAnimation(firstIndex: number, secondIndex: number): void {
        if (this._winAnimationBall.indexOf(this._numberSelectedFrame[firstIndex][secondIndex]) <= -1)
            this._winAnimationBall.push(this._numberSelectedFrame[firstIndex][secondIndex]);
        this._winAnimationBallTween = TweenMax.fromTo(this._winAnimationBall, 0.45, { alpha: 1 }, { alpha: 0, repeat: -1, ease: new SteppedEase(1) });
    }

    public changeNumbersFrameColor(tag: number, isAnimation: boolean, hexColor: string): void {
        let firstIndex, secondIndex;
        let convertToString = tag.toLocaleString();
        if (convertToString.length == 2) {
            secondIndex = tag % 10;
            tag = tag / 10;
            firstIndex = Math.floor(tag % 10);
            tag = tag / 10;
            if (secondIndex == 0) secondIndex = 10;
            else firstIndex++;
            this._numbersText[secondIndex][firstIndex].style.fill = hexColor;
            this._numberSelectedFrame[secondIndex][firstIndex].texture = PIXI.Texture.from("rectangle_yellow");
            if(isAnimation)
                this.winAlphaAnimation(secondIndex, firstIndex);
        } else {
            firstIndex = tag % 10;
            tag = tag / 10;
            this._numbersText[firstIndex][1].style.fill = hexColor;
            this._numberSelectedFrame[firstIndex][1].texture = PIXI.Texture.from("rectangle_yellow");
            if(isAnimation)
                this.winAlphaAnimation(firstIndex, 1);
        }
    }

    public get wellPlayerText(): PIXI.Text {
        return this._wellPlayedText;
    }

    public get selectedBall(): number[] {
        return this._selectedBall;
    }

    public get creditsText(): PIXI.Text {
        return this._creditsText;
    }

    public get betText(): PIXI.Text {
        return this._betText;
    }

    public get winText(): PIXI.Text {
        return this._winText;
    }

    public get winAnimationBall(): PIXI.Sprite[] {
        return this._winAnimationBall;
    }

    public get okaySprite(): PIXI.Sprite[][] {
        return this._okaySprite;
    }

    public get spotsText(): PIXI.Text {
        return this._spotsText;
    }

    public get spotsAmount(): number {
        return this._spotsAmount;
    }

    public set spotsAmount(value: number) {
        this._spotsAmount = value;
        this._game.localStorage.setItem("Spots", Number(value));
    }

    public get hitText(): PIXI.Text {
        return this._hitText;
    }

    public get hitAmount(): number {
        return this._hitAmount;
    }

    public set hitAmount(value: number) {
        this._hitAmount = value;
        this._game.localStorage.setItem("Hits", Number(value));
    }

    public get numberSelectFrame(): PIXI.Sprite[][] {
        return this._numberSelectedFrame;
    }

    public get numberSelectText(): PIXI.Text[][] {
        return this._numbersText;
    }

    public set winAnimationBall(value: PIXI.Sprite[]) {
        this._winAnimationBall = value;
    }

    public get winAnimationBallTween(): TweenMax {
        return this._winAnimationBallTween;
    }

    public set selectedBall(value: number[]) {
        this._selectedBall = value;
    }

    public get betAmount(): number {
        return this._betAmount;
    }

    public set betAmount(value: number) {
        if (this._betAmount != value)
            this._betAmount = value;
    }
}