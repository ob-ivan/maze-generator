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

export class Maze extends React.Component<MazeProps, MazeState> {
    constructor(props: MazeProps) {
        super(props);
        let cells: Cell[][] = [];

        for (let y = 0; y < this.props.maxY; ++y) {
            cells[y] = [];
            for (let x = 0; x < this.props.maxX; ++x) {
                cells[y][x] = new Cell();
            }
        }

        for (let i = 0, maxI = this.props.maxX * this.props.maxY; i < maxI; ++i) {
            let x = Math.floor(Math.random() * this.props.maxX);
            let y = Math.floor(Math.random() * this.props.maxY);
            let directions: { d: Direction, dx: number, dy: number }[] = [
                {d: 'up', dx: -1, dy: 0},
                {d: 'right', dx: 0, dy: 1},
                {d: 'down', dx: 1, dy: 0},
                {d: 'left', dx: 0, dy: -1},
            ];
            let neighbours: { d: Direction, c: Cell }[] = [];
            directions.forEach(({ d, dx, dy }) => {
                let nx = x + dx;
                let ny = y + dy;
                if (
                    (0 <= nx) && (nx < this.props.maxX) &&
                    (0 <= ny) && (ny < this.props.maxY)
                ) {
                    neighbours.push({ d, c: cells[ny][nx]});
                }
            });
            let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            let cell = cells[y][x];
            switch (neighbour.d) {
                case "up": cell.removeWallUp(); neighbour.c.removeWallDown(); break;
                case "right": cell.removeWallRight(); neighbour.c.removeWallLeft(); break;
                case "down": cell.removeWallDown(); neighbour.c.removeWallUp(); break;
                case "left": cell.removeWallLeft(); neighbour.c.removeWallRight(); break;
            }
        }

        this.state = {
            cells
        };
    }

    render() {
        return <div className='maze--table'>
            {this.state.cells.map((cellRow: Cell[]) =>
                <div className='maze--row'>
                    {cellRow.map((cell: Cell) =>
                        <td className={classNames({
                            'maze--cell': true,
                            'maze--cell__wall-up': !cell.canWalkUp(),
                            'maze--cell__wall-right': !cell.canWalkRight(),
                            'maze--cell__wall-down': !cell.canWalkDown(),
                            'maze--cell__wall-left': !cell.canWalkLeft(),
                        })}>
                        </td>)
                    }
                </div>)
            }
        </div>;
    }
}
