import { Animations } from "app/View/Animations";

export class AnimationController extends PIXI.Container {
    private _animation: Animations;
    constructor() {
        super();
        this.awake();
    }

    public clearAnimation(): void{
        this._animation.clearAnimation();
    }

    private awake(): void {
        this._animation = new Animations();
        this.addChild(this._animation);
    }

    public get interface(): Animations {
        return this._animation;
    }
}