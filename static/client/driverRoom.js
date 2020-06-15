

//==============================================================================

//-- Dependencies --------------------------------
import { driverCreate } from  './driver.js';
import {
    blank,
    drawImage,
} from './skin.js';
import { roomGet } from '../game/room.js';
import { playerGet } from '../game/index.js';
import { commandState } from './key_state.js';
import {
    NORTH,
    SOUTH,
    EAST,
    WEST,
} from './constants.js';

//------------------------------------------------
export default driverCreate({
    iterate() {
        //
        let deltaX = 0;
        let deltaY = 0;
        if(commandState(NORTH)) { deltaY++;}
        if(commandState(SOUTH)) { deltaY--;}
        if(commandState(EAST)) { deltaX++;}
        if(commandState(WEST)) { deltaX--;}
        if(!deltaX && !deltaY) {
            return;
        }
        //
        const player = playerGet();
        player.move(deltaX, deltaY);
    },
    display() {
        blank();
        const player = playerGet();
        const roomCurrent = roomGet(player.roomId);
        for(const indexedParticle of roomCurrent.particles) {
            drawParticle(indexedParticle);
        }
    },
});

//------------------------------------------------
function drawParticle(theParticle) {
    drawImage(theParticle.graphic, theParticle.x, theParticle.y);
}
