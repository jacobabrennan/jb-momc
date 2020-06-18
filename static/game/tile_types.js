

//==============================================================================

//-- Dependencies --------------------------------
import {
    MOVEMENT_SOLID,
    MOVEMENT_EMPTY,
} from '../constants.js';
import Tile from './tile.js';

//------------------------------------------------
export default {
    grass: new Tile('grass', MOVEMENT_SOLID),
    sky: new Tile(null, MOVEMENT_SOLID),
    dock: new Tile('dock', MOVEMENT_EMPTY),
    dockFace: new Tile('dockFace', MOVEMENT_SOLID),
    dockCap: new Tile('dockCap', MOVEMENT_EMPTY),
    dockShadow: new Tile('dockShadow', MOVEMENT_EMPTY),
    dockMottle: new Tile('dockMottle', MOVEMENT_EMPTY),
}
