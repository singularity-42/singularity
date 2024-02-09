import React, { useEffect, useRef, useState } from 'react';
import styles from './Tags.module.scss';
import Tag from '../base/Tag';

interface TagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selected?: string[];
  viewOnly?: boolean;
}

const Tags: React.FC<TagsProps> = ({ tags, onTagClick, selected, viewOnly }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tagAnimationClass, setTagAnimationClass] = useState('');

  useEffect(() => {
    if (tags.length) {
      setTagAnimationClass('fade-enter');
      setTimeout(() => setTagAnimationClass('fade-enter-active'),  420);
    }
  }, []);

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (!tags || tags.length ===  0) {
    return null;
  }

  return (
    <div ref={containerRef} className={`${styles.tags} ${tagAnimationClass}`}>
      {tags.map((tag, index) => (
        <Tag
          key={tag}
          tag={tag}
          onClick={!viewOnly ? handleTagClick : undefined}
          selected={selected && selected.includes(tag)}
        />
      ))}
    </div>
  );
};

export default Tags;
