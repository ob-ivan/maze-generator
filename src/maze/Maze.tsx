import classNames from 'classnames';
import React, { useState } from 'react';
import useKeypress from '../hooks/useKeypress';
import { Cell } from '../types/Cell';
import { Level, Point } from '../types/Level';
import { generateLevel } from './generateLevel';

const heroFace = '🧚';

interface MazeProps {
    maxX: number;
    maxY: number;
}

export const Maze: React.FC<MazeProps> = ({ maxX, maxY }) => {
    const [level] = useState<Level>(generateLevel(maxX, maxY));
    const { cells, items } = level;

    const [hero, setHero] = useState<Point>({
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
    });
    useKeypress('ArrowUp', () => {
        if (cells[hero.y][hero.x].canWalkUp()) {
            setHero({ x: hero.x, y: Math.max(hero.y - 1, 0) });
        }
    });
    useKeypress('ArrowRight', () => {
        if (cells[hero.y][hero.x].canWalkRight()) {
            setHero({ x: Math.min(hero.x + 1, maxX - 1), y: hero.y });
        }
    });
    useKeypress('ArrowDown', () => {
        if (cells[hero.y][hero.x].canWalkDown()) {
            setHero({ x: hero.x, y: Math.min(hero.y + 1, maxY - 1) });
        }
    });
    useKeypress('ArrowLeft', () => {
        if (cells[hero.y][hero.x].canWalkLeft()) {
            setHero({ x: Math.max(hero.x - 1, 0), y: hero.y });
        }
    });

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
                            {hero.x === x && hero.y === y && heroFace}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
