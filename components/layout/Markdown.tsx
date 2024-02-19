// RefactoredMarkdown.tsx

import React, { useEffect, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
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
  let listChildren = children;
  const linkRegex = /\[\[.+\]\]/g;
  const hasLink = (str: string) => str ? str.match(linkRegex) : false;
  const getLinkComponent = (str: string) => {
    const name = str.replace('[[', '').replace(']]', '');
    return <Link name={name}>{name}</Link>;
  };

  console.log(typeof children, typeof children === 'string');

  if (typeof children === 'string')
    listChildren = children.split('\n').map((child: any) => child.trim());
  else
    listChildren = children.map((child: any) => child.value);

  return listChildren.map((value: any) => {
    if (hasLink(value)) return getLinkComponent(value);
    return value
  }).map((child: any, i: number) =>
    <span key={i}>
      {child}&nbsp;
    </span>
  );
};


const renderHeader = (Tag: string) => ({ node, ...props }: any) => {
  const children = node?.children as any;
  const newChildren = extractChildren(children);
  return <Tag {...props} className={styles[Tag.toLowerCase()]}>{newChildren}</Tag>;
};

const renderParagraph = (node: any, ...props: any) => {
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

  const customComponents: Partial<Components> = {
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
          components={customComponents as Partial<Components>}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default Markdown;
