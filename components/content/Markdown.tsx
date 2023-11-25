import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.scss';
import Link from 'next/link';
import * as Url from 'url';
import HoverLink from './HoverLink';
import remarkGfm from 'remark-gfm'
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
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => {
            const { ref, ...rest } = props;
            if (props.href?.startsWith('http'))
              return <p className={styles.anchor}><a {...rest} target="_blank" rel="noopener noreferrer">{props.children}</a></p>

            if (props.href?.startsWith('#'))
              return (<div className={styles.anchor}><HoverLink name={props.href || ''} {...rest} > {props.children} </HoverLink></div>)

          },
          ul: ({ node, ...props }) => {
            const { ref, ...rest } = props;
            return <ul {...rest} className={styles.list} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;

