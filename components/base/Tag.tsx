import React, { useState } from 'react';
import styles from './Tag.module.scss';

interface TagProps {
    tag: string;
    onClick?: (tag: string) => void;
    selected?: boolean;
    viewOnly?: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, onClick, selected, viewOnly }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        if (onClick) {
            onClick(tag);
        }
    };

    return (
        <div
            className={`${styles.tag} ${selected ? styles.selected : ''} ${isHovered ? styles.hovered : ''} ${viewOnly ? styles.viewOnly : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {viewOnly ? '#' : ''}{tag.replace(/"/g, '')}
        </div>
    );
};

export default Tag;