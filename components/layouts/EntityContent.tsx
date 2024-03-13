// RefactoredMarkdown.tsx

import React, { useEffect, useState } from 'react';
import styles from './EntityContent.module.scss';
import Link from '../base/Link';

interface EntityContentProps {
  content: string;
  active?: boolean;
  editing?: boolean;
  onChange?: (content: string) => void;
}

const applyMarkdown = (str: string) => {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const headerRegex = /^(#+)\s+(.+)/gm;
  const hrefRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  // regex for "> hooo"
  const noteRegex = />(.+)/gm;

  const lineRegex = /\n/gm;

  const elements = str.split(lineRegex).map((line, i) => {
    // if line is note
    if (line.startsWith('>')){
        return <div className={styles.note}>
          {line.replace('>', '')}
        </div>
    }

    const linkMatches = Array.from(line.matchAll(linkRegex));
    if (linkMatches.length > 0) {
      return (
        <div key={i}>
          {line.split(linkRegex).map((part, k) => (
            k % 2 === 0 ? <span key={k}>{part}</span> : <Link key={k} name={part}>{part}</Link>
          ))}
        </div>
      );
    }

    const hrefMatches = Array.from(line.matchAll(hrefRegex));
    if (hrefMatches.length > 0) {
      return (
        <div key={i}>
          {line.split(hrefRegex).map((part, k) => {
            const match = hrefMatches.find((m) => m.includes(part));
            if (match) {
              const [_, name, href] = match;
              return (
                k % 2 === 0 ? <span key={k}>{part}</span> : <Link key={k} href={href}>{name}</Link>
              );
            }
            return <span key={k}>{part}</span>;
          })}
        </div>
      );
    }

    const headerMatches = Array.from(line.matchAll(headerRegex));
    if (headerMatches.length > 0) {
      return headerMatches.map((match, j) => {
        const [_, level, text] = match;
        return <div key={`${i}-${j}`}><h1 className={`${styles.header} ${styles[`h${level.length}`]}`}>{text}</h1></div>;
      });
    }

    return <div key={i}><span className={styles.text}>{line}</span></div>;
  });

  return (
    <span className={styles.section}>
      {elements}
    </span>
  );
};


const EntityContent: React.FC<EntityContentProps> = ({ content, active, editing, onChange }) => {
  const [formattedContent, setFormattedContent] = useState(content);

  useEffect(() => {
    if (editing) {
      const trimmedContent = content.trim();
      setFormattedContent(trimmedContent);
    }
  }, [content, editing]);

  useEffect(() => {
    if (active) {
      setFormattedContent(content);
    }
  }, [active, content]);

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
          {applyMarkdown(formattedContent)}
        </div>
      }
    </div>
  );
};

export default EntityContent;