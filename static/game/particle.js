

//==============================================================================

//-- Dependencies --------------------------------
import {
    SIZE_TILE,
    MOVEMENT_EMPTY,
} from '../constants.js';

//------------------------------------------------
export default class Particle {
    roomId = null
    x = 0
    y = 0
    movement = MOVEMENT_EMPTY
    width = SIZE_TILE
    height = SIZE_TILE
    graphic = 'bird'
}
