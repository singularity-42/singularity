// RefactoredMarkdown.tsx

import React, { useEffect, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './EntityMarkdown.module.scss';
import Link from '../util/Link';

interface ConnectionProps {
  to: string;
}

interface MarkdownProps {
  content: string;
  active?: boolean;
  editing?: boolean;
  onChange?: (content: string) => void;
}

const applyLinks = (str: string) => {
  const linkTemplate = (name: string) => <Link name={name}>{name}</Link>;
  const matches = str.match(/\[\[([^\]]+)\]\]/g); // Use specific regex
  if (matches) {
    return (
      <span className={styles.section}>
        {str.split(/\[\[([^\]]+)\]\]/g).map((part, i) => (
          <div key={`${name}-${i}`} className={styles.p}>
            {i % 2 === 0 ? part : linkTemplate(matches[Math.floor(i / 2)].replace('[[', '').replace(']]', ''))}
          </div>
        ))}
      </span>
    );
  }
  return <span>{str}</span>;
};

const EntityMarkdown: React.FC<MarkdownProps> = ({ content, active, editing, onChange }) => {
  const [formattedContent, setFormattedContent] = useState(content);

  useEffect(() => {
    if (editing) {
      const trimmedContent = content.trim();
      setFormattedContent(trimmedContent);
    }
  }, [content, editing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormattedContent(e.target.value);
    if (onChange) {
      onChange(`\n${e.target.value}\n`);
    }
  };

  return (
    <div className={`${styles.markdown}`}>
      {editing ?
        <textarea
          className={styles.textarea}
          value={formattedContent}
          onChange={handleInputChange}
          disabled={!editing}
        />
        : <div className={styles.section}>
          {applyLinks(formattedContent)}
        </div>
      }
    </div>
  );
};

export default EntityMarkdown;