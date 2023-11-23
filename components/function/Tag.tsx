{/* <div
key={index}
className={styles.tagBubble}
onClick={() => handleTagClick(tag)}
>
{tag}
</div> */}


import React, { useEffect, useState } from 'react';
import styles from './Tag.module.scss';

interface TagProps {
    tag: string;
    onClick?: (tag: string) => void;
    selected?: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, onClick, selected }) => {
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
            className={`${styles.tag} ${selected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {tag}
        </div>
    );
};

export default Tag;