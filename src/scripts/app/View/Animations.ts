import { TweenLite, Power0, Elastic } from "gsap";
import { EntryPoint } from "app/EntryPoint";
import { ballTextStyle } from "app/Helper/GameSettings";

enum BallColors {
    Blue = "blueBall",
    Red = "redBall",
    Yellow = "yellowBall",
    Black = "redBall"
}

export class Animations extends PIXI.Container {
    private _animationContainer: PIXI.Container = new PIXI.Container();
    private _ballLeftSide: PIXI.Sprite[] = [];
    private _ballRightSide: PIXI.Sprite[] = [];
    private _ballLeftSideText: PIXI.Text[] = [];
    private _ballRightSideText: PIXI.Text[] = [];
    private _currentSideRight: boolean = false;
    private _ballCount: number = 0;
    private _game: EntryPoint;
    constructor() {
        super();
        this._game = EntryPoint.instance;
        this.addChild(this._animationContainer);
        this.awake();
    }

    private awake(): void {
        this.clearAnimation();
    }

    public clearAnimation(): void {
        this.ballCount = 0;
        this._animationContainer.removeChildren();
    }

    public createBall(count: number): void {
        for (let i = 0; i < count; i++) {
            this._ballLeftSide[i] = new PIXI.Sprite(PIXI.Texture.from(BallColors.Black));
            this._ballLeftSide[i].position.set(923, -35);
            this._ballLeftSide[i].anchor.set(0.5, 0.5);
            this._ballLeftSide[i].name = "LeftSide" + i;
            this._ballLeftSideText[i] = new PIXI.Text("", ballTextStyle);
            this._ballLeftSideText[i].anchor.set(0.5, 0.5);
            this._animationContainer.addChild(this._ballLeftSide[i]);
            this._ballLeftSide[i].addChild(this._ballLeftSideText[i]);
            this.setBallText(this._ballLeftSideText[i], i + i);
            this._ballRightSide[i] = new PIXI.Sprite(PIXI.Texture.from(BallColors.Black));
            this._ballRightSide[i].position.set(990, -35);
            this._ballRightSide[i].anchor.set(0.5, 0.5);
            this._ballRightSide[i].name = "RightSide" + i;
            this._ballRightSideText[i] = new PIXI.Text("", ballTextStyle);
            this._ballRightSideText[i].anchor.set(0.5, 0.5);
            this._ballRightSide[i].addChild(this._ballRightSideText[i]);
            this.setBallText(this._ballRightSideText[i], i + i + 1);
            this._animationContainer.addChild(this._ballRightSide[i]);
        }
        let isExtraBallState: boolean = (count == 1) ? false : true;
        this.playBallDownAnimation(isExtraBallState, count);
    }

    private setBallText(targetObject: PIXI.Text, i: number): void {
        let ballNumber: any = JSON.parse(this._game.localStorage.getItem("Numbers"));
        targetObject.text = ballNumber[i];
    }

    private resolveBallColor(ballValue: number): string {
        let ballColors: any;
        if (ballValue >= 1 && ballValue <= 10)
            ballColors = BallColors.Black;
        else if (ballValue >= 11 && ballValue <= 20)
            ballColors = BallColors.Red;
        else if (ballValue >= 21 && ballValue <= 30)
            ballColors = BallColors.Yellow;
        else if (ballValue >= 31 && ballValue <= 40)
            ballColors = BallColors.Blue;
        else if (ballValue >= 41 && ballValue <= 50)
            ballColors = BallColors.Black;
        else if (ballValue >= 51 && ballValue <= 60)
            ballColors = BallColors.Red;
        else if (ballValue >= 61 && ballValue <= 70)
            ballColors = BallColors.Yellow;
        else if (ballValue >= 71 && ballValue <= 80)
            ballColors = BallColors.Blue;
        return ballColors;
    }

    public playBallDownAnimation(value: boolean, counts: number): void {
        let isExtraBallState: boolean = value;
        let count: number = counts;
        let targetObject: PIXI.Sprite = (this._currentSideRight) ? this._ballRightSide[this.ballCount] : this._ballLeftSide[this.ballCount];
        let targetPositionY: number = 735 - (targetObject.height * this.ballCount);
        targetObject.texture = PIXI.Texture.from(this.resolveBallColor(Number(targetObject.getChildAt(0).text)));
        let duration: number = 0.25;
        if (this.ballCount + 1 % 2 == 0)
            duration = 0.25 / (this.ballCount + 1);

        let downAnimation: TweenLite = TweenLite.to(targetObject.position, duration, {
            y: targetPositionY, ease: Elastic.easeOut.config(0.65, 1),
            onStart: () => {
                this.emit("animationstate", "balldownanimationstart");
            },
            onComplete: () => {
                let value: number = Number(targetObject.getChildAt(0).text);
                this.emit("animationstate", "balldownanimationcomplete", value);
                if (this.ballCount < count) {
                    this.playBallDownAnimation(isExtraBallState, counts);
                    if (this._currentSideRight) {
                        this.ballCount++;
                        if (this.ballCount == count)
                            this.emit("animationstate", "currentgamefinish");
                    }

                    this._currentSideRight = !this._currentSideRight;
                }
            }
        });
    }

    public get ballCount(): number {
        return this._ballCount;
    }

    public set ballCount(value: number) {
        if (this._ballCount != value)
            this._ballCount = value;
    }

    public get animationContainer(): PIXI.Container {
        return this._animationContainer;
    }
}