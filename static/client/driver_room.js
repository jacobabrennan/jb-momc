

//==============================================================================

//-- Dependencies --------------------------------
import {
    NORTH,
    SOUTH,
    EAST,
    WEST,
} from '../constants.js';
import { roomGet } from '../game/room.js';
import { playerGet } from '../game/index.js';
import {
    driverCreate,
    CSS_CLASS_ACTIVE,
} from  './driver.js';
import {
    blank,
    drawImage,
} from './graphics.js';
import { commandState } from './key_state.js';

//------------------------------------------------
export default driverCreate({
    configure({ idGameArea }) {
        this.containerId = idGameArea;
    },
    focused() {
        const container = document.getElementById(this.containerId);
        container.classList.add(CSS_CLASS_ACTIVE);
    },
    blurred() {
        const container = document.getElementById(this.containerId);
        container.classList.remove(CSS_CLASS_ACTIVE);
    },
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
