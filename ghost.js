class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomTargetsForGhosts.length);

        setInterval(() =>{
            this.changeRandomDirection()
        }, 10000);
    }

    changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    ghostMovement() {
        if(this.isInRangeOfPacman()) {
            target = pacman;
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }

        this.changeDirectionIfPossible();
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();   
        }
    }

    moveBackwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break
            case DIRECTION_UP:
                this.y += this.speed;
                break
            case DIRECTION_LEFT:
                this.x += this.speed;
                break
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break
        }
    }

    moveForwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break
            case DIRECTION_UP:
                this.y -= this.speed;
                break
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break
            case DIRECTION_BOTTOM:
                this.y += this.speed
                break
        }
    }

    checkCollision() {
        
        if(
           map[this.getMapY()][this.getMapX()] == 1 
        || map[this.getMapYRightSide()][this.getMapX()] == 1
        || map[this.getMapY()][this.getMapXRightSide()] == 1
        || map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true;
        }
        return false;
    }

    checkGhostCollision() {

    }

    isInRangeOfPacman(){
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if(Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range){
            return true;
        }
        return false;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / blockSize),
            parseInt(this.target.y / blockSize),
        );

        if(typeof this.direction === "undefined") {
            this.direction = tempDirection;
            return
        }

        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for(let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice()
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: [],
        }];

        while(queue.length > 0) {
            let poped = queue.shift();
            if(poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for(let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return DIRECTION_UP; //·· Default ··//
    }   

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if(poped.x - 1 >= 0 && poped.x - 1 < numOfRows && mp[poped.y][poped.x - 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({x: poped.x - 1, y: poped.y, moves: tempMoves});
        }

        if(poped.x + 1 >= 0 && poped.x + 1 < numOfRows && mp[poped.y][poped.x + 1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({x: poped.x + 1, y: poped.y, moves: tempMoves});
        }

        if(poped.y - 1 >= 0 && poped.y - 1 < numOfRows && mp[poped.y - 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({x: poped.x, y: poped.y - 1, moves: tempMoves});
        }

        if(poped.y + 1 >= 0 && poped.y + 1 < numOfRows && mp[poped.y + 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({x: poped.x, y: poped.y + 1, moves: tempMoves});
        }

        return queue;
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostsFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        
        canvasContext.restore();
    }

    getMapX() {
        return parseInt(this.x / blockSize);
    }

    getMapY() {
        return parseInt(this.y / blockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * blockSize) / blockSize);
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * blockSize) / blockSize);
    }
}