import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.scss';
import Link from 'next/link';
import * as Url from 'url';
import HoverLink from './HoverLink';
// import remarkGfm from 'remark-gfm'
interface ConnectionProps {
  to: string;
}

const Connection: React.FC<ConnectionProps> = ({ to }) => {
  return <a href={`#${to}`}>{to}</a>;
};

interface MarkdownProps {
  content: string;
  active?: boolean;
}

const Markdown: React.FC<MarkdownProps> = ({ content, active }) => {
  // if its a  h1 h2 h3 or its a <p> than we will check the string text if there is one ore more [[...]] for each one we will add a new <Connection to={...} /> component and replace the [[...]] with the <Connection to={...} /> component
  const regex = /(\[\[([^\]]+)\]\])/g;
  const matches = content?.match(regex);

  if (matches) {
    matches.forEach((match) => {
      const to = match.replace('[[', '').replace(']]', '');
      // convert to possible file name
      const toFileName = to.replace(/ /g, '-')

      content = content.replace(match, `[${to}](${toFileName})`);
    });
  }

  return (
    <div className={`${styles.markdown} ${active ? styles.active : ''}`}>
      <ReactMarkdown
        // Other configurations remain unchanged
        components={{
          a: ({ node, ...props }) => {
            const { href, children } = props;

            if (href?.startsWith('http')) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.anchor}>
                  {children}
                </a>
              );
            }

            if (href?.startsWith('#')) {
              return (
                <div className={styles.anchor}>
                  <HoverLink name={href || ''}>{children}</HoverLink>
                </div>
              );
            }

            // Render other cases as needed
          },
          // Adjust other components as necessary
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;

