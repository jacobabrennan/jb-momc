

//==============================================================================

//-- Module State --------------------------------
let streamVideoLocal;

//-- State Management ----------------------------
export async function cameraRequest() {
    const mediaConstraints = {audio: true};
    streamVideoLocal = await navigator.mediaDevices.getUserMedia(mediaConstraints);
}
export function streamVideoLocalGet() {
    return streamVideoLocal;
}

//------------------------------------------------