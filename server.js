

//==============================================================================

//-- Dependencies --------------------------------
import express from 'express';
import ws from 'express-ws';
import { clientAdd } from './client_manager.js';

//-- Constants -----------------------------------
const URL_WEBSOCKET_MOUNT = '/data';

//------------------------------------------------
export const server = express();
ws(server);
server.use('/client', express.static('static'));

//------------------------------------------------
server.ws(URL_WEBSOCKET_MOUNT, function (socket, request) {
    clientAdd(socket, request);
});
