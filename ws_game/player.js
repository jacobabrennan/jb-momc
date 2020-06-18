

//==============================================================================

//-- Dependencies --------------------------------
import {
    Room,
    roomGet,
} from './room.js';

//-- Constants -----------------------------------
const ERROR_PLAYER_ID_CONFLICT = 'Player ID Conflict';

//-- Module State --------------------------------
const players = {};
export function playerGet(idPlayer) {
    return players[idPlayer];
}
export function playerLogin(idPlayer, client) {
    //
    let player = players[idPlayer];
    if(player) {
        player.clientAttach(client);
        return player;
    }
    //
    player = new Player(idPlayer);
    player.clientAttach(client);
    return player;
}
export function playerLogout(idPlayer) {
    //
    let player = players[idPlayer];
    if(!player) { return;}
    //
    delete players[idPlayer]
    //
    player.dispose();
}

//------------------------------------------------
class Player {
    client = null
    roomId = null
    constructor(id) {
        if(players[id]) { throw ERROR_PLAYER_ID_CONFLICT;}
        this.id = id;
        players[this.id] = this;
    }
    dispose() {

    }
    clientAttach(client) {
        this.client = client;
    }
    roomTransfer(idRoom) {
        //
        const roomOld = roomGet(this.roomId);
        if(roomOld) {
            roomOld.playerRemove(this);
        }
        this.roomId = null;
        //
        let roomNew = roomGet(idRoom);
        if(!roomNew) {
            roomNew = new Room(idRoom);
        }
        roomNew.playerAdd(this);
        this.roomId = idRoom;
    }
}
