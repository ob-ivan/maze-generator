import { Cell } from './Cell';
import React from 'react';
import classNames from 'classnames';

interface MazeProps {
    maxX: number;
    maxY: number;
}

type Direction = 'up' | 'right' | 'down' | 'left';

interface Neighbour {
    d: Direction;
    nx: number;
    ny: number;
}

function removeWall(cells: Cell[][], x: number, y: number, neighbour: Neighbour) {
    const direction = neighbour.d;
    const cellCurrent = cells[y][x];
    const cellNeighbour = cells[neighbour.ny][neighbour.nx];
    switch (direction) {
        case 'up':
            cellCurrent.removeWallUp();
            cellNeighbour.removeWallDown();
            break;
        case 'right':
            cellCurrent.removeWallRight();
            cellNeighbour.removeWallLeft();
            break;
        case 'down':
            cellCurrent.removeWallDown();
            cellNeighbour.removeWallUp();
            break;
        case 'left':
            cellCurrent.removeWallLeft();
            cellNeighbour.removeWallRight();
            break;
    }
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getNeighboursInBounds(x: number, y: number, maxX: number, maxY: number) {
    const moves: { d: Direction; dx: number; dy: number }[] = [
        { d: 'up', dx: 0, dy: -1 },
        { d: 'right', dx: 1, dy: 0 },
        { d: 'down', dx: 0, dy: 1 },
        { d: 'left', dx: -1, dy: 0 },
    ];
    const neighbours: Neighbour[] = [];
    moves.forEach(({ d, dx, dy }) => {
        const nx = x + dx;
        const ny = y + dy;
        if (0 <= nx && nx < maxX && 0 <= ny && ny < maxY) {
            neighbours.push({ d, ny, nx });
        }
    });
    return neighbours;
}

function generateCells(maxX: number, maxY: number): Cell[][] {
    const cells: Cell[][] = [];
    const snake: boolean[][] = [];
    const visited: boolean[][] = [];

    for (let y = 0; y < maxY; ++y) {
        cells[y] = [];
        snake[y] = [];
        visited[y] = [];
        for (let x = 0; x < maxX; ++x) {
            cells[y][x] = new Cell();
            snake[y][x] = false;
            visited[y][x] = false;
        }
    }

    while (true) {
        const cellsNotVisited: { x: number; y: number }[] = [];
        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                if (!visited[y][x]) {
                    cellsNotVisited.push({ x, y });
                }
            }
        }
        if (!cellsNotVisited.length) {
            break;
        }
        const cellNotVisited = getRandomItem(cellsNotVisited);
        let sx = cellNotVisited.x;
        let sy = cellNotVisited.y;
        while (true) {
            const neighbours = getNeighboursInBounds(sx, sy, maxX, maxY);
            const neighboursExcludeSnake = neighbours.filter(
                (neighbour: Neighbour) => !snake[neighbour.ny][neighbour.nx]
            );
            if (!neighboursExcludeSnake.length) {
                break;
            }
            const neighbour = getRandomItem(neighboursExcludeSnake);
            const visitedNeighbour = visited[neighbour.ny][neighbour.nx];

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
        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                snake[y][x] = false;
            }
        }
    }

    return cells;
}

export const Maze: React.FC<MazeProps> = ({ maxX, maxY }) => {
    const cells = generateCells(maxX, maxY);

    return (
        <div className="maze--table">
            {cells.map((cellRow: Cell[], y: number) => (
                <div key={y} className="maze--row">
                    {cellRow.map((cell: Cell, x: number) => (
                        <div
                            key={`${x}-${y}`}
                            className={classNames({
                                'maze--cell': true,
                                'maze--cell__block':
                                    !cell.canWalkUp() &&
                                    !cell.canWalkRight() &&
                                    !cell.canWalkDown() &&
                                    !cell.canWalkLeft(),
                                'maze--cell__wall-up': !cell.canWalkUp(),
                                'maze--cell__wall-right': !cell.canWalkRight(),
                                'maze--cell__wall-down': !cell.canWalkDown(),
                                'maze--cell__wall-left': !cell.canWalkLeft(),
                            })}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};
