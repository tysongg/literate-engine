import type { CampaignMap, CampaignMapChunk } from ".";


export class MapRenderer {
    protected ctx: CanvasRenderingContext2D;
    protected map: CampaignMap;

    protected mapOffset: { [name: string]: number } = { x: 0, y: 0 }

    protected chunkSize: number;
    protected chunkWidth: number = 0;
    protected chunkHeight: number = 0;

    protected radialOffset: number;

    constructor(ctx: CanvasRenderingContext2D, map: CampaignMap, chunkSize = 50, radialOffset = 5) {
        this.ctx = ctx;
        this.map = map;

        this.chunkSize = chunkSize;

        this.radialOffset = radialOffset;
    }

    drawMap(mapCenter: { [name: string]: number } | null = null) {

        this.chunkWidth = Math.floor(this.ctx.canvas.width / this.chunkSize)
        this.chunkHeight = Math.floor(this.ctx.canvas.height / this.chunkSize);

        if (mapCenter === null) {
            this.mapOffset = { x: 0, y: 0 }
        } else {
            this.mapOffset = {
                x: -1 * (mapCenter.x - (Math.floor(this.chunkWidth / 2) - 1)),
                y: -1 * (mapCenter.y - (Math.floor(this.chunkHeight / 2) - 1))
            }
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {

                let chunk = this.map.getChunk(x, y);

                if (chunk !== null) {
                    this.drawMapChunk(chunk, false);
                }
            }
        }
    }

    // Draw API
    drawMapChunk(chunk: CampaignMapChunk, updateNeighbors = true) {
        // Check if chunk is visible on map
        if (
            chunk.x + this.mapOffset.x < 0 || chunk.x + this.mapOffset.x >= this.chunkWidth ||
            chunk.y + this.mapOffset.y < 0 || chunk.y + this.mapOffset.y >= this.chunkHeight
        ) {
            console.log(`Not Drawing Chunk: ${chunk.x}, ${chunk.y} Not In Visible Map`);
            return
        }

        console.log(`Drawing Chunk: ${chunk.x}, ${chunk.y} Visible: ${chunk.playerVisible}`);

        if (chunk.playerVisible) {
            this._drawVisibleChunk(chunk);
        } else if (this.map.hasVisibleNeighbors(chunk)) {
            this._drawHiddenChunk(chunk);
        } else {
            this._drawInvisibleChunk(chunk);
        }
        if (updateNeighbors === true) {
            this._updateNeighborChunks(chunk);
        }
    }

    drawMapChunkAtMapPos(x: number, y: number) {
        let chunk = this.map.getChunk(x, y);

        if (chunk !== null) {
            this.drawMapChunk(chunk);
        }
    }

    drawMapChunkAtCtxPox(x: number, y: number) {
        let mapPos = this.ctxPosToMapPos(x, y);
        let chunk = this.map.getChunk(mapPos.x, mapPos.y)

        if (chunk !== null) {
            this.drawMapChunk(chunk);
        }
    }

    // Internal Draw Functionality
    private _updateNeighborChunks(chunk: CampaignMapChunk) {
        console.log(`Updating Neighbor Chunks: ${chunk.x}, ${chunk.y}`)
        let neighbors = this.map.getNeighbors(chunk);

        for (let [, c] of Object.entries(neighbors)) {

            if (c === null) {
                continue;
            }

            if (!c.playerVisible) {
                this.drawMapChunk(c, false);
            }
        }
    }

    protected _drawVisibleChunk(chunk: CampaignMapChunk) {
        let ctxPos = this.mapPosToCtxPos(chunk.x, chunk.y);

        let img = new Image(this.chunkSize, this.chunkSize);
        img.onload = () => {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.drawImage(img, ctxPos.x, ctxPos.y);
        }
        img.src = chunk.chunkImage;
    }

    protected _drawHiddenChunk(chunk: CampaignMapChunk) {
        let ctxPos = this.mapPosToCtxPos(chunk.x, chunk.y);

        let img = new Image(this.chunkSize, this.chunkSize);
        img.onload = () => {
            // Clear Cell
            this.ctx.clearRect(ctxPos.x, ctxPos.y, this.chunkSize, this.chunkSize);

            // Draw Gradient
            this._drawChunkGradient(chunk);

            // Draw Image
            this.ctx.globalCompositeOperation = 'source-atop';
            this.ctx.drawImage(img, ctxPos.x, ctxPos.y);
        }
        img.src = chunk.chunkImage;
    }

    private _drawChunkGradient(chunk: CampaignMapChunk) {
        let { x, y } = this.mapPosToCtxPos(chunk.x, chunk.y)
        // let neighbors = this.map.getNeighbors(chunk);
        let neighbors = this._getNeighborVisiblity(this.map.getNeighbors(chunk));

        let _drawGradient = (gradient: CanvasGradient, offset?: number) => {

            if (offset === undefined) {
                offset = .2;
            }

            gradient.addColorStop(0, 'black');
            gradient.addColorStop(offset, 'transparent');

            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, this.chunkSize, this.chunkSize);
        }

