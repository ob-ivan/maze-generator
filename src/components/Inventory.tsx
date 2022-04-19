import { FC } from 'react';
import { Item } from '../types/Level';

export interface InventoryProps {
    items: Item[];
}

export const Inventory: FC<InventoryProps> = ({ items }) => {
    return (
        <div className="inventory">
            {items.map((item, index) => (
                <span key={`item-${index}`}>{item.face}</span>
            ))}
        </div>
    );
};
