

//==============================================================================

//------------------------------------------------
import { setup as setupSkin } from './skin.js';
import { setup as setupResourceLibrary } from './resource_library.js';
import { setup as setupKeyState } from './key_state.js';
import { setup as setupNetwork } from './network.js';

//------------------------------------------------
export default {
    driverCurrent: null,
    async setup(configuration) {
        await setupResourceLibrary(configuration);
        await setupKeyState(configuration);
        await setupSkin(configuration);
        await setupNetwork(configuration);
    },
    focus(driverNew) {
        this.driverCurrent = driverNew;
    }
}
