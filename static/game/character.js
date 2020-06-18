

//==============================================================================

//-- Dependencies --------------------------------
import Particle from './particle.js';
import {
    ACTION_TRANSFER,
    SIZE_TILE,
} from '../constants.js';
import { messageSend } from '../client/network.js';
import {
    EXIT_LEFT,
    EXIT_RIGHT,
    roomGet,
} from './room.js';
import { repositionListener } from '../client/audio.js';
import {
    playerRemoteClearAll,
    broadcast,
} from '../client/playerRemote.js';

//------------------------------------------------
export default class Character extends Particle {
    width = 16
    height = 16
    move(deltaX, deltaY) {
        //
        const roomCurrent = roomGet(this.roomId);
        if(!roomCurrent) { return false;}
        //
        if(!(deltaX || deltaY)) { return true;}
        //
        const transfered = this.transferCheck(deltaX, deltaY);
        if(transfered) { return true;}
        //
        const success = attemptMove(this, deltaX, deltaY);
        if(!success) { return false;}
        repositionListener(this.x, this.y);
        broadcast({
            x: this.x,
            y: this.y,
        });
        return true;
    }
    transferCheck(deltaX, deltaY) {
        //
        const roomCurrent = roomGet(this.roomId);
        //
        let exitDirection;
        if(deltaX > 0) {
            if((roomCurrent.width*SIZE_TILE) - (this.x+this.width) < deltaX) {
                exitDirection = EXIT_RIGHT;
            }
        } else if(deltaX < 0) {
            if(Math.abs(deltaX) > this.x) {
                exitDirection = EXIT_LEFT;
            }
        }
        // if(deltaY > 0) {
        //     if((roomCurrent.height*SIZE_TILE) - (this.y+this.height) < deltaY) {
        //         exitDirection = EXIT_NORTH;
        //     }
        // } else if(deltaY < 0) {
        //     if(Math.abs(deltaY) > this.y) {
        //         exitDirection = EXIT_SOUTH;
        //     }
        // }
        //
        const roomIdExit = roomCurrent.exitGet(exitDirection);
        if(!roomIdExit) { return false;}
        return this.roomTransfer(roomIdExit, exitDirection);
    }
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
        playerRemoteClearAll();
        // Place in new room
        if(roomNew) {
            roomNew.transferEnter(this);
        }
        this.roomId = roomNew.id;
        // Reposition based on exit direction
        if(exitDirection === EXIT_LEFT) {
            this.x = (roomNew.width*SIZE_TILE) - this.width;
        }
        if(exitDirection === EXIT_RIGHT) {
            this.x = 0;
        }
        // Update server to room change
        messageSend(ACTION_TRANSFER, this.roomId);
        // Signal Success
        return true;
    }
    // move(deltaX, deltaY) {
    //     //
    //     const roomCurrent = roomGet(this.roomId);
    //     if(!roomCurrent) { return false;}
    //     //
    //     this.x += deltaX;
    //     this.y += deltaY;
    //     //
    //     let exitDirection;
    //     const roomOldWidthFull = roomCurrent.width*SIZE_TILE;
    //     if(this.x < 0) {
    //         exitDirection = EXIT_LEFT;
    //     }
    //     else if(this.x + this.width >= roomOldWidthFull) {
    //         exitDirection = EXIT_RIGHT;
    //     }
    //     const roomIdExit = roomCurrent.exitGet(exitDirection);
    //     if(roomIdExit) {
    //         return this.roomTransfer(roomIdExit, exitDirection);
    //     }
    //     //
    //     const roomNewWidthFull = roomCurrent.width*SIZE_TILE;
    //     const roomNewHeightFull = roomCurrent.width*SIZE_TILE;
    //     if(this.x < 0) {
    //         this.x = 0;
    //     }
    //     if(this.x+this.width >= roomNewWidthFull) {
    //         this.x = roomNewWidthFull-(this.width);
    //     }
    //     if(this.y < 0) {
    //         this.y = 0;
    //     }
    //     if(this.y+this.height >= roomNewHeightFull) {
    //         this.y = roomNewHeightFull-(this.height);
    //     }
    //     //
    //     repositionListener(this.x, this.y);
    //     //
    //     broadcast({
    //         x: this.x,
    //         y: this.y,
    //     });
    //     //
    //     return true;
    // }
}


//==============================================================================

//------------------------------------------------
function attemptMove(mover, deltaX, deltaY) {
    if(!(deltaX || deltaY)) { return false;}
    const posXOld = mover.x;
    const posYOld = mover.y;
    //
    const [deltaXRemainder, deltaYRemainder] = moveSafe(mover, deltaX, deltaY)
    if(!(deltaXRemainder || deltaYRemainder)) {
        if(posXOld === mover.x && posYOld === mover.y) { return false;}
        return true;
    }
    //
    const {
        deltaXProceed,
        deltaYProceed,
        tilesEntering,
    } = movePermission(mover, deltaXRemainder, deltaYRemainder);
    if(!tilesEntering.length) {
        if(posXOld === mover.x && posYOld === mover.y) { return false;}
        return true;
    }
    //
    mover.x += deltaXProceed;
    mover.y += deltaYProceed;
    for(let tile of tilesEntering) {
        tile.moveEntered(mover, tile.x, tile.y);
    }
    //
    return true;
}

