import { Cell } from './Cell';

export interface Point {
    x: number;
    y: number;
}

export interface Item {
    face: string;
}

export interface ItemPoint extends Item, Point {}

export interface Level {
    cells: Cell[][];
    maxX: number;
    maxY: number;
    itemPoints: ItemPoint[];
}
