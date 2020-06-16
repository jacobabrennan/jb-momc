

//==============================================================================

//-- Dependencies --------------------------------
import {
    ACTION_LOGIN,
    ACTION_OCCUPANCY,
    ACTION_WEBRTC_SIGNAL,
} from '../constants.js';
import { start } from '../game/index.js';
import WebRTC, { connectionGet } from './webrtc.js';

//-- Module State --------------------------------
let socket;

//-- Configuration -------------------------------
export async function setup({ addressConnection }) {
    socket = new WebSocket(addressConnection);
    socket.addEventListener('message', (eventMessage) => {
        const message = JSON.parse(eventMessage.data);
        messageReceive(message.action, message.data);
    });
}

//-- Message sending & receiving -----------------
export function messageSend(action, data) {
    const message = {
        action: action,
        data: data,
    };
    socket.send(JSON.stringify(message));
}
export function messageReceive(action, data) {
    switch(action) {
        case ACTION_LOGIN: {
            start();
            break;
        }
        case ACTION_OCCUPANCY: {
            for(const occupantId of data) {
                new WebRTC(occupantId, true);
            }
            break;
        }
        case ACTION_WEBRTC_SIGNAL: {
            let connection = connectionGet(data.originatingPlayerId);
            if(!connection) {
                connection = new WebRTC(data.originatingPlayerId, false);
            }
            connection.signal(data.data);
            break;
        }
    }
}
