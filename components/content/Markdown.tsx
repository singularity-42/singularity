import React, { useEffect, useState } from 'react';
import styles from './Markdown.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { Node, Parent } from 'unist';

interface MarkdownProps {
 content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
 const [sections, setSections] = useState<string[]>([]);

 useEffect(() => {
   const newSections = content.split(/-+/);
   setSections(newSections);
 }, [content]);

 if (!sections || sections.length === 0 || sections[0] === "") {
   return null;
 }

 return (
   <div className={styles.markdown}>
     {sections.map((section: string, index: number) => {
       return (
         <div key={index} className={styles.section}>
           <ReactMarkdown
             children={section}
             remarkPlugins={[remarkParse, linkifyPlugin]}
             components={{
              ul: ({node, ...props}) => <ul {...props} className={styles.customUl} />,
              ol: ({node, ...props}) => <ol {...props} className={styles.customOl} />,
              li: ({node, ...props}) => <li {...props} className={styles.customLi} />,
            }
           }
           />
         </div>
       );
     })}
   </div>
 );
};

function linkifyPlugin() {
 return (tree: Node) => {
   visit(tree, 'text', (node: Node, index: number, parent: Parent) => {
     const matches = Array.from((node as any).value.matchAll(/\[\[(.*?)\]\]/g));
     matches.reverse().forEach((match: any) => {
       const link = {
         type: 'link',
         url: `/${match[1].replace(/\s+/g, '_')}`,
         children: [{ type: 'text', value: match[1] }],
         data: {
           hProperties: { className: styles.link },
         },
       };
       parent.children.splice(index, 1, link);
     });
   });
 };
}

export default Markdown;
