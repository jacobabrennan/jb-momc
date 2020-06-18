

//==============================================================================

//-- Dependencies --------------------------------
import client from '../client/index.js';
import driverRoom from '../client/driver_room.js';
import { ID_ROOM_START } from '../constants.js';
import { mapGenerateRooms } from './room_models.js';
import Character from './character.js';

//-- Module State --------------------------------
let player;
export function playerGet() {
    return player;
}

//------------------------------------------------
export function start() {
    mapGenerateRooms();
    player = new Character();
    player.transfer(ID_ROOM_START);
    client.focus(driverRoom)
}
