

//== Client Management =========================================================

//-- Constants -----------------------------------
const EVENT_MESSAGE = 'message';
const EVENT_DISCONNECT = 'close';
const ACTION_LOG_IN = 'logIn';
// const ACTION_KEY_DOWN = 'keyDown';
// const ACTION_KEY_UP = 'keyUp';
// const ACTION_UPDATE = 'update';
// const ACTION_AUDIO_BUFFER = 'audioBuffer';

//-- Client Management ---------------------------
const clientsActive = {};
export function clientGetAll() {
    return Object.assign({}, clientsActive);
}
export function clientAdd(socket, request) {
    const clientNew = new Client(socket, request);
    clientsActive[clientNew.id] = clientNew;
    return clientNew;
}
export function clientRemove(clientOld) {
    delete clientsActive[clientOld.id];
}


//== Client ====================================================================

//-- Class Definition ----------------------------
class Client {
    constructor(socket, request) {
        // Initialize object properties
        this.commandState = {};
        // Give each client a random id
            // This can be changed later when the client logs in
            // (login not yet implemented)
        const randomInt = Math.floor(Math.random()*10000);
        this.id = `Guest_${randomInt}`
        // Configure network connection
        this.dataSetup(socket);
    }
}

//-- Networking ----------------------------------
Client.prototype.dataSetup = function (socket) {
    this.socket = socket;
    socket.on(EVENT_DISCONNECT, (eventClose) => {
        clientRemove(this);
    });
    socket.on(EVENT_MESSAGE, (eventMessage) => {
        eventMessage = JSON.parse(eventMessage);
        if(eventMessage.action) {
            this.dataReceive(eventMessage.action, eventMessage.data);
        }
    });
};
Client.prototype.dataSend = function (action, data) {
    // Send action and associated data to remote client as a string
    const message = {
        action: action,
        data: data,
    };
    this.socket.send(JSON.stringify(message));
};
Client.prototype.dataReceive = function (action, data) {
    // Execute commands received from remote client
    switch(action) {
        case ACTION_LOG_IN:
            this.logIn(data);
            break;
    }
};
