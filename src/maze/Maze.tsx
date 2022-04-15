import { Cell } from './Cell';
import React, { useState } from 'react';
import classNames from 'classnames';

interface Point {
    x: number;
    y: number;
}

interface Item extends Point {
    face: string;
}

interface Level {
    cells: Cell[][];
    maxX: number;
    maxY: number;
    items: Item[];
}

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
            const neighboursExcludeSnake = neighbours.filter(({ nx, ny }) => !snake[ny][nx] && !visited[ny][nx]);
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

    const visitedPoints = visited.flatMap((row, y) => row.flatMap((visited, x) => (visited ? [{ x, y }] : [])));
    const items: Item[] = [];

    for (let i = 2; i > 0; --i) {
        const itemPoint = getRandomItem(visitedPoints);
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
                                'maze--cell__wall-up': !cell.canWalkUp(),
                                'maze--cell__wall-right': !cell.canWalkRight(),
                                'maze--cell__wall-down': !cell.canWalkDown(),
                                'maze--cell__wall-left': !cell.canWalkLeft(),
                            })}
                        >
                            {items.find(item => item.x === x && item.y === y)?.face}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
