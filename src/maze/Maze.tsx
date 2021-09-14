import {Cell} from "./Cell";
import React from "react";
import classNames from "classnames";

type Direction = 'up' | 'right' | 'down' | 'left';

interface Point {
    x: number;
    y: number;
}

interface Neighbour {
    d: Direction,
    nx: number,
    ny: number,
}

class Table<V> {
    private item: V[][] = [];
    constructor(private maxX: number, private maxY: number, init: () => V) {
        for (let y = 0; y < this.maxY; ++y) {
            this.item[y] = [];
            for (let x = 0; x < this.maxX; ++x) {
                this.item[y][x] = init();
            }
        }
    }
    get({ x, y }: Point) {
        return this.item[y][x];
    }
    set({ x, y }: Point, v: V) {
        this.item[y][x] = v;
    }
    mapRow<R>(callback: (row: V[], y: number) => R): R[] {
        return this.item.map(callback);
    }
}

function removeWall(cells: Table<Cell>, x: number, y: number, neighbour: Neighbour) {
    let direction = neighbour.d;
    let cellCurrent = cells.get({ x, y });
    let cellNeighbour = cells.get({ x: neighbour.nx, y: neighbour.ny });
    switch (direction) {
        case "up":
            cellCurrent.removeWallUp();
            cellNeighbour.removeWallDown();
            break;
        case "right":
            cellCurrent.removeWallRight();
            cellNeighbour.removeWallLeft();
            break;
        case "down":
            cellCurrent.removeWallDown();
            cellNeighbour.removeWallUp();
            break;
        case "left":
            cellCurrent.removeWallLeft();
            cellNeighbour.removeWallRight();
            break;
    }
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

interface MazeProps {
    maxX: number;
    maxY: number;
}

interface MazeState {
    cells: Table<Cell>;
}

export class Maze extends React.Component<MazeProps, MazeState> {
    constructor(props: MazeProps) {
        super(props);
        let cells: Table<Cell> = new Table(this.props.maxX, this.props.maxY, () => new Cell());
        let snake: boolean[][] = [];
        let visited: boolean[][] = [];

        for (let y = 0; y < this.props.maxY; ++y) {
            snake[y] = [];
            visited[y] = [];
            for (let x = 0; x < this.props.maxX; ++x) {
                snake[y][x] = false;
                visited[y][x] = false;
            }
        }

        while (true) {
            let cellsNotVisited: Point[] = [];
            for (let y = 0; y < this.props.maxY; ++y) {
                for (let x = 0; x < this.props.maxX; ++x) {
                    if (!visited[y][x]) {
                        cellsNotVisited.push({ x, y });
                    }
                }
            }
            if (!cellsNotVisited.length) {
                break;
            }
            let cellNotVisited = getRandomItem(cellsNotVisited);
            let sx = cellNotVisited.x;
            let sy = cellNotVisited.y;
            while (true) {
                let neighbours = this.getNeighboursInBounds(sx, sy);
                let neighboursExcludeSnake = neighbours.filter((neighbour: Neighbour) => !snake[neighbour.ny][neighbour.nx]);
                if (!neighboursExcludeSnake.length) {
                    break;
                }
                let neighbour = getRandomItem(neighboursExcludeSnake);
                let visitedNeighbour = visited[neighbour.ny][neighbour.nx];

                visited[sy][sx] = true;
                visited[neighbour.ny][neighbour.nx] = true;
                snake[sy][sx] = true;
                snake[neighbour.ny][neighbour.nx] = true;
                removeWall(cells, sx, sy, neighbour);

                if (visitedNeighbour) {
                    break;
                }

                sx = neighbour.nx;
                sy = neighbour.ny;
            }
            for (let y = 0; y < this.props.maxY; ++y) {
                for (let x = 0; x < this.props.maxX; ++x) {
                    snake[y][x] = false;
                }
            }
        }

        this.state = {
            cells
        };
    }

    private getNeighboursInBounds(x: number, y: number) {
        let moves: { d: Direction, dx: number, dy: number }[] = [
            { d: 'up', dx: 0, dy: -1 },
            { d: 'right', dx: 1, dy: 0 },
            { d: 'down', dx: 0, dy: 1 },
            { d: 'left', dx: -1, dy: 0 },
        ];
        let neighbours: Neighbour[] = [];
        moves.forEach(({ d, dx, dy }) => {
            let nx = x + dx;
            let ny = y + dy;
            if (
                (0 <= nx) && (nx < this.props.maxX) &&
                (0 <= ny) && (ny < this.props.maxY)
            ) {
                neighbours.push({ d, ny, nx });
            }
        });
        return neighbours;
    }

    render() {
        return <div className='maze--table'>
            {this.state.cells.mapRow((cellRow: Cell[], y: number) =>
                <div key={y} className='maze--row'>
                    {cellRow.map((cell: Cell, x: number) =>
                        <div key={`${x}-${y}`} className={classNames({
                            'maze--cell': true,
                            'maze--cell__block': !cell.canWalkUp() && !cell.canWalkRight() && !cell.canWalkDown() && !cell.canWalkLeft(),
                            'maze--cell__wall-up': !cell.canWalkUp(),
                            'maze--cell__wall-right': !cell.canWalkRight(),
                            'maze--cell__wall-down': !cell.canWalkDown(),
                            'maze--cell__wall-left': !cell.canWalkLeft(),
                        })}>
                        </div>
                    )}
                </div>
            )}
        </div>;
    }
}
