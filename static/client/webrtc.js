

//==============================================================================

//-- Dependencies --------------------------------
// See SimplePeer from simplepeer.min.js
import {
    ACTION_WEBRTC_SIGNAL,
} from '../constants.js';
import { messageSend } from './network.js';

//-- Module State --------------------------------
const connections = {};
export function connectionGet(playerId) {
    return connections[playerId];
}

//------------------------------------------------
export default class WebRTC {
    constructor(playerId, initiator=false) {
        this.targetPlayerId = playerId;
        connections[playerId] = this;
        //
        const configurationPeer = {
            initiator: initiator,
            trickle: false,
        };
        //
        this.connection = new SimplePeer(configurationPeer);
        this.connection.on('error'  , (event) => this.handleError  (event));
        this.connection.on('signal' , (event) => this.handleSignal (event));
        this.connection.on('connect', (event) => this.handleConnect(event));
        this.connection.on('data'   , (event) => this.handleData   (event));
        // this.connection.on('close'  , (event) => this.handleClose  (event));
        // setInterval(() => {
        //     this.connection.send(`Check: ${Math.random()}`);
        // }, 1000)
    }

    //------------------------------------------------
    handleError(error) {
        // console.log('error', error);
    }
    handleSignal(data) {
        messageSend(ACTION_WEBRTC_SIGNAL, {
            targetPlayerId: this.targetPlayerId,
            data: data,
        });
    }
    handleData(data) {
        // console.log('data: ' + data);
    }
    handleConnect() {
        console.log('CONNECT');
    }
    // handleCLose() {
    //     console.log('close');
    // }
    
    //------------------------------------------------
    signal(data) {
        this.connection.signal(data);
    }
}
