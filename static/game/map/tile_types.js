

//==============================================================================

//-- Dependencies --------------------------------
import {
    MOVEMENT_SOLID,
    MOVEMENT_EMPTY,
} from '../../constants.js';
import Tile from '../tile.js';

//------------------------------------------------
export default {
    grass: new Tile('grass', MOVEMENT_SOLID),
    sky: new Tile('sky', MOVEMENT_EMPTY),
}
