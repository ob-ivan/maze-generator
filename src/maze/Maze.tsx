import { Cell } from '../types/Cell';
import React, { useState } from 'react';
import classNames from 'classnames';
import { Item, Level, Point } from '../types/Level';

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

function generateLevel(maxX: number, maxY: number): Level {
    const cells: Cell[][] = [];
    const visited: boolean[][] = [];
    const deadEnds: Point[] = [];

    for (let y = 0; y < maxY; ++y) {
        cells[y] = [];
        visited[y] = [];
        for (let x = 0; x < maxX; ++x) {
            cells[y][x] = new Cell();
            visited[y][x] = false;
        }
    }

    for (let i = maxX + maxY; i > 0; --i) {
        const cellsNotVisited: Point[] = [];
        const cellsNotVisitedWithVisitedNeighbour: { x: number; y: number; n: Neighbour }[] = [];
        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                if (!visited[y][x]) {
                    cellsNotVisited.push({ x, y });

                    const neighboursInBounds = getNeighboursInBounds(x, y, maxX, maxY);
                    const neighboursInBoundsFilteredMapped = neighboursInBounds
                        .filter(({ nx, ny }) => visited[ny][nx])
                        .map(n => ({
                            x,
                            y,
                            n,
                        }));
                    if (neighboursInBoundsFilteredMapped.length > 0) {
                        cellsNotVisitedWithVisitedNeighbour.push(...neighboursInBoundsFilteredMapped);
                    }
                }
            }
        }
        if (!cellsNotVisited.length) {
            break;
        }
        let cellNotVisited: Point;
        if (cellsNotVisitedWithVisitedNeighbour.length > 0) {
            const { x: sx, y: sy, n: neighbour } = getRandomItem(cellsNotVisitedWithVisitedNeighbour);
            removeWall(cells, sx, sy, neighbour);
            cellNotVisited = { x: sx, y: sy };
        } else {
            cellNotVisited = getRandomItem(cellsNotVisited);
        }
        let sx = cellNotVisited.x;
        let sy = cellNotVisited.y;
        while (true) {
            const neighbours = getNeighboursInBounds(sx, sy, maxX, maxY);
            const neighboursExcludeSnake = neighbours.filter(({ nx, ny }) => !visited[ny][nx]);

            visited[sy][sx] = true;

            if (!neighboursExcludeSnake.length) {
                deadEnds.push({ x: sx, y: sy });
                break;
            }
            const neighbour = getRandomItem(neighboursExcludeSnake);
            const visitedNeighbour = visited[neighbour.ny][neighbour.nx];

            visited[neighbour.ny][neighbour.nx] = true;
            removeWall(cells, sx, sy, neighbour);

            if (visitedNeighbour) {
                break;
            }

            sx = neighbour.nx;
            sy = neighbour.ny;
        }
    }

    const items: Item[] = [];

    for (let i = 2; i > 0; --i) {
        const itemPoint = getRandomItem(deadEnds);
        items.push({ ...itemPoint, face: getRandomItem(['🍰', '🍌', '🍗']) });
    }

    return { cells, maxX, maxY, items };
}

export const Maze: React.FC<MazeProps> = ({ maxX, maxY }) => {
    const [level] = useState<Level>(generateLevel(maxX, maxY));

    const { cells, items } = level;

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
                            })}
                        >
                            {!cell.canWalkUp() && <div className="maze--wall-up"></div>}
                            {!cell.canWalkRight() && <div className="maze--wall-right"></div>}
                            {!cell.canWalkDown() && <div className="maze--wall-down"></div>}
                            {!cell.canWalkLeft() && <div className="maze--wall-left"></div>}
                            {items.find(item => item.x === x && item.y === y)?.face}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
