

//==============================================================================

//------------------------------------------------
import driverLogin from './driver_login.js';
import driverRoom from './driver_room.js';
import { setup as setupGraphics } from './graphics.js';
import { setup as setupResourceLibrary } from './resource_library.js';
import { setup as setupKeyState } from './key_state.js';
import { setup as setupNetwork } from './network.js';
import WebRTC from './webrtc.js';

//------------------------------------------------
export default {
    driverCurrent: null,
    async setup(configuration) {
        //
        await driverLogin.configure(configuration);
        await driverRoom.configure(configuration);
        //
        await setupResourceLibrary(configuration);
        await setupKeyState(configuration);
        await setupNetwork(configuration);
        await setupGraphics(configuration);
        //
        this.focus(driverLogin);
        //
        new WebRTC();
    },
    focus(driverNew) {
        if(this.driverCurrent) {
            this.driverCurrent.blurred();
        }
        this.driverCurrent = driverNew;
        if(this.driverCurrent) {
            this.driverCurrent.focused();
        }
    }
}
