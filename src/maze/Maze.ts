import {Cell} from "./Cell";

export class Maze {
    private cells: Cell[][] = [];

    constructor(private maxX: number, private maxY: number) {
        for (let x = 0; x < this.maxX; ++x) {
            this.cells[x] = [];
            for (let y = 0; y < this.maxY; ++y) {
                this.cells[x][y] = new Cell();
            }
        }
    }
}
