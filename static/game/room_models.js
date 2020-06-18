

//==============================================================================

//-- Dependencies --------------------------------
import {
    ID_ROOM_START,
    EXIT_LEFT,
    EXIT_RIGHT,
} from '../constants.js';
import Room from './room.js';
import tileTypes from './tile_types.js';

//-- Constants -----------------------------------
const ID_ROOM_LEFTTEST = 'room left test';

//------------------------------------------------
const roomModels = {
    [ID_ROOM_START]: {
        width: 48,
        height: 9,
        tiles: [
            tileTypes['sky'],
            tileTypes['dock'],
            tileTypes['dockCap'],
            tileTypes['dockShadow'],
            tileTypes['dockMottle'],
        ],
        exits: {
            [EXIT_LEFT]: ID_ROOM_LEFTTEST,
            [EXIT_RIGHT]: ID_ROOM_LEFTTEST,
        },
        layers: ['dock384', 'dock512'],
        tileString: '\
000000000000000000000000000000000000000000000000\
000000000000000000000000000000000000000000000000\
000000000000000000000000000000000000000000000000\
000000000000000000000000000000000000000000000000\
000000000000000000000000000000000000000000000000\
000000000000000000000000000000000000000000000000\
222222222222222222222222222222222222222222222222\
441111111111411111111111111111111111111111111111\
334411141444344144141111111411141111111111111444\
',
    },
    [ID_ROOM_LEFTTEST]: {
        width: 16,
        height: 9,
        tiles: [
            tileTypes['sky'],
            tileTypes['dockFace'],
            tileTypes['dock'],
        ],
        exits: {
            [EXIT_LEFT]: ID_ROOM_START,
            [EXIT_RIGHT]: ID_ROOM_START,
        },
        tileString: '\
0000000000000000\
0000000000000000\
0000000000000000\
0010101010101000\
0000000000000000\
2222222222222222\
2222222222222222\
2222222222222222\
1111111111111111\
',
    },
};

//------------------------------------------------
export function mapGenerateRooms() {
    for(let roomId in roomModels) {
        const roomModel = roomModels[roomId];
        new Room(
            roomId,
            roomModel.width,
            roomModel.height,
            roomModel.tiles,
            roomModel.tileString,
            roomModel.exits,
            roomModel.layers,
        );
    }
}
