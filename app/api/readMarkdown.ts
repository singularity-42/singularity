import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import glob from 'glob';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const markdownFiles = glob.sync('./docs/**/*.md');

  let markdownData = markdownFiles.map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return { file, content };
  });

  res.status(200).json(markdownData);
}
