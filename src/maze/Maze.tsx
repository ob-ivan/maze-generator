import {Cell} from "./Cell";
import React from "react";

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

        for (let x = 0; x < this.props.maxX; ++x) {
            cells[x] = [];
            for (let y = 0; y < this.props.maxY; ++y) {
                cells[x][y] = new Cell();
            }
        }

        this.state = {
            cells
        };
    }

    render() {
        return <table>
            {this.state.cells.map((cellRow: Cell[]) =>
                <tr>
                    {cellRow.map((cell: Cell) =>
                        <td>
                            {cell.canWalkUp()}
                        </td>)
                    }
                </tr>)
            }
        </table>;
    }
}
