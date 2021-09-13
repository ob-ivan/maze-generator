import {Cell} from "./Cell";
import React from "react";
import classNames from "classnames";

interface MazeProps {
    maxX: number;
    maxY: number;
}

interface MazeState {
    cells: Cell[][];
}

type Direction = 'up' | 'right' | 'down' | 'left';

interface Neighbour {
    d: Direction,
    nx: number,
    ny: number,
}

function removeWall(cells: Cell[][], x: number, y: number, neighbour: Neighbour) {
    let direction = neighbour.d;
    let cellCurrent = cells[y][x];
    let cellNeighbour = cells[neighbour.ny][neighbour.nx];
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

export class Maze extends React.Component<MazeProps, MazeState> {
    constructor(props: MazeProps) {
        super(props);
        let cells: Cell[][] = [];
        let snake: boolean[][] = [];
        let visited: boolean[][] = [];

        for (let y = 0; y < this.props.maxY; ++y) {
            cells[y] = [];
            snake[y] = [];
            visited[y] = [];
            for (let x = 0; x < this.props.maxX; ++x) {
                cells[y][x] = new Cell();
                snake[y][x] = false;
                visited[y][x] = false;
            }
        }

        for (let i = 0, maxI = 3 * (this.props.maxX + this.props.maxY); i < maxI; ++i) {
            let sx = Math.floor(Math.random() * this.props.maxX);
            let sy = Math.floor(Math.random() * this.props.maxY);
            while (true) {
                let neighbours = this.getNeighboursInBounds(sx, sy);
                let neighboursExcludeSnake = neighbours.filter((neighbour: Neighbour) => !snake[neighbour.ny][neighbour.nx]);
                if (!neighboursExcludeSnake.length) {
                    break;
                }
                let neighbour = getRandomItem(neighboursExcludeSnake);
                snake[neighbour.ny][neighbour.nx] = true;
                visited[neighbour.ny][neighbour.nx] = true;
                removeWall(cells, sx, sy, neighbour);
                sx = neighbour.nx;
                sy = neighbour.ny;
            }
        }

        this.state = {
            cells
        };
    }

    private getRandomNeighbour(x: number, y: number): Neighbour {
        let neighbours = this.getNeighboursInBounds(x, y);
        return getRandomItem(neighbours);
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
            {this.state.cells.map((cellRow: Cell[], y: number) =>
                <div key={y} className='maze--row'>
                    {cellRow.map((cell: Cell, x: number) =>
                        <div key={`${x}-${y}`} className={classNames({
                            'maze--cell': true,
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
