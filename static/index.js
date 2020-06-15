

//==============================================================================

//-- Dependencies --------------------------------
import client from './client/index.js';
import { start } from './game/index.js';
import driverRoom from './client/driverRoom.js';

//-- Constants -----------------------------------
const ID_CONTAINER = 'game_area';
const ADDRESS_CONNECTION = 'ws://localhost:7231/data';

//------------------------------------------------
const configuration = {
    idContainer: ID_CONTAINER,
    addressConnection: ADDRESS_CONNECTION,
};
client.setup(configuration)
.then(function () {
    start();
})
.then(function () {
    client.focus(driverRoom);
});
