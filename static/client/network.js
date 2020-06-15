

//==============================================================================

//-- Constants -----------------------------------
// should be defined centrally
// const ACTION_UPDATE = 'update';
const EVENT_MESSAGE = 'message';

//-- Module State --------------------------------
let socket;

//-- Configuration -------------------------------
export async function setup({ addressConnection }) {
    socket = new WebSocket(addressConnection);
    socket.addEventListener(EVENT_MESSAGE, (eventMessage) => {
        messageReceive(eventMessage.data);
    });
    setTimeout(() => {
        messageSend({action: 'hi there', data: 'asdf'});
    }, 1000);
}

//-- Message sending & receiving -----------------
export function messageSend(message) {
    socket.send(JSON.stringify(message));
}
export function messageReceive(message) {
    message = JSON.parse(message);
    switch(message.action) {
        // case ACTION_UPDATE:
        //     gameplay.update(message.data);
        //     break;
        // case ACTION_AUDIO_BUFFER:
        //     gameplay.audioUpdate(message.data)
        //     break;
    }
}
