// RefactoredMarkdown.tsx

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './Markdown.module.scss';
import Link from '../base/Link';

interface ConnectionProps {
  to: string;
}

const Connection: React.FC<ConnectionProps> = ({ to }) => (
  <a href={`#${to}`}>{to}</a>
);

interface MarkdownProps {
  content: string;
  active?: boolean;
  editing?: boolean;
  onChange?: (content: string) => void;
}

const extractChildren = (children: any) => {
  if (typeof children === 'string') {
    return <span>{children}</span>;
  }
  
  return children.map((child: any, i: number) => {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const linkTemplate = (name: string) => <Link name={name} key={name}>{name}</Link>;
    // check child.value for links
    if (child?.value) {
      const matches = child.value.match(linkRegex);
      if (matches) {
        const parts = child.value.split(linkRegex);
        const newChildren = parts.map((part: string, i: number) => {
          if (i % 2 === 0) {
            return part;
          }
          const name = matches.shift();
          return linkTemplate(name?.replace('[[', '').replace(']]', '') || '');
        });
        return newChildren;
      }
    }

    return (
      <span key={i}>
        {child?.type === 'element' ? child.children[0]?.value || '' : child.value}
      </span>
    );
  });
};


const renderHeader = (Tag: string) => ({ node, ...props }: any) => {
  const children = node?.children as any;
  const newChildren = extractChildren(children);
  return <Tag {...props} className={styles[Tag.toLowerCase()]}>{newChildren}</Tag>;
};

const renderParagraph = (node: any, props: any) => {
  const children = node?.children as any;
  const newChildren = extractChildren(children);
  return <p {...props} className={styles.p}>{newChildren}</p>;
};

const Markdown: React.FC<MarkdownProps> = ({ content, active, editing, onChange }) => {
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

  const linkRenderer = ({ href, children }: any) => {
    if (href?.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {children}
        </a>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <Link name={href || ''}>{children}</Link>
      );
    }
    // Render other cases as needed
  };

  const customComponents = {
    td: ({ node, ...props }: any) => {
      const children = node?.children;
      if (!children) {
        return <td {...props} key={(children as any)?.value}></td>;
      }
      const row = extractChildren(children);
      return <td className={styles.td} {...props} key={row.join('')}>{row}</td>;
    },
    a: linkRenderer,
    h1: renderHeader('h1'),
    h2: renderHeader('h2'),
    h3: renderHeader('h3'),
    h4: renderHeader('h4'),
    p: renderParagraph,
    li: ({ node, ...props }: any) => {
      const children = node?.children as any;
      const newChildren = extractChildren(children);
      return <li className={styles.li} {...props}>{newChildren}</li>;
    },
    ul: ({ ...props }: any) => <ul className={styles.ul} {...props}></ul>,
    ol: ({ ...props }: any) => <ol className={styles.ol} {...props}></ol>,
  };

  return (
    <div className={`${styles.markdown}`}>
      {editing ? (
        <textarea
          className={styles.textarea}
          value={formattedContent}
          onChange={handleInputChange}
        />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={customComponents as any}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default Markdown;
