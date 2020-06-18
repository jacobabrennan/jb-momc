

//==============================================================================

//-- Constants -----------------------------------
const MAP_KEY_DEPTH = 16;

//-----------------------------------------------
export class RoomModel {
    constructor(width=16, height=9, tileTypes, tileString) {
        this.width = width;
        this.height = height;
        this.tileTypes = tileTypes.slice();
        //
        const chars = tileString.split('');
        this.tileGrid = [];
        for(let posY = height-1; posY >= 0; posY--) { // Flip string!
            for(let posX = 0; posX < width; posX++) {
                const indexCompound = posY*width + posX;
                const char = chars[indexCompound];
                const indexTile = parseInt(char, MAP_KEY_DEPTH);
                this.tileGrid.push(indexTile);
            }
        }
    }
}
