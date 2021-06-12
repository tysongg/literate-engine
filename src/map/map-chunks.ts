export class CampaignMapChunk {
    x: number
    y: number

    playerVisible: boolean;
    private _chunkImage: string;

    constructor(x: number, y: number, _chunkImage: string, playerVisible: boolean) {
        this.x = x;
        this.y = y;
        this._chunkImage = _chunkImage;
        this.playerVisible = playerVisible;
    }

    get chunkImage(): string {
        return this._chunkImage
    }
}

export class CampaignMap {

    protected mapChunks: Array<Array<CampaignMapChunk>>;
    private _mapImage: string;

    width: number;
    height: number;

    constructor(_mapImage: string, mapChunks: Array<Array<CampaignMapChunk>>, width: number, height: number) {
        this.mapChunks = mapChunks;
        this._mapImage = _mapImage;

        this.width = width;
        this.height = height;
    }

    get mapImage(): string {
        return this._mapImage
    }

    getChunk(x: number, y: number): CampaignMapChunk | null {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null
        }

        return this.mapChunks[x][y]
    }

    getNeighbors(chunk: CampaignMapChunk): { [name: string]: CampaignMapChunk | null } {
        let x = chunk.x, y = chunk.y;
        return {
            top: this.getChunk(x, y - 1),
            right: this.getChunk(x + 1, y),
            bottom: this.getChunk(x, y + 1),
            left: this.getChunk(x - 1, y),

            topRight: this.getChunk(x + 1, y - 1),
            bottomRight: this.getChunk(x + 1, y + 1),
            bottomLeft: this.getChunk(x - 1, y + 1),
            topLeft: this.getChunk(x - 1, y - 1)
        }
    }

    hasVisibleNeighbors(chunk: CampaignMapChunk): boolean {
        return Object.entries(this.getNeighbors(chunk)).map(([_, c]) => {
            if (c === null) {
                return false;
            }
            return c.playerVisible
        })
            .some((visible) => {
                return visible
            });
    }
}

