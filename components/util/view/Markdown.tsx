import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/Markdown.module.scss';

interface MarkdownProps {
 content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
 const [sections, setSections] = useState<string[]>([]);
 
 useEffect(() => {
   const newSections = content.split(/--+/);
   setSections(newSections);
 }, [content]);

  // return <ReactMarkdown>{content}</ReactMarkdown>;

  return <div className={styles.markdown}>
    {sections.map((section: string, index: number) => {
      return <div key={index} className={styles.section}>
        <ReactMarkdown>{section}</ReactMarkdown>
      </div>;
    })}
  </div>;
  

};

export default Markdown;

