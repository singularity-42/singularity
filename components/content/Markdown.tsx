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
        // Other configurations remain unchanged
        components={{
          td: ({ node, ...props }) => {
            const children = node?.children;

            if (!children) {
              return <td {...props}></td>;
            }
            
            let row = children.map((child: any) => {
              const isElement = child?.type === 'element';

              if (!isElement) {
                return child.value;
              } else {
                return <div className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>; 
              }
            });

            return <td className={styles.td} {...props}>{row}</td>;
          },
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

          h1: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<div key={i} className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h1 {...props}>{newChildren}</h1>;
          },
          h2: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<div key={i} className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h2 {...props}>{newChildren}</h2>;
          },
          h3: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<div key={i} className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h3 {...props}>{newChildren}</h3>;
          },
          h4: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<div key={i} className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h4 {...props}>{newChildren}</h4>;
          },
          p: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i]; // @TODO Fix this, will cause <strong></strong> to not work  
              if (child?.type === 'element' && child?.tagName == "a") newChildren.push(<div key={i} className={styles.anchor}><HoverLink name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink></div>);
              else if (child.value) newChildren.push(<span key={i}>{child.value}</span>);
              else if (child?.children[0]?.value) newChildren.push(<span key={i}>{child?.children[0]?.value}</span>);
              else newChildren.push(<span key={i}>{child}</span>);
            }
            return <p {...props}>{newChildren}</p>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;

