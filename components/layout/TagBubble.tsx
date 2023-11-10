import React, { useEffect, useRef } from 'react';
import styles from '@/styles/TagBubble.module.scss';

interface TagBubbleListProps {
  tags: string[];
}

const TagBubbleList: React.FC<TagBubbleListProps> = ({ tags }) => {
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
        const currentX = parseFloat(tagBubble.style.left || '0');
        const currentY = parseFloat(tagBubble.style.top || '0');
        const xOffset = getRandomOffset();
        const yOffset = getRandomOffset();
        let newX = currentX + xOffset;
        let newY = currentY + yOffset;

        // Ensure tag bubble stays within the container box
        if (newX < 0) newX = 0;
        if (newX + tagBubbleWidth > containerWidth) newX = containerWidth - tagBubbleWidth;
        if (newY < 0) newY = 0;
        if (newY + tagBubbleHeight > containerHeight) newY = containerHeight - tagBubbleHeight;

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
    // Handle tag click event
    console.log(`Clicked tag: ${tag}`);
  };

  const getRandomOffset = () => {
    const minOffset = 50; // Adjust the minimum offset value
    const maxOffset = 40; // Adjust the maximum offset value
    return Math.floor(Math.random() * (maxOffset - minOffset + 1) + minOffset);
  };

  return (
    <div className={styles.tagBubbleList} ref={containerRef}>
      {tags.map((tag, index) => (
        <div
          key={index}
          className={styles.tagBubble}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagBubbleList;
