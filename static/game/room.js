

//==============================================================================

//-- Dependencies --------------------------------

//-- Constants -----------------------------------
export const EXIT_LEFT = Symbol('Exit Left');
export const EXIT_RIGHT = Symbol('Exit Right');

//-- Module State --------------------------------
const rooms = {};
export function roomGet(idRoom) {
    return rooms[idRoom];
}

//-- Main Class Export ---------------------------
export default class Room {
    width = 256
    height = 144
    constructor(id) {
        //
        this.id = id;
        rooms[this.id] = this;
        //
        this.particles = [];
        this.exits = [];
    }
}

//-- Room Networking -----------------------------
Room.prototype.exitGet = function (exit) {
    return this.exits[exit];
}
Room.prototype.exitLink = function (exit, idRoomDestination) {
    //
    this.exits[exit] = idRoomDestination;
    //
    const destination = roomGet(idRoomDestination);
    if(!destination) { return;}
    let mirrorExit;
    if(exit === EXIT_LEFT ) { mirrorExit = EXIT_RIGHT;}
    if(exit === EXIT_RIGHT) { mirrorExit = EXIT_LEFT ;}
    if(!mirrorExit) { return;}
    destination.exits[mirrorExit] = this.id;
}

//-- Transfer (movement) -------------------------
Room.prototype.transferExitPermission = function (particleMover) {
    return true;
}
Room.prototype.transferEnterPermission = function (particleMover) {
    return true;
}
Room.prototype.transferExit = function (particleMover) {
    //
    const indexParticle = this.particles.indexOf(particleMover);
    if(indexParticle === -1) { return;}
    // Remove mover from particles list
    this.particles.splice(indexParticle, 1);
}
Room.prototype.transferEnter = function (particleMover) {
    //
    const indexParticle = this.particles.indexOf(particleMover);
    if(indexParticle !== -1) { return;}
    // Add mover to particles list
    this.particles.push(particleMover);
}
