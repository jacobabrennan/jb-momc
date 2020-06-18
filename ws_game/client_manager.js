

//== Client ====================================================================

//-- Dependencies --------------------------------
import {
    ACTION_LOGIN,
    ACTION_TRANSFER,
    ACTION_WEBRTC_SIGNAL,
} from '../static/constants.js';
import {
    playerLogin,
    playerGet,
    playerLogout,
} from './player.js';

//-- Constants -----------------------------------
const EVENT_MESSAGE = 'message';
const EVENT_DISCONNECT = 'close';

//-- Class Definition ----------------------------
export default class Client {
    playerId = null
    constructor(socket, request) {
        // Configure network connection
        this.dataSetup(socket);
    }
}

//-- Networking ----------------------------------
Client.prototype.dataSetup = function (socket) {
    this.socket = socket;
    socket.on(EVENT_DISCONNECT, (eventClose) => {
        playerLogout(this.playerId);
    });
    socket.on(EVENT_MESSAGE, (eventMessage) => {
        eventMessage = JSON.parse(eventMessage);
        if(eventMessage.action) {
            this.dataReceive(eventMessage.action, eventMessage.data);
        }
    });
}
Client.prototype.dataSend = function (action, data) {
    // Send action and associated data to remote client as a string
    const message = {
        action: action,
        data: data,
    };
    this.socket.send(JSON.stringify(message));
}
Client.prototype.dataReceive = function (action, data) {
    // Execute commands received from remote client
    switch(action) {
        case ACTION_LOGIN: {
            const playerNew = playerLogin(data.username, this);
            this.playerId = playerNew.id;
            this.dataSend(ACTION_LOGIN, playerNew.id);
            break;
        }
        case ACTION_TRANSFER: {
            const player = playerGet(this.playerId);
            player.roomTransfer(data);
            break;
        }
        case ACTION_WEBRTC_SIGNAL: {
            const player = playerGet(data.targetPlayerId);
            if(!player) { return;}
            player.client.dataSend(ACTION_WEBRTC_SIGNAL, {
                originatingPlayerId: this.playerId,
                data: data.data,
            });
            break;
        }
    }
}
