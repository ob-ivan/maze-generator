import React, { useState } from 'react';
import useKeypress from '../hooks/useKeypress';
import { generateLevel } from '../maze/generateLevel';
import { Item, Level, Point } from '../types/Level';
import { Inventory } from './Inventory';
import { Maze } from './Maze';

interface GameProps {
    maxX: number;
    maxY: number;
}

export const Game: React.FC<GameProps> = ({ maxX, maxY }) => {
    const [level, setLevel] = useState<Level>(generateLevel(maxX, maxY));
    const { cells, itemPoints } = level;

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

    const [inventory, setInventory] = useState<Item[]>([]);
    useKeypress(' ', () => {
        const itemPoint = itemPoints.find(itemPoint => itemPoint.x === hero.x && itemPoint.y === hero.y);

        // eslint-disable-next-line no-console
        console.log('Game.tsx', 47, 'itemPoint', itemPoint);

        if (itemPoint) {
            setInventory([...inventory, { face: itemPoint.face }]);
            setLevel({ ...level, itemPoints: itemPoints.filter(keep => keep !== itemPoint) });
        }
    });

    return (
        <div className="game">
            <Maze level={level} hero={hero} />
            <Inventory items={inventory} />
        </div>
    );
};
