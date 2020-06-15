

//==============================================================================

//-- Dependencies --------------------------------
import { roomGet, EXIT_LEFT, EXIT_RIGHT } from './room.js';

//------------------------------------------------
export default class Particle {
    x = 0
    y = 0
    roomId = null
    graphic = 'bird'
    roomTransfer(idRoomNew, exitDirection) {
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
        // Signal Success
        return true;
    }
}
