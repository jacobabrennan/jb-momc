

//==============================================================================

//-- Dependencies --------------------------------
import { playerGet } from '../game/index.js';
import Connection from './webrtc.js';
import Audio from './audio.js';

//-- Module State --------------------------------
const players = {};

//-- Player Management ---------------------------
export function playerRemoteGet(playerId) {
    return players[playerId];
}
export function playerRemoteAdd(playerId, connectionInitiate) {
    const playerNew = new Player(playerId, connectionInitiate);
    players[playerId] = playerNew;
    return playerNew;
}
export function playerRemoteRemove(playerId) {
    const playerOld = players[playerId];
    if(!playerOld) { return;}
    playerOld.connection.destroy();
    delete players[playerId];
}
export function playerRemoteClearAll() {
    for(let playerId in players) {
        playerRemoteRemove(playerId);
    }
}
export function playerRemoteGetAll() {
    const playersList = [];
    for(let playerId in players) {
        playersList.push(players[playerId]);
    }
    return playersList;
}

//-- Utilities -----------------------------------
export function broadcast(data) {
    for(let playerId in players) {
        const player = players[playerId];
        player.connection.send(data);
    }
}
export function spritesGet() {
    const sprites = [];
    for(let playerId in players) {
        const player = players[playerId];
        if(!Number.isFinite(player.x) || !Number.isFinite(player.y)) {
            continue;
        }
        sprites.push({
            x: player.x,
            y: player.y,
            playerId: playerId,
        });
    }
    return sprites;
}

//-- Main Class Declaration ----------------------
class Player {
    x = null
    y = null
    constructor(playerId, connectionInitiate) {
        this.audio = new Audio();
        this.id = playerId;
        this.connection = new Connection(playerId, connectionInitiate);
    }
    connectStreamAudio(streamAudio) {
        this.audio.connectStream(streamAudio);
    }
    dataReceive(data) {
        let positionChanged = false;
        if(data.x !== undefined) {
            positionChanged = true;
            this.x = data.x;
        }
        if(data.y !== undefined) {
            positionChanged = true;
            this.y = data.y;
        }
        if(positionChanged) {
            const playerLocal = playerGet();
            this.audio.panCalculate(
                playerLocal.x, playerLocal.y,
                this.x, this.y,
            );
        }
    }
}
