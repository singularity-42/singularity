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


const applyMarkdown = (str: string) => {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const headerRegex = /^(#+)\s+(.+)/gm;
  const hrefRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const lineRegex = /\n/g;

  const elements = str.split(lineRegex).flatMap((line, i) => {
    const linkMatches = Array.from(line.matchAll(linkRegex));
    if (linkMatches.length > 0) {
      return linkMatches.map((match, j) => {
        const [_, name] = match;
        return <div key={`${i}-${j}`}>{line.split(linkRegex).map((part, k) => k % 2 === 0 ? part : <Link name={name}>{name}</Link>)}</div>;
      });
    }

    const hrefMatches = Array.from(line.matchAll(hrefRegex));
    if (hrefMatches.length > 0) {
      return hrefMatches.map((match, j) => {
        const [_, name, href] = match;
        return <div key={`${i}-${j}`}>{line.split(hrefRegex).map((part, k) => {
          if ([name, href].includes(part))

            return part == name ? <Link href={href}>{name}</Link> : <></>;
          return part;
        })}</div>;
      });
    }

    const headerMatches = Array.from(line.matchAll(headerRegex));
    if (headerMatches.length > 0) {
      return headerMatches.map((match, j) => {
        const [_, level, text] = match;
        return <div key={`${i}-${j}`}><h1 className={`${styles.header} ${styles[`header-${level.length}`]}`}>{text}</h1></div>;
      });
    }

    return <div key={i}>{line}</div>;
  });

  return (
    <span className={styles.section}>
      {elements}
    </span>
  );
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
          {applyMarkdown(formattedContent)}
        </div>
      }
    </div>
  );
};

export default EntityMarkdown;