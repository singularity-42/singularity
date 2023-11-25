import React, { useEffect, useRef } from 'react';
import styles from './Tags.module.scss';
import Tag from '../function/Tag';

interface TagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selected?: string[];
}

const Tags: React.FC<TagsProps> = ({ tags, onTagClick, selected }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const tagBubbleWidth = 80; // Adjust the tag bubble width
    const tagBubbleHeight = 80; // Adjust the tag bubble height

    const updateTagBubblePositions = () => {
      tags.forEach((tag, index) => {
        const tagBubble = container.children[index] as HTMLDivElement;
        const currentX = parseFloat(tagBubble?.style.left || '0');
        const currentY = parseFloat(tagBubble?.style.top || '0');
        const xOffset = getRandomOffset();
        const yOffset = getRandomOffset();
        let newX = currentX + xOffset;
        let newY = currentY + yOffset;

        // Ensure tag bubble stays within the container box
        if (newX < 0) newX = 0;
        if (newX + tagBubbleWidth > containerWidth) newX = containerWidth - tagBubbleWidth;
        if (newY < 0) newY = 0;
        if (newY + tagBubbleHeight > containerHeight) newY = containerHeight - tagBubbleHeight;

        if (!tagBubble) return;

        tagBubble.style.left = `${newX}px`;
        tagBubble.style.top = `${newY}px`;
      });
    };

    const intervalId = setInterval(updateTagBubblePositions, 1000 / 60); // Adjust the interval duration as needed

    return () => {
      clearInterval(intervalId);
    };
  }, [tags]);

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const getRandomOffset = () => {
    const minOffset = 50; // Adjust the minimum offset value
    const maxOffset = 40; // Adjust the maximum offset value
    return Math.floor(Math.random() * (maxOffset - minOffset + 1) + minOffset);
  };

  if (!tags || tags.length === 0) {
    return null;
  }


  return (
    <div className={styles.tags} ref={containerRef}>
      {tags.map((tag, index) => (
        <Tag
          key={index}
          tag={tag}
          onClick={handleTagClick}
          selected={selected && selected.includes(tag)}
        />
      ))}
    </div>
  );
};

export default Tags;
