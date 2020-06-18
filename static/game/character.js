

//==============================================================================

//-- Dependencies --------------------------------
import {
    SIZE_TILE,
    MOVEMENT_EMPTY,
    EXIT_LEFT,
    EXIT_RIGHT,
    ACTION_TRANSFER,
} from '../constants.js';
import { messageSend } from '../client/network.js';
import { repositionListener } from '../client/audio.js';
import {
    playerRemoteClearAll,
    broadcast,
} from '../client/playerRemote.js';
import Particle from './particle.js';
import { roomGet } from './room.js';

//------------------------------------------------
export default class Character extends Particle {
    width = 16
    height = 16
    movement = MOVEMENT_EMPTY
    speed = 2
    move(deltaX, deltaY) {
        // Cancel if not currently in a room
        const roomCurrent = roomGet(this.roomId);
        if(!roomCurrent) { return false;}
        // Signal success if moving by zero magnitude (no op)
        if(!(deltaX || deltaY)) { return true;}
        // Attempt transfer if movement crosses room boundry
        const exitDirection = transferCheck(this, deltaX, deltaY);
        if(exitDirection) {
            const roomIdExit = roomCurrent.exitGet(exitDirection);
            if(roomIdExit) {
                const transfered = this.transfer(roomIdExit, exitDirection);
                if(transfered) { return true;}
            }
        }
        // Move across tile grid
        const success = attemptMove(this, deltaX, deltaY);
        if(!success) { return false;}
        repositionListener(this.x, this.y);
        broadcast({
            x: this.x,
            y: this.y,
        });
        // Signal Success
        return true;
    }
    transfer(roomIdNew, exitDirection) {
        // Signal success if transfering to current room (no op)
        // if(idRoomNew === mover.roomId) { return true;}
            // Disabled: circular rooms
        return attemptTransfer(this, roomIdNew, exitDirection);
    }
}


//== Movement Utilities ========================================================

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


//== Transfer Utilities ========================================================

//------------------------------------------------
function attemptTransfer(mover, idRoomNew, exitDirection) {
    // Get old and new rooms
    const roomOld = roomGet(mover.roomId);
    const roomNew = roomGet(idRoomNew);
    if(!roomNew) { return false;}
    // Check if movement is allowed
    if(roomOld) {
        if(!roomOld.transferExitPermission(mover)) { return false;}
    }
    if(roomNew) {
        if(!roomNew.transferEnterPermission(mover)) { return false;}
    }
    // Remove from old room
    if(roomOld) {
        roomOld.transferExit(mover);
    }
    mover.roomId = null;
    playerRemoteClearAll();
    // Place in new room
    roomNew.transferEnter(mover);
    mover.roomId = roomNew.id;
    // Reposition based on exit direction
    if(exitDirection === EXIT_LEFT) {
        mover.x = (roomNew.width*SIZE_TILE) - mover.width;
    }
    if(exitDirection === EXIT_RIGHT) {
        mover.x = 0;
    }
    // Update server to room change
    messageSend(ACTION_TRANSFER, mover.roomId);
    // Signal Success
    return true;
}

//------------------------------------------------
function transferCheck(mover, deltaX, deltaY) {
    //
    const roomCurrent = roomGet(mover.roomId);
    //
    let exitDirection;
    if(deltaX > 0) {
        if((roomCurrent.width*SIZE_TILE) - (mover.x+mover.width) < deltaX) {
            exitDirection = EXIT_RIGHT;
        }
    } else if(deltaX < 0) {
        if(Math.abs(deltaX) > mover.x) {
            exitDirection = EXIT_LEFT;
        }
    }
    // if(deltaY > 0) {
    //     if((roomCurrent.height*SIZE_TILE) - (mover.y+mover.height) < deltaY) {
    //         exitDirection = EXIT_NORTH;
    //     }
    // } else if(deltaY < 0) {
    //     if(Math.abs(deltaY) > mover.y) {
    //         exitDirection = EXIT_SOUTH;
    //     }
    // }
    //
    return exitDirection;
}