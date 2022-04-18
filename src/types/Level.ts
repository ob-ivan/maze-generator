import { Cell } from './Cell';

export interface Point {
    x: number;
    y: number;
}

export interface Item extends Point {
    face: string;
}

export interface Level {
    cells: Cell[][];
    maxX: number;
    maxY: number;
    items: Item[];
}
