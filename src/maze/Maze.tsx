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
