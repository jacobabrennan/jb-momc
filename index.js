

//==============================================================================

//-- Dependencies --------------------------------
import { server } from './server.js';

//-- Constants -----------------------------------
const PORT = 7231;
const MESSAGE_SERVER_LISTENING = `Server open on port ${PORT}`;

//------------------------------------------------
server.listen(PORT, function () {
    console.log(MESSAGE_SERVER_LISTENING);
});
