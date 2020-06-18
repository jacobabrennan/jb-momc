

//==============================================================================


//-- Dependencies --------------------------------
import { playerRemoteGetAll } from './playerRemote.js';

//-- Constants -----------------------------------
const AUDIO_DISTANCE_CONVERSION = 256; // This number is too magic. Connect to map system!

//-- Module State --------------------------------
let streamAudioLocal;

//-- State Management ----------------------------
export async function microphoneRequest() {
    const audioConstraints = {audio: true};
    streamAudioLocal = await navigator.mediaDevices.getUserMedia(audioConstraints);
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
        this.audioPanner = new StereoPannerNode(this.context);
        this.audioPanner.connect(this.context.destination);
    }
    connectStream(stream) {
        const options = {mediaStream: stream};
        this.audioNodeSource = new MediaStreamAudioSourceNode(this.context, options);
        this.audioNodeSource.connect(this.audioPanner);
    }
    panCalculate(posXLocal, posYLocal, posXRemote, posYRemote) {
        // Note on pan value: -1 = full left; 0 = center; 1 = far right;
        const deltaX = posXRemote -posXLocal;
        this.audioPanner.pan.value = deltaX/AUDIO_DISTANCE_CONVERSION;
    }
}
