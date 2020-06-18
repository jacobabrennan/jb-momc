

//==============================================================================

//-- Dependencies --------------------------------
import { MOVEMENT_EMPTY } from '../constants.js';

//------------------------------------------------
export default class Tile {
    constructor(graphic, movement=MOVEMENT_EMPTY) {
        this.graphic = graphic;
        this.movement = movement;
    }
    movePermissionEnter(mover, posX, posY) { 
        if(!(mover.movement & this.movement)) { return false;}
        return true;
    }
    movePermissionExit(mover, posX, posY) {
        return true;
    }
    moveEntered(mover, posX, posY) {}
    moveExited(mover, posX, posY) {}
    bumped(mover, posX, posY) {}
}
