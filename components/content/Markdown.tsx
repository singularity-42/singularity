import React from 'react';
import ReactMarkdown from 'react-markdown';

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
 return (
  <ReactMarkdown
  >
    {content}
  </ReactMarkdown>
 );
};

export default Markdown;