export function getSampleMap() {
    return new CampaignMap(
        'img/map',
        [
            [
                new CampaignMapChunk(0, 0, 'img/row-1-col-1.png', true),
                new CampaignMapChunk(0, 1, 'img/row-2-col-1.png', true),
                new CampaignMapChunk(0, 2, 'img/row-3-col-1.png', true),
                new CampaignMapChunk(0, 3, 'img/row-4-col-1.png', true),
                new CampaignMapChunk(0, 4, 'img/row-5-col-1.png', true),
                new CampaignMapChunk(0, 5, 'img/row-6-col-1.png', true),
                new CampaignMapChunk(0, 6, 'img/row-7-col-1.png', true),
                new CampaignMapChunk(0, 7, 'img/row-8-col-1.png', true),
                new CampaignMapChunk(0, 8, 'img/row-9-col-1.png', true),
                new CampaignMapChunk(0, 9, 'img/row-10-col-1.png', true),
            ],
            [
                new CampaignMapChunk(1, 0, 'img/row-1-col-2.png', true),
                new CampaignMapChunk(1, 1, 'img/row-2-col-2.png', true),
                new CampaignMapChunk(1, 2, 'img/row-3-col-2.png', true),
                new CampaignMapChunk(1, 3, 'img/row-4-col-2.png', true),
                new CampaignMapChunk(1, 4, 'img/row-5-col-2.png', true),
                new CampaignMapChunk(1, 5, 'img/row-6-col-2.png', true),
                new CampaignMapChunk(1, 6, 'img/row-7-col-2.png', true),
                new CampaignMapChunk(1, 7, 'img/row-8-col-2.png', true),
                new CampaignMapChunk(1, 8, 'img/row-9-col-2.png', true),
                new CampaignMapChunk(1, 9, 'img/row-10-col-2.png', true),
            ],
            [
                new CampaignMapChunk(2, 0, 'img/row-1-col-3.png', true),
                new CampaignMapChunk(2, 1, 'img/row-2-col-3.png', true),
                new CampaignMapChunk(2, 2, 'img/row-3-col-3.png', true),
                new CampaignMapChunk(2, 3, 'img/row-4-col-3.png', true),
                new CampaignMapChunk(2, 4, 'img/row-5-col-3.png', true),
                new CampaignMapChunk(2, 5, 'img/row-6-col-3.png', true),
                new CampaignMapChunk(2, 6, 'img/row-7-col-3.png', true),
                new CampaignMapChunk(2, 7, 'img/row-8-col-3.png', true),
                new CampaignMapChunk(2, 8, 'img/row-9-col-3.png', true),
                new CampaignMapChunk(2, 9, 'img/row-10-col-3.png', true),
            ],
            [
                new CampaignMapChunk(3, 0, 'img/row-1-col-4.png', true),
                new CampaignMapChunk(3, 1, 'img/row-2-col-4.png', true),
                new CampaignMapChunk(3, 2, 'img/row-3-col-4.png', true),
                new CampaignMapChunk(3, 3, 'img/row-4-col-4.png', true),
                new CampaignMapChunk(3, 4, 'img/row-5-col-4.png', true),
                new CampaignMapChunk(3, 5, 'img/row-6-col-4.png', true),
                new CampaignMapChunk(3, 6, 'img/row-7-col-4.png', true),
                new CampaignMapChunk(3, 7, 'img/row-8-col-4.png', true),
                new CampaignMapChunk(3, 8, 'img/row-9-col-4.png', true),
                new CampaignMapChunk(3, 9, 'img/row-10-col-4.png', true),
            ],
            [
                new CampaignMapChunk(4, 0, 'img/row-1-col-5.png', true),
                new CampaignMapChunk(4, 1, 'img/row-2-col-5.png', true),
                new CampaignMapChunk(4, 2, 'img/row-3-col-5.png', true),
                new CampaignMapChunk(4, 3, 'img/row-4-col-5.png', true),
                new CampaignMapChunk(4, 4, 'img/row-5-col-5.png', true),
                new CampaignMapChunk(4, 5, 'img/row-6-col-5.png', true),
                new CampaignMapChunk(4, 6, 'img/row-7-col-5.png', true),
                new CampaignMapChunk(4, 7, 'img/row-8-col-5.png', true),
                new CampaignMapChunk(4, 8, 'img/row-9-col-5.png', true),
                new CampaignMapChunk(4, 9, 'img/row-10-col-5.png', true),
            ],
            [
                new CampaignMapChunk(5, 0, 'img/row-1-col-6.png', true),
                new CampaignMapChunk(5, 1, 'img/row-2-col-6.png', true),
                new CampaignMapChunk(5, 2, 'img/row-3-col-6.png', true),
                new CampaignMapChunk(5, 3, 'img/row-4-col-6.png', true),
                new CampaignMapChunk(5, 4, 'img/row-5-col-6.png', true),
                new CampaignMapChunk(5, 5, 'img/row-6-col-6.png', true),
                new CampaignMapChunk(5, 6, 'img/row-7-col-6.png', true),
                new CampaignMapChunk(5, 7, 'img/row-8-col-6.png', true),
                new CampaignMapChunk(5, 8, 'img/row-9-col-6.png', true),
                new CampaignMapChunk(5, 9, 'img/row-10-col-6.png', true),
            ],
            [
                new CampaignMapChunk(6, 0, 'img/row-1-col-7.png', true),
                new CampaignMapChunk(6, 1, 'img/row-2-col-7.png', true),
                new CampaignMapChunk(6, 2, 'img/row-3-col-7.png', true),
                new CampaignMapChunk(6, 3, 'img/row-4-col-7.png', true),
                new CampaignMapChunk(6, 4, 'img/row-5-col-7.png', true),
                new CampaignMapChunk(6, 5, 'img/row-6-col-7.png', true),
                new CampaignMapChunk(6, 6, 'img/row-7-col-7.png', true),
                new CampaignMapChunk(6, 7, 'img/row-8-col-7.png', true),
                new CampaignMapChunk(6, 8, 'img/row-9-col-7.png', true),
                new CampaignMapChunk(6, 9, 'img/row-10-col-7.png', true),
            ],
            [
                new CampaignMapChunk(7, 0, 'img/row-1-col-8.png', true),
                new CampaignMapChunk(7, 1, 'img/row-2-col-8.png', true),
                new CampaignMapChunk(7, 2, 'img/row-3-col-8.png', true),
                new CampaignMapChunk(7, 3, 'img/row-4-col-8.png', true),
                new CampaignMapChunk(7, 4, 'img/row-5-col-8.png', true),
                new CampaignMapChunk(7, 5, 'img/row-6-col-8.png', true),
                new CampaignMapChunk(7, 6, 'img/row-7-col-8.png', true),
                new CampaignMapChunk(7, 7, 'img/row-8-col-8.png', true),
                new CampaignMapChunk(7, 8, 'img/row-9-col-8.png', true),
                new CampaignMapChunk(7, 9, 'img/row-10-col-8.png', true),
            ],
            [
                new CampaignMapChunk(8, 0, 'img/row-1-col-9.png', true),
                new CampaignMapChunk(8, 1, 'img/row-2-col-9.png', true),
                new CampaignMapChunk(8, 2, 'img/row-3-col-9.png', true),
                new CampaignMapChunk(8, 3, 'img/row-4-col-9.png', true),
                new CampaignMapChunk(8, 4, 'img/row-5-col-9.png', true),
                new CampaignMapChunk(8, 5, 'img/row-6-col-9.png', true),
                new CampaignMapChunk(8, 6, 'img/row-7-col-9.png', true),
                new CampaignMapChunk(8, 7, 'img/row-8-col-9.png', true),
                new CampaignMapChunk(8, 8, 'img/row-9-col-9.png', true),
                new CampaignMapChunk(8, 9, 'img/row-10-col-9.png', true),
            ],
            [
                new CampaignMapChunk(9, 0, 'img/row-1-col-10.png', true),
                new CampaignMapChunk(9, 1, 'img/row-2-col-10.png', true),
                new CampaignMapChunk(9, 2, 'img/row-3-col-10.png', true),
                new CampaignMapChunk(9, 3, 'img/row-4-col-10.png', true),
                new CampaignMapChunk(9, 4, 'img/row-5-col-10.png', true),
                new CampaignMapChunk(9, 5, 'img/row-6-col-10.png', true),
                new CampaignMapChunk(9, 6, 'img/row-7-col-10.png', true),
                new CampaignMapChunk(9, 7, 'img/row-8-col-10.png', true),
                new CampaignMapChunk(9, 8, 'img/row-9-col-10.png', true),
                new CampaignMapChunk(9, 9, 'img/row-10-col-10.png', true),
            ],
        ],
        10,
        10
    )
}
