import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import * as glob from 'glob';
import { Url } from 'next/dist/shared/lib/router/router';

// const marked = require('marked');

/*
---
website: https://test.com
instagram: test
mail: mail@test.com
tel: 0034 666 666 666
tags:
  - test
  - test2
---
*/
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  let url: Url = req.url as Url;
  // get entity_type from url
  let entity_type = url.toString().split('=')[1];
  // console.log(params['entity_type'] as string);
  const entityFiles = glob.sync(`./docs/${entity_type}/*.md`);
  const entityData = entityFiles.map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return { file, content };
  });

  const extractMetadata = (metadataString: string | undefined, title: string = '') => {
    if (!metadataString || !metadataString.includes('\n')) {
      return { title };
    }

    const metadataArray = metadataString.split('\n').map((item: string) => item.trim()).filter(Boolean);

    if (metadataArray.length == 0) {
      return { title };
    }

    const metadata: any = {};
    metadataArray.forEach((item) => {
      if (!item.includes(':')) {
        if (item[0] === '-') {
          const item_ = item.replace('-', '').trim();
          const list_key = Object.keys(metadata).pop() || '';
          const _list = metadata[list_key] || [];
          _list.push(item_);
          metadata[list_key] = _list;
        } else {
          console.error(`Invalid metadata: "${item}"`);
        }
      } else {
        const [key, value] = item.split(':').map((s) => s.trim());
        if (key.length > 0) metadata[key] = value;
        else console.error('Empty key');
      }
    });
    let _metadata = {
      title,
      ...metadata,
    }
    return _metadata;
  };

  const responseJSON = JSON.stringify(
    entityData.map((file: any) => {
      const [file_name] = file.file.split('/').slice(-1)[0].split('.md');
      const metadataString = file.content.split('---')[1];
      return extractMetadata(metadataString, file_name);
    })
  );

  return new Response(responseJSON, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};