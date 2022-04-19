import classNames from 'classnames';
import React from 'react';
import { Cell } from '../types/Cell';
import { Level, Point } from '../types/Level';

const heroFace = '🧚';

interface MazeProps {
    level: Level;
    hero: Point;
}

export const Maze: React.FC<MazeProps> = ({ level, hero }) => {
    const { cells, itemPoints } = level;

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
                            {itemPoints.find(item => item.x === x && item.y === y)?.face}
                            {hero.x === x && hero.y === y && <div className="maze--hero">{heroFace}</div>}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
