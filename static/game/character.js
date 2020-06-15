

//==============================================================================

//-- Dependencies --------------------------------
import Particle from './particle.js';
import {
    EXIT_LEFT,
    EXIT_RIGHT,
    roomGet,
} from './room.js';

//------------------------------------------------
export default class Character extends Particle {
    width = 16
    height = 16
    move(deltaX, deltaY) {
        //
        const roomCurrent = roomGet(this.roomId);
        if(!roomCurrent) { return false;}
        //
        this.x += deltaX;
        this.y += deltaY;
        //
        let exitDirection;
        if(this.x < 0) {
            exitDirection = EXIT_LEFT;
        }
        else if(this.x + this.width >= roomCurrent.width) {
            exitDirection = EXIT_RIGHT;
        }
        const roomIdExit = roomCurrent.exitGet(exitDirection);
        if(roomIdExit) {
            return this.roomTransfer(roomIdExit, exitDirection);
        }
        //
        if(this.x < 0) {
            this.x = 0;
        }
        if(this.x+this.width >= roomCurrent.width) {
            this.x = roomCurrent.width-(this.width);
        }
        if(this.y < 0) {
            this.y = 0;
        }
        if(this.y+this.height >= roomCurrent.height) {
            this.y = roomCurrent.height-(this.height);
        }
        //
        return true;
    }
}
