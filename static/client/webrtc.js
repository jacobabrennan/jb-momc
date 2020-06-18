

//==============================================================================

//-- Dependencies --------------------------------
// See SimplePeer from simplepeer.min.js
import {
    ACTION_WEBRTC_SIGNAL,
} from '../constants.js';
import { playerGet } from '../game/index.js';
import { messageSend } from './network.js';
import {
    playerRemoteRemove,
    playerRemoteGet,
} from './playerRemote.js';
import { streamAudioLocalGet } from './audio.js';

//-- Constructor / Cleanup -----------------------
export default class Connection {
    constructor(playerId, initiate=false) {
        this.playerId = playerId;
        //
        const configurationPeer = {
            initiator: initiate,
            // trickle: false,
            stream: streamAudioLocalGet(),
        };
        //
        this.webRTC = new SimplePeer(configurationPeer);
        this.webRTC.on('error'  , (event) => this.handleError  (event));
        this.webRTC.on('signal' , (event) => this.handleSignal (event));
        this.webRTC.on('connect', (event) => this.handleConnect(event));
        this.webRTC.on('data'   , (event) => this.handleData   (event));
        this.webRTC.on('close'  , (event) => this.handleClose  (event));
        this.webRTC.on('stream' , (event) => this.handleStream (event));
    }
    destroy() {
        this.webRTC.destroy();
    }
}

//-- Signal Channel ------------------------------
Connection.prototype.signal = function (data) {
    this.webRTC.signal(data);
}

//-- Data Channel --------------------------------
Connection.prototype.send = function (data) {
    if(!this.connected) { return;}
    this.webRTC.send(JSON.stringify(data));
}

//-- Event Handlers ('life cycle') ---------------
Connection.prototype.handleConnect = function () {
    this.connected = true;
    const playerLocal = playerGet();
    this.send({
        x: playerLocal.x,
        y: playerLocal.y,
    });
}
Connection.prototype.handleClose = function () {
    playerRemoteRemove(this.playerId);
}
Connection.prototype.handleError = function (error) {
    // console.log('error', error);
}
Connection.prototype.handleSignal = function (data) {
    messageSend(ACTION_WEBRTC_SIGNAL, {
        targetPlayerId: this.playerId,
        data: data,
    });
}
Connection.prototype.handleData = function (data) {
    const dataObject = JSON.parse(data);
    const remotePlayer = playerRemoteGet(this.playerId);
    remotePlayer.dataReceive(dataObject);
}
Connection.prototype.handleStream = function (stream) {
    const remotePlayer = playerRemoteGet(this.playerId);
    remotePlayer.connectStreamAudio(stream);
}
