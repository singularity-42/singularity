import React from 'react';
import CreativesList from '@/components/util/CreativesList';
import useMarkdownData from '@/hooks/useMarkdownData';

interface MarkdownData {
  title: string;
  children: string;
  metadata: {
    website: string;
    instagram: string;
    mail: string;
    tel: string;
    tags: string[];
  };
}

const CreativesPage: React.FC = () => {
  const directoryPath = 'docs/creatives';
  const markdownData = useMarkdownData(directoryPath);

  if (!markdownData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {markdownData.map((data, index) => (
        <div key={index}>
          <h2>{data.title}</h2>
          <CreativesList markdownData={data} />
        </div>
      ))}
    </div>
  );
};

export default CreativesPage;