//------------------------------------------------
function moveSafe(mover, deltaX, deltaY) {
    // Move safe distance
    const poleX = Math.sign(deltaX);
    const poleY = Math.sign(deltaY);
    let deltaXSafe = 0;
    let deltaYSafe = 0;
    let deltaXRemainder = deltaX;
    let deltaYRemainder = deltaY;
    //
    if(poleX === 1) {
        deltaXSafe = (SIZE_TILE-1) - (mover.x+mover.width-1)%SIZE_TILE;
        deltaXSafe = Math.min(deltaXSafe, deltaX);
        deltaXRemainder = deltaX-deltaXSafe;
    }
    if(poleX === -1) {
        deltaXSafe = -(mover.x%SIZE_TILE);
        deltaXSafe = Math.max(deltaXSafe, deltaX);
        deltaXRemainder = deltaX-deltaXSafe;
    }
    if(poleY === 1) {
        deltaYSafe = (SIZE_TILE-1) - (mover.y+mover.height-1)%SIZE_TILE;
        deltaYSafe = Math.min(deltaYSafe, deltaY);
        deltaYRemainder = deltaY-deltaYSafe;
    }
    if(poleY === -1) {
        deltaYSafe = -(mover.y%SIZE_TILE);
        deltaYSafe = Math.max(deltaYSafe, deltaY);
        deltaYRemainder = deltaY-deltaYSafe;
    }
    //
    mover.x += deltaXSafe;
    mover.y += deltaYSafe;
    //
    return [deltaXRemainder, deltaYRemainder];
}

//------------------------------------------------
function movePermission(mover, deltaX, deltaY) {
    //
    let blockedX = false;
    let blockedY = false;
    //
    const roomCurrent = roomGet(mover.roomId);
    const posXStart = Math.floor(mover.x/SIZE_TILE);
    const posYStart = Math.floor(mover.y/SIZE_TILE);
    const posXEnd = Math.floor((mover.x+mover.width-1)/SIZE_TILE);
    const posYEnd = Math.floor((mover.y+mover.height-1)/SIZE_TILE);
    //
    const edgeX = [];
    const edgeY = [];
    //
    let leadingEdgeX;
    if(deltaX) {
        const poleX = Math.sign(deltaX);
        if(poleX ===  1) { leadingEdgeX = posXEnd  +poleX;}
        if(poleX === -1) { leadingEdgeX = posXStart+poleX;}
        for(let posY = posYStart; posY <= posYEnd; posY++) {
            const tileTest = roomCurrent.tileAt(leadingEdgeX, posY);
            if(!tileTest) {
                blockedX = true;
                continue;
            }
            edgeX.push(tileTest);
            if(!tileTest.movePermissionEnter(mover, leadingEdgeX, posY)) {
                blockedX = true;
                tileTest.bumped(mover, leadingEdgeX, posY);
            }
        }
    }
    //
    let leadingEdgeY;
    if(deltaY) {
        const poleY = Math.sign(deltaY);
        if(poleY ===  1) { leadingEdgeY = posYEnd  +poleY;}
        if(poleY === -1) { leadingEdgeY = posYStart+poleY;}
        for(let posX = posXStart; posX <= posXEnd; posX++) {
            const tileTest = roomCurrent.tileAt(posX, leadingEdgeY);
            if(!tileTest) {
                blockedY = true;
                continue;
            }
            edgeY.push(tileTest);
            if(!tileTest.movePermissionEnter(mover, posX, leadingEdgeY)) {
                blockedY = true;
                tileTest.bumped(mover, posX, leadingEdgeY);
            }
        }
    }
    //
    if(deltaX && deltaY && !blockedX) {
        const tileTest = roomCurrent.tileAt(leadingEdgeX, leadingEdgeY);
        if(!tileTest) {
            blockedY = true;
        } else {
            edgeY.push(tileTest);
            if(!tileTest.movePermissionEnter(mover, leadingEdgeX, leadingEdgeY)) {
                blockedY = true;
                tileTest.bumped(mover, leadingEdgeX, leadingEdgeY);
            }
        }
    }
    //
    const tilesEntering = [];
    if(!blockedX) { tilesEntering.push(...edgeY);}
    if(!blockedY) { tilesEntering.push(...edgeX);}
    //
    return {
        deltaXProceed: (blockedX? 0 : deltaX),
        deltaYProceed: (blockedY? 0 : deltaY),
        tilesEntering: tilesEntering,
    };
}
