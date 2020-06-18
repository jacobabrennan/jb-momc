

//==============================================================================


//-- Dependencies --------------------------------
import { playerRemoteGetAll } from './playerRemote.js';
import { SIZE_WIDTH_DEFAULT } from '../constants.js';

//-- Constants -----------------------------------
const AUDIO_DISTANCE_CONVERSION = 256; // This number is too magic. Connect to map system!

//-- Module State --------------------------------
let streamAudioLocal;

//-- State Management ----------------------------
export async function microphoneRequest() {
    try {
        streamAudioLocal = await navigator.mediaDevices.getUserMedia({
            video: true, audio: true,
        });
    } catch {
        const audioConstraints = {audio: true};
        streamAudioLocal = await navigator.mediaDevices.getUserMedia(audioConstraints);
    }
}
export function streamAudioLocalGet() {
    return streamAudioLocal;
}

//-- Utilities -----------------------------------
export function repositionListener(posX, posY) {
    const players = playerRemoteGetAll();
    for(let player of players) {
        player.audio.panCalculate(posX, posY, player.x, player.y)
    }
}

//------------------------------------------------
export default class Audio {
    constructor() {
        //
        this.context = new AudioContext();
        this.gain = this.context.createGain();
        this.audioPanner = new StereoPannerNode(this.context);
        //
        this.gain.connect(this.audioPanner);
        this.audioPanner.connect(this.context.destination);
    }
    connectStream(stream) {
        const options = {mediaStream: stream};
        this.audioNodeSource = new MediaStreamAudioSourceNode(this.context, options);
        this.audioNodeSource.connect(this.gain);
    }
    panCalculate(posXLocal, posYLocal, posXRemote, posYRemote) {
        // Note on pan value: -1 = full left; 0 = center; 1 = far right;
        const deltaX = posXRemote -posXLocal;
        const distance = deltaX/(SIZE_WIDTH_DEFAULT/4);
        this.audioPanner.pan.value = deltaX/AUDIO_DISTANCE_CONVERSION;
        this.gain.gain.value = Math.min(1, 1/(distance*distance));
    }
}