        // Outer TopRight
        if (!neighbors.top && !neighbors.right && neighbors.topRight) {
            console.log('outer topRight');
            let gradient = this.ctx.createRadialGradient(x + this.chunkSize, y, 0, x + this.chunkSize, y, this.chunkSize);
            _drawGradient(gradient);
        }

        // Outer BottomRight
        if (!neighbors.right && !neighbors.bottom && neighbors.bottomRight) {
            console.log('outer bottomRight');
            let gradient = this.ctx.createRadialGradient(x + this.chunkSize, y + this.chunkSize, 0, x + this.chunkSize, y + this.chunkSize, this.chunkSize);
            _drawGradient(gradient);
        }

        // Outer BottomLeft
        if (!neighbors.bottom && !neighbors.left && neighbors.bottomLeft) {
            console.log('outer bottomLeft');
            let gradient = this.ctx.createRadialGradient(x, y + this.chunkSize, 0, x, y + this.chunkSize, this.chunkSize);
            _drawGradient(gradient);
        }

        // Outer TopLeft
        if (!neighbors.left && !neighbors.top && neighbors.topLeft) {
            console.log('outer topLeft');
            let gradient = this.ctx.createRadialGradient(x, y, 0, x, y, this.chunkSize);
            _drawGradient(gradient);
        }

        let midX = Math.floor(x + this.chunkSize / 2), midY = Math.floor(y + this.chunkSize / 2)

        // Inner Top
        if (neighbors.top) {
            console.log('top');
            let gradient = this.ctx.createLinearGradient(x, y, x, y + this.chunkSize)
            _drawGradient(gradient);

            if (neighbors.right) {
                console.log('inner topRight')

                let newX = midX - this.radialOffset, newY = midY + this.radialOffset;
                let cornerGradient = this.ctx.createRadialGradient(newX, newY, Math.floor(this.chunkSize * .8), newX, newY, 0);
                _drawGradient(cornerGradient, .3)
            }
        }

        // Inner Right
        if (neighbors.right) {
            console.log('right');
            let gradient = this.ctx.createLinearGradient(x + this.chunkSize, y, x, y)
            _drawGradient(gradient);

            if (neighbors.bottom) {
                console.log('inner bottomRight')

                let newX = midX - this.radialOffset, newY = midY - this.radialOffset;
                let cornerGradient = this.ctx.createRadialGradient(newX, newY, Math.floor(this.chunkSize * .8), newX, newY, 0);
                _drawGradient(cornerGradient, .3)
            }
        }

        // Inner Bottom
        if (neighbors.bottom) {
            console.log('bottom');
            let gradient = this.ctx.createLinearGradient(x, y + this.chunkSize, x, y)
            _drawGradient(gradient);

            if (neighbors.left) {
                console.log('inner bottomLeft')

                let newX = midX + this.radialOffset, newY = midY - this.radialOffset;
                let cornerGradient = this.ctx.createRadialGradient(newX, newY, Math.floor(this.chunkSize * .8), newX, newY, 0);
                _drawGradient(cornerGradient, .3)
            }
        }

        // Inner Left
        if (neighbors.left) {
            console.log('left');
            let gradient = this.ctx.createLinearGradient(x, y, x + this.chunkSize, y)
            _drawGradient(gradient);

            if (neighbors.top) {
                console.log('inner topLeft')

                let newX = midX + this.radialOffset, newY = midY + this.radialOffset;
                let cornerGradient = this.ctx.createRadialGradient(newX, newY, Math.floor(this.chunkSize * .8), newX, newY, 0);
                _drawGradient(cornerGradient, .3)
            }
        }
    }

    protected _drawInvisibleChunk(chunk: CampaignMapChunk) {
        let ctxPos = this.mapPosToCtxPos(chunk.x, chunk.y);

        this.ctx.clearRect(ctxPos.x, ctxPos.y, this.chunkSize, this.chunkSize);
    }

    // Helper Functions

    mapPosToCtxPos(x: number, y: number) {
        return { x: (x + this.mapOffset.x) * this.chunkSize, y: (y + this.mapOffset.y) * this.chunkSize }
    }

    ctxPosToMapPos(x: number, y: number) {
        return { x: Math.floor(x / this.chunkSize), y: Math.floor(y / this.chunkSize) }
    }

    // Internal Helper Functions
    private _getNeighborVisiblity(neighbors: { [name: string]: CampaignMapChunk | null }): { [name: string]: boolean } {

        let visibility: { [name: string]: boolean } = {}

        Object.entries(neighbors).map(([direction, c]) => {
            if (c === null) {
                visibility[direction] = false;
            } else {
                visibility[direction] = c.playerVisible;
            }
        })

        return visibility
    }
}