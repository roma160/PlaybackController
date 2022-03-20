import type PlaybackController from "./playbackController";

export default class SmartSoundWorker{
    private readonly context: AudioContext;
    private readonly analyser: AnalyserNode;
    private source: MediaElementAudioSourceNode;

    private playbackController: PlaybackController;

    private isWorking: boolean = false;

    constructor(
        smoothingTimeConstant = 0.9,
        fftSize = 512
    ) {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = smoothingTimeConstant;
        this.analyser.fftSize = fftSize;
        this.analyser.connect(this.context.destination);
    }

    changeVideoSource(playbackController: PlaybackController): void{
        if(this.source != undefined){
            if(this.source.mediaElement == playbackController.videoElement)
                return;
            this.source.disconnect();
        }
        this.playbackController = playbackController;
        this.source = this.context.createMediaElementSource(
            playbackController.videoElement);
        this.source.connect(this.analyser);
    }

    public startWorker(): void{
        if(this.isWorking) return;
        this.isWorking = true;
        this.continueWorking();
    }
    public stopWorker(): void{
        if(!this.isWorking) return;
        this.isWorking = false;
    }

    private worker(): void{
        let array = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(array);
        const average = array.reduce(
            (partialSum, a) => partialSum + Math.abs(a) - 128, 0
        ) / array.length;

        console.log(average);

        if(this.isWorking)
            this.continueWorking();
    }
    private continueWorking = () => requestAnimationFrame(this.worker.bind(this));
}