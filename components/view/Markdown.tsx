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
              return <td {...props}
                key={(children as any)?.value}
              ></td>;
            }

            let row = children.map((child: any) => {
              const isElement = child?.type === 'element';

              if (!isElement) {
                return child.value;
              } else {
                return <HoverLink 
                key={child?.children[0]?.value || ''}
                name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>;
              }
            });

            return <td className={styles.td} {...props} key={row.join('')}>{row}</td>;
          },
          a: ({ node, ...props }) => {
            const { href, children } = props;

            if (href?.startsWith('http')) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {children}
                </a>
              );
            }

            if (href?.startsWith('#')) {
              return (
                  <HoverLink name={href || ''}>{children}</HoverLink>
              );
            }

            // Render other cases as needed
          },

          h1: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<HoverLink key={i} name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h1 {...props} className={styles.h1}>{newChildren}</h1>;
          },
          h2: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<HoverLink key={i} name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h2 {...props} className={styles.h2}>{newChildren}</h2>;
          },
          h3: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<HoverLink key={i} name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h3 {...props} className={styles.h3}>{newChildren}</h3>;
          },
          h4: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<HoverLink key={i} name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <h4 {...props} className={styles.h4}>{newChildren}</h4>;
          },
          p: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i]; // @TODO Fix this, will cause <strong></strong> to not work  
              if (child?.type === 'element' && child?.tagName == "a") {
                if (child?.properties?.href?.startsWith('http')) // if link is http or https than do this
                  newChildren.push(<HoverLink key={i} href={child?.properties?.href}>{child?.children[0]?.value || ''}</HoverLink>); 
                else // if #{hash}  its hash than do this 
                  newChildren.push(<HoverLink key={i} name={child?.children[0]?.value.replace('#', '') || ''}>{child?.children[0]?.value.replace('#', '') || ''}</HoverLink>);
                
              }
              else if (child.value) newChildren.push(<span key={i}>{child.value}</span>);
              else if (child?.children[0]?.value) newChildren.push(<span key={i}>{child?.children[0]?.value}</span>);
              else newChildren.push(<span key={i}>{child}</span>);
            }
            return <p {...props} className={styles.p}>{newChildren}</p>;
          },
          li: ({ node, ...props }) => {
            let children = node?.children as any;
            let newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child?.type === 'element') newChildren.push(<HoverLink key={i} name={child?.children[0]?.value || ''}>{child?.children[0]?.value || ''}</HoverLink>);
              else newChildren.push(<span key={i}>{child.value}</span>);
            }
            return <li className={styles.li} {...props} 
              key={newChildren.join('')}
            >{newChildren}</li>;
          },
          ul: ({ node, ...props }) => {
            return <ul className={styles.ul} {...props} 
              key={(node?.children as any)?.join('')}
            ></ul>;
          },
          ol: ({ node, ...props }) => {
            return <ol className={styles.ol} {...props} 
              key={(node?.children as any)?.join('')}
            ></ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;

