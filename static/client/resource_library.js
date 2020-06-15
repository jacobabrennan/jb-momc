

//==============================================================================

//-- Dependencies --------------------------------

//-- Constants -----------------------------------

//------------------------------------------------
const graphics = {};
class Graphic {
    constructor(id, url, width=16, height=16) {
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
    new Graphic('kitten', 'rsc/144.jpg', 256, 144),
    new Graphic('bird', 'rsc/bird.png'),
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
