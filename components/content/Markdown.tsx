import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.scss';
import Link from 'next/link';
import * as Url from 'url';
import HoverLink from './HoverLink';

interface ConnectionProps {
  to: string;
}

const Connection: React.FC<ConnectionProps> = ({ to }) => {
  return <a href={`#${to}`}>{to}</a>;
};

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // if its a  h1 h2 h3 or its a <p> than we will check the string text if there is one ore more [[...]] for each one we will add a new <Connection to={...} /> component and replace the [[...]] with the <Connection to={...} /> component
  const regex = /(\[\[([^\]]+)\]\])/g;
  const matches = content?.match(regex);

  if (matches) {
    matches.forEach((match) => {
      const to = match.replace('[[', '').replace(']]', '');
      // convert to possible file name
      const toFileName = to
        // .toLowerCase()
        .replace(/ /g, '-')
      content = content.replace(match, `[${to}](${toFileName})`);
    });
  }

  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => {
            const { ref, ...rest } = props;
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

