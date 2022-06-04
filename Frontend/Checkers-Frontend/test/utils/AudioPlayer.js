export default class AudioPlayer {
    constructor(fileUrl) {
        this.fileUrl = fileUrl;
    }

    play() {
        console.log('Playing sound file ' + this.fileUrl);
    }

    trigger() {
        console.log('Trigger a fake Toasty!!!')
    }
}