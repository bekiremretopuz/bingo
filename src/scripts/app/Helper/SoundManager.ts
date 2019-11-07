 export default class SoundManager extends PIXI.utils.EventEmitter { 
    private _sounds: { [key: string]: any } = {};
    private _loadedSoundCount: number  = 0;
    constructor(){ 
        super();
    } 

    public addSound(loadAsset: any, length: number): void {
        if ((loadAsset.asset.id in this._sounds) == false) {
            this._loadedSoundCount++;
            this._sounds[loadAsset.asset.id] = {
                sound: new Howl({
                     src: loadAsset.asset.url,
                     autoplay: loadAsset.asset.autoplay,
                     volume: loadAsset.asset.volume,
                     rate: loadAsset.asset.rate,
                     loop: loadAsset.asset.loop
                }) 
            }
            if(length == this._loadedSoundCount)
                this.emit("sound", "create");
        } 
    }

    public play(key: string, volume: number = 1, loop: boolean = false): void { 
        if (key in this._sounds) {
            this._sounds[key].sound.volume(volume);
            this._sounds[key].sound.loop(loop); 
            this._sounds[key].sound.autoplay = loop
            this._sounds[key].sound.play();
        }
    }

    public pause(key: string): void {
        if (key in this._sounds)
            this._sounds[key].sound.pause();
    }

    public stop(key: string): void {
        if (key in this._sounds)
            this._sounds[key].sound.stop();
    } 
} 