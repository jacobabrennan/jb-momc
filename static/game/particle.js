

//==============================================================================

//-- Dependencies --------------------------------
import { ACTION_TRANSFER } from '../constants.js';
import { messageSend } from '../client/network.js';
import {
    EXIT_LEFT,
    EXIT_RIGHT,
    roomGet,
} from './room.js';

//------------------------------------------------
export default class Particle {
    roomId = null
    x = 0
    y = 0
    width = 16
    height = 16
    graphic = 'bird'
    roomTransfer(idRoomNew, exitDirection) {
        // Do nothing if transfering to same room
        if(idRoomNew === this.roomId) { return true;}
        // Get old and new rooms
        const roomOld = roomGet(this.roomId);
        const roomNew = roomGet(idRoomNew);
        // Check if movement is allowed, signal failure if necessary
        if(roomOld) {
            if(!roomOld.transferExitPermission(this)) { return false;}
        }
        if(roomNew) {
            if(!roomNew.transferEnterPermission(this)) { return false;}
        }
        // Remove from old room
        if(roomOld) {
            roomOld.transferExit(this);
        }
        this.roomId = null;
        // Place in new room
        if(roomNew) {
            roomNew.transferEnter(this);
        }
        this.roomId = roomNew.id;
        // Reposition based on exit direction
        if(exitDirection === EXIT_LEFT) {
            this.x = roomNew.width - this.width;
        }
        if(exitDirection === EXIT_RIGHT) {
            this.x = 0;
        }
        // Update server to room change
        messageSend(ACTION_TRANSFER, this.roomId);
        // Signal Success
        return true;
    }
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
