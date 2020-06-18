

//==============================================================================

//-- Dependencies --------------------------------
import {
    ACTION_LOGIN,
    ACTION_WEBRTC_SIGNAL,
    ACTION_OCCUPANCY,
    // ACTION_OCCUPANCY_JOIN,
    ACTION_OCCUPANCY_LEAVE,
} from '../constants.js';
import { start } from '../game/index.js';
import {
    playerRemoteGet,
    playerRemoteAdd,
    playerRemoteRemove,
} from './playerRemote.js';

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
        case ACTION_WEBRTC_SIGNAL: {
            let player = playerRemoteGet(data.originatingPlayerId);
            if(!player) {
                player = playerRemoteAdd(data.originatingPlayerId, false);
            }
            player.connection.signal(data.data);
            break;
        }
        case ACTION_OCCUPANCY: {
            for(let occupantId of data) {
                playerRemoteAdd(occupantId, true);
            }
            break;
        }
        // case ACTION_OCCUPANCY_JOIN: {
        //     break;
        // }
        case ACTION_OCCUPANCY_LEAVE: {
            playerRemoteRemove(data);
            break;
        }
    }
}
