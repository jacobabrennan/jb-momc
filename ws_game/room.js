

//==============================================================================

import {
    ACTION_OCCUPANCY,
    // ACTION_OCCUPANCY_JOIN,
    ACTION_OCCUPANCY_LEAVE,
} from '../static/constants.js';

//-- Constants -----------------------------------
const ERROR_ROOM_ID_CONFLICT = 'Room ID Conflict';

//-- Module State --------------------------------
const rooms = {};
export function roomGet(idRoom) {
    return rooms[idRoom];
}

//------------------------------------------------
export class Room {
    constructor(id) {
        //
        if(rooms[id]) { throw ERROR_ROOM_ID_CONFLICT;}
        this.id = id;
        rooms[this.id] = this;
        //
        this.occupants = [];
    }
    playerAdd(playerNew) {
        //
        this.occupants.push(playerNew);
        //
        const occupantIds = [];
        for(let occupant of this.occupants) {
            if(occupant === playerNew) { continue;}
            occupantIds.push(occupant.id);
            //
            // occupant.client.dataSend({
            //     action: ACTION_OCCUPANCY_JOIN,
            //     data: playerNew.id,
            // });
        }
        //
        playerNew.client.dataSend(ACTION_OCCUPANCY, occupantIds);
    }
    playerRemove(playerOld) {
        //
        const indexPlayer = this.occupants.indexOf(playerOld);
        if(indexPlayer === -1) { return;}
        this.occupants.splice(indexPlayer, 1);
        //
        if(!this.occupants.length) { 
            delete rooms[this.id];
            return;
        }
        //
        for(let occupant of this.occupants) {
            occupant.client.dataSend(ACTION_OCCUPANCY_LEAVE, playerOld.id);
        }
    }
}
