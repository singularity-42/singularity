import React, { useEffect, useState } from 'react';
import styles from '@/styles/Markdown.module.scss';
import ReactMarkdown from 'react-markdown';

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

  return <div className={styles.markdown}>
    {sections.map((section: string, index: number) => {
      return <div key={index} className={styles.section}>
        <ReactMarkdown>{section}</ReactMarkdown>
      </div>;
    })}
  </div>;


};

export default Markdown;

