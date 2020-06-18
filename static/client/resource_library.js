

//==============================================================================

//-- Dependencies --------------------------------
import { SIZE_TILE } from '../constants.js';

//-- Constants -----------------------------------

//------------------------------------------------
const graphics = {};
class Graphic {
    constructor(id, url, width=SIZE_TILE, height=SIZE_TILE) {
        this.id = id;
        this.url = url;
        this.width = width;
        this.height = height;
    }
    load() {
        graphics[this.id] = this;
        this.image = new Image();
        return new Promise((resolve, reject) => {
            this.image.addEventListener('load', resolve);
            this.image.src = this.url;
        });
    }
    draw(context, posX, posY, options) {
        let drawX = posX;
        let drawY = posY - this.height;
        context.drawImage(this.image, drawX, drawY);
    }
}
const graphicLoadingList = [
    new Graphic('bird', 'rsc/bird.png'),
    new Graphic('grass', 'rsc/grass.png'),
    new Graphic('sky', 'rsc/sky.png'),
    new Graphic('dock', 'rsc/dock_2.png'),
    new Graphic('dockFace', 'rsc/dock_face.png'),
    new Graphic('dockCap', 'rsc/dock_cap_2.png'),
    new Graphic('dockShadow', 'rsc/dock2_shadow.png'),
    new Graphic('dockMottle', 'rsc/dock2_mottle.png'),
    new Graphic('dock384', 'rsc/dock_paralax384.png', 384, 144),
    new Graphic('dock512', 'rsc/dock_paralax512.png', 512, 144),
];

//------------------------------------------------
export async function setup() {
    const graphicLoaders = graphicLoadingList.map(theGraphic => theGraphic.load());
    return Promise.all(graphicLoaders);
}

//------------------------------------------------
export function graphicGet(idGraphic) {
    return graphics[idGraphic];
}
