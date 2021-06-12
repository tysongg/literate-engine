import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MapRenderer, getSampleMap } from '../map';

@customElement('my-canvas')
export class MyCanvas extends LitElement {
    static styles = css`
        :host {
            display: block;
            border: solid 1px gray;
            padding: 16px;
            max-width: 800px;
        }

        canvas {
            border: 1px solid red;
        }

        dev.mapContainer {
            position: relative;
        }

        canvas#canvas {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            background-color: gray;
        }

        canvas#overlay {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
        }
    `

    @property({ type: Number })
    count = 0;

    @property({ type: Number })
    width = 300;

    @property({ type: Number })
    height = 300;

    @property({ type: Number })
    gridSize = 50;

    @property({ type: Number })
    boxSize = 10;

    canvas: HTMLCanvasElement;
    overlay: HTMLCanvasElement;

    mapRenderer: MapRenderer;

    campaignMap = getSampleMap();
    lastClick: number = 0;
    doubleClickTimer = 250;
    pendingClick: any = null;

    constructor() {
        super();
        this.canvas = document.createElement('canvas');
        this.overlay = document.createElement('canvas');

        let ctx = this.canvas.getContext('2d');
        this.mapRenderer = new MapRenderer(ctx as CanvasRenderingContext2D, this.campaignMap);

        this.canvas.id = 'canvas';
        this.overlay.id = 'overlay';
    }

    connectedCallback() {
        super.connectedCallback();

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.overlay.width = this.width;
        this.overlay.height = this.height;

        this.drawGrid();
        this.mapRenderer.drawMap()
    }

    render() {
        console.log('Render Called')
        return html`
            <div class="mapContainer"
                @click=${this._onMapClick}
            >
                ${this.overlay}
                ${this.canvas}
            </div>
        `
    }

    private mapSpaceToGridSpace(x: number, y: number) {
        return { x: Math.floor(x / this.gridSize), y: Math.floor(y / this.gridSize) }
    }

    private drawGrid() {
        let ctx = this.overlay.getContext('2d');
        // Draw Grid
        if (ctx !== null) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
        }
        ctx?.beginPath()
        for (let x = this.gridSize; x < this.canvas.width; x += this.gridSize) {
            ctx?.moveTo(x, 0)
            ctx?.lineTo(x, this.canvas.height)
        }

        for (let y = this.gridSize; y < this.canvas.height; y += this.gridSize) {
            ctx?.moveTo(0, y);
            ctx?.lineTo(this.canvas.width, y);
        }
        ctx?.stroke();

        if (ctx != null) {
            ctx.globalCompositeOperation = 'destination-over';
        }
    }

    // Input Handling
    private _onMapClick(event: MouseEvent) {
        if (event.altKey === true) {
            this.toggleChunk(event);
        } else {
            let now = Date.now();
            console.log(`Last Click: ${this.lastClick} Now: ${now}`)
            if (this.lastClick + this.doubleClickTimer > now) {
                // Handle Doubleclick
                if (this.pendingClick !== null) {
                    clearTimeout(this.pendingClick);
                }
                this.moveMapTo(event);
            } else {
                this.lastClick = now;
                this.pendingClick = setTimeout(() => {
                    this.dummyClickEvent();
                    this.pendingClick = null;
                }, this.doubleClickTimer);
            }
        }
    }

    private dummyClickEvent() {
        console.log('Dummy Click Event!');
    }

    private moveMapTo(event: MouseEvent) {
        console.log(event);
        event.preventDefault();

        let mapPos = this.mapRenderer.ctxPosToMapPos(event.offsetX, event.offsetY);
        console.log(`Moving Map To: ${mapPos.x}, ${mapPos.y}`);
        this.mapRenderer.drawMap(mapPos);
    }

    private toggleChunk(event: MouseEvent) {
        console.log(event);
        event.preventDefault()

        // Toggle Visibility
        let mapPos = this.mapSpaceToGridSpace(event.offsetX, event.offsetY);

        console.log(`Toggle ${mapPos.x}, ${mapPos.y} at ${event.offsetX}, ${event.offsetY}`);

        let chunk = this.campaignMap.getChunk(mapPos.x, mapPos.y);

        if (chunk === null) {
            return
        }

        if (chunk.playerVisible === true) {
            chunk.playerVisible = false;
        } else {
            chunk.playerVisible = true;
        }
        this.mapRenderer.drawMapChunk(chunk);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'my-canvas': MyCanvas;
    }
}