import { useEffect, useState } from 'react';
import axios from 'axios';

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

const useMarkdownData = (directoryPath: string): MarkdownData[] | null => {
  const [markdownData, setMarkdownData] = useState<MarkdownData[] | null>(null);

  useEffect(() => {
    const fetchMarkdownData = async () => {
      try {
        const response = await axios.get(directoryPath);
        const fileNames = response.data;

        const markdownDataArray: MarkdownData[] = [];

        for (const fileName of fileNames) {
          const filePath = `${directoryPath}/${fileName}`;
          const fileResponse = await axios.get(filePath);
          const markdownContent = fileResponse.data;

          // Parse the markdown content and extract the desired data
          const title = markdownContent.match(/# (.+)/)?.[1] || '';
          const children = markdownContent.replace(/# .+/, '');
          const metadataMatch = markdownContent.match(/---\n([\s\S]+?)\n---/);
          const metadata = extractMetadata(metadataMatch?.[1]);

          const formattedData: MarkdownData = {
            title,
            children,
            metadata,
          };

          markdownDataArray.push(formattedData);
        }

        setMarkdownData(markdownDataArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMarkdownData();
  }, [directoryPath]);

  const extractMetadata = (metadataString: string | undefined) => {
    if (!metadataString) {
      return {};
    }

    const metadata: any = {};
    const metadataLines = metadataString.split('\n');

    for (const line of metadataLines) {
      const [key, value] = line.split(':').map((item) => item.trim());
      metadata[key] = value;
    }

    return metadata;
  };

  return markdownData;
};

export default useMarkdownData;
