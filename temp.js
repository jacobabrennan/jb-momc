

//==============================================================================

class Mover {
    x = 0
    y = 0
    velX = 0
    velY = 0
    width =  TILE_SIZE
    height = TILE_SIZE
    // color = 'grey'
    // gravity = 0
    direction = LEFT
    // faction = FACTION_ENVIRONMENT
    // blockStanding = false
    // reactivating: true,
    // takeTurn: function (){
    //     if(this.gravity){
    //         this.velY = bound(this.velY-this.gravity, -(TILE_SIZE-1), (TILE_SIZE-1));
    //     }
    //     this.translate(this.velX, this.velY);
    // },
    // collisionCheck: function (m2){
    //     if(    Math.abs(this.x+this.width /2 - (m2.x+m2.width /2)) < (this.width +m2.width )/2){
    //         if(Math.abs(this.y+this.height/2 - (m2.y+m2.height/2)) < (this.height+m2.height)/2){
    //             return true;
    //         }
    //     }
    //     return false;
    // },
    // containsPoint: function (x, y){
    //     if(this.x <= x && this.x+this.width >= x && this.y <= y && this.y+this.height >= y){
    //         return true;
    //     }
    //     return false;
    // },
    stopHorizontal() {}
    translate(deltaX, deltaY) {
        var originalX = this.x;
        var originalY = this.y;
        //var success = false;
        // Determine if movement will cause the object's edge to cross a border between turfs.
        var checkX = false;
        var checkY = false;
        var poleX;
        var poleY;
        // var landed = false;
        // var blockStand = null;
        if(!deltaX){ poleX = 0;}
        else if(deltaX > 0){ poleX = 1;}
        else{ poleX = -1;}
        if(!deltaY){ poleY = 0;}
        else if(deltaY > 0){ poleY = 1;}
        else{ poleY = -1;}
        var baseY = Math.floor((this.y)/TILE_SIZE)*TILE_SIZE;
        if(poleX == 1){
            if(((this.x+this.width)-1)%TILE_SIZE + deltaX >= TILE_SIZE){
                // -1 because the Nth position pixel is at index N-1.
                checkX = true;
                var limitX = TILE_SIZE - (((this.x+this.width)-1)%TILE_SIZE);
                this.x += limitX-1;
                deltaX -= limitX-1;
            }
        }
        else if(poleX == -1){
            if((this.x%TILE_SIZE) + deltaX < 0){
                checkX = true;
                this.x = this.x - (this.x%TILE_SIZE);
                deltaX = deltaX + this.x%TILE_SIZE;
            }
        }
        if(poleY == 1){
            if(((this.y+this.height)-1)%TILE_SIZE + deltaY >= TILE_SIZE){
                // -1 because the Nth position pixel is at index N-1.
                checkY = true;
                var limitY = TILE_SIZE - (((this.y+this.height)-1)%TILE_SIZE);
                this.y += limitY-1;
                deltaY -= limitY-1;
            }
        }
        else if(poleY == -1){
            if((this.y%TILE_SIZE) + deltaY < 0){
                checkY = true;
                this.y = this.y - Math.abs(this.y%TILE_SIZE);
                deltaY = deltaY + this.y%TILE_SIZE;
            }
        }
        // Determine size of border crossed, in tiles
            // If the object is centered in a turf and is less than or equal to game.TILE_SIZE, this number will be 1
            // If the object is 3x game.TILE_SIZE, then this number could be as much as 4.
        var sideHeight = Math.ceil(((this.y%TILE_SIZE)+this.height)/TILE_SIZE);
        var centerX;
        var destination;
        var destination2;
        var I;
        if(checkX){
            centerX = this.x + this.width/2;
            var currentBase = game.level.tileAt(centerX, this.y);
            if(poleX == 1){
                for(I = 0; I < sideHeight; I++){
                    destination = game.level.tileAt(((this.x+this.width)-1)+deltaX, this.y+(I*TILE_SIZE));
                    if(currentBase && currentBase.slope && I == 0){
                        // MAGIC NUMBERS!
                    } else if(!destination || destination.dense){
                        deltaX = 0;
                        //this.handle_event(this, {type: DM.EVENT_STOP, direction: DM.EAST});
                        this.stopHorizontal();
                        this.x += (TILE_SIZE - (((this.x+this.width)-1)%TILE_SIZE)) -1;
                        break;
                    }
                }
            }
            else if(poleX == -1){
                for(I = 0; I < sideHeight; I++){
                    destination = game.level.tileAt(this.x+deltaX, this.y+(I*TILE_SIZE));
                    if(currentBase && currentBase.slope && I == 0){
                        // MAGIC NUMBERS!
                    } else if(!destination || destination.dense){
                        deltaX = 0;
                        //this.handle_event(this, {type: DM.EVENT_STOP, direction: DM.WEST});
                        this.stopHorizontal();
                        this.x = this.x - this.x%TILE_SIZE;
                        break;
                    }
                }
            }
        }
        this.x += deltaX;
        var baseWidth  = Math.ceil(((this.x%TILE_SIZE)+this.width )/TILE_SIZE);
        if(poleY == -1){
            destination = game.level.tileAt(this.x+this.width/2, this.y+deltaY);
            destination2 = game.level.tileAt(this.x+this.width/2, this.y);
            if(destination && destination.slope){
                centerX = ((this.x + this.width/2)%TILE_SIZE)/TILE_SIZE;
                var left  = destination.slope.left ;
                var right = destination.slope.right;
                var baseElevation = (right-left)*centerX+left; // y = mx+b
                baseElevation *= TILE_SIZE;
                baseElevation += 1;
                baseElevation += Math.floor((this.y+deltaY)/TILE_SIZE)*TILE_SIZE;
                this.y = Math.max((this.y+deltaY), baseElevation);
                deltaY = 0;
                checkY = false;
                this.velY = 0;
                landed = true;
            } else if(destination && destination2.slope){
                centerX = ((this.x + this.width/2)%TILE_SIZE)/TILE_SIZE;
                var left  = destination2.slope.left ;
                var right = destination2.slope.right;
                var baseElevation = (right-left)*centerX+left; // y = mx+b
                baseElevation *= TILE_SIZE;
                baseElevation += 1;
                baseElevation += Math.floor((this.y)/TILE_SIZE)*TILE_SIZE;
                this.y = Math.max((this.y+deltaY), baseElevation);
                deltaY = 0;
                checkY = false;
                this.velY = 0;
                landed = true;
            } else if(destination && destination.dense){
                var destinationElevation = baseY + TILE_SIZE;
                if(Math.abs(destinationElevation - this.y) < TILE_SIZE/4){
                    // MAGIC NUMBERS!
                    this.y = destinationElevation;
                    deltaY = 0;
                    checkY = false;
                    this.velY = 0;
                    landed = true;
                }
            }
        }
        if(checkY){
            if(poleY == 1){
                for(I = 0; I < baseWidth; I++){
                    destination = game.level.tileAt(this.x+(I*TILE_SIZE), ((this.y+this.height)-1)+deltaY);
                    if(!destination || destination.dense){
                        deltaY = 0;
                        //this.handle_event(this, {type: DM.EVENT_STOP, direction: DM.SOUTH});
                        this.y += (TILE_SIZE - (((this.y+this.height)-1)%TILE_SIZE)) -1;
                        this.velY = 0;
                        break;
                    }
                }
            }
            else if(poleY == -1){
                for(I = 0; I < baseWidth; I++){
                    destination = game.level.tileAt(this.x+(I*TILE_SIZE), this.y+deltaY);
                    if(destination && destination.dense){
                        deltaY = 0;
                        this.velY = 0;
                        //this.handle_event(this, {type: DM.EVENT_STOP, direction: DM.NORTH});
                        this.y = this.y - this.y%TILE_SIZE;
                        landed = true;
                        break;
                    }
                }
            }
        }
        this.y += deltaY;
        this.y = Math.floor(this.y);
        this.x = Math.floor(this.x);
        if(landed){ this.land(blockStand);}
        if(this.y+this.height < 0){ this.dispose();}
    }
    center(centerMover) {
        this.x = centerMover.x+(centerMover.width -this.width )/2;
        this.y = centerMover.y+(centerMover.height-this.height)/2;
    }
}
