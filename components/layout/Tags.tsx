import React, { useEffect, useRef, useState } from 'react';
import styles from './Tags.module.scss';
import Tag from '../base/Tag';
import { MdAdd } from 'react-icons/md';

interface TagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selected?: string[];
  editing?: boolean;
  onChange?: (tags: string[]) => void;
}

const Tags: React.FC<TagsProps> = ({ tags, onTagClick, selected, editing, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleTagClick = (tag: string) => {
    if (editing) {
      // If editing, remove the tag and notify the changes
      const updatedTags = tags.filter((t) => t !== tag);
      if (onChange) {
        onChange(updatedTags);
      }
    } else if (onTagClick) {
      // If not in editing mode, handle click as usual
      onTagClick(tag);
    }
  };

  const handleAddTagClick = () => {
    setAddingTag(true);
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagName(event.target.value);
  };

  const handleTagInputBlur = () => {
    setAddingTag(false);
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Add the new tag when Enter is pressed
      if (newTagName.trim() !== '') {
        const updatedTags = [...tags, newTagName.trim()];
        setNewTagName('');
        setAddingTag(false);
        if (onChange) {
          onChange(updatedTags);
        }
      }
    }
  };

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.tags} >
      {tags.map((tag, index) => (
        <Tag
          key={tag}
          tag={tag}
          onClick={() => handleTagClick(tag)}
          selected={selected && selected.includes(tag)}
        />
      ))}
      { editing && ( addingTag ? (
            <input
              className = { styles.tagInput }
              type = "text"
              value = { newTagName }
              onChange = { handleTagInputChange }
              onBlur = { handleTagInputBlur }
              onKeyPress = { handleTagInputKeyPress }
              placeholder = "Enter tag name"
              />
          ): (
              <Tag
              key = "virtual-tag"
              tag = { '+' }
              onClick = { handleAddTagClick }
            /> )
          )}
    </div>
  );
}

export default Tags;
