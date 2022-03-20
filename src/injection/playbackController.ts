export default class PlaybackController{
    public readonly videoElement: HTMLVideoElement;

    private _speed: number = 1.0;
    private _multiplier: number = 1.0;

    constructor(videoElement: HTMLVideoElement) {
        this.videoElement = videoElement;
    }

    private updatePlaybackSpeed = () =>
        this.videoElement.playbackRate = this._speed * this._multiplier;

    get speed(): number{
        return this._speed;
    }
    set speed(value){
        this._speed = value;
        this.updatePlaybackSpeed();
    }

    get multiplier(): number{
        return this._multiplier;
    }
    set multiplier(value){
        this._multiplier = value;
        this.updatePlaybackSpeed();
    }
}