

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
    constructor(id, roomModel) {
        //
        this.id = id;
        rooms[this.id] = this;
        //
        this.particles = [];
        this.exits = [];
        //
        this.width = roomModel.width;
        this.height = roomModel.height;
        this.tileGrid = roomModel.tileGrid;
        this.tileTypes = roomModel.tileTypes;
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

//-- Tiles ---------------------------------------
Room.prototype.tileAt = function TileAt(posX, posY) {
    if(posX === undefined) { throw 'bad x'}
    if(posY === undefined) { throw 'bad y'}
    if(posX < 0 || posX >= this.width) { return null;}
    if(posY < 0 || posY >= this.height) { return null;}
    const indexCompound = posY*this.width + posX;
    const indexTile = this.tileGrid[indexCompound];
    const tileModel = this.tileTypes[indexTile];
    const tileProxy = new Proxy(tileModel, {});
    tileProxy.x = posX;
    tileProxy.y = posY;
    return tileProxy;
}
