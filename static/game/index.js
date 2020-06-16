

//==============================================================================

//-- Dependencies --------------------------------
import Character from './character.js';
import Room, { EXIT_LEFT } from './room.js';
import client from '../client/index.js';
import driverRoom from '../client/driver_room.js';

//-- Constants -----------------------------------
const ID_ROOM_TEST = 'test';
const ID_ROOM_LEFTTEST = 'LEFT test'

//-- Module State --------------------------------
let player;
export function playerGet() {
    return player;
}

//------------------------------------------------
export function start() {
    let roomFirst = new Room(ID_ROOM_TEST);
    new Room(ID_ROOM_LEFTTEST);
    roomFirst.exitLink(EXIT_LEFT, ID_ROOM_LEFTTEST);
    player = new Character();
    player.roomTransfer(ID_ROOM_TEST);
    client.focus(driverRoom)
}
