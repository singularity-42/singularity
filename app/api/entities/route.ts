import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import * as glob from 'glob';

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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  let entity_type = "creatives"

  const entityFiles = glob.sync(`./docs/${entity_type}/*.md`);

  let entityData = entityFiles.map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return { file, content };
  });


  const extractMetadata = (metadataString: string | undefined) => {
    if (!metadataString) {
      return {};
    }


    // const dataStack = metadataString.split('---');
    console.log('Data stack:', metadataString);
    const metadata = metadataString;
    // const markdownContent = dataStack[2];
    if (!metadata) {
      console.log('No metadata found');
      return {};
    }

    // check if there is a new line
    if (!metadata.includes('\n')) {
      console.log('No new line found');
      return {};
    }

    let metadataArray = metadata.split('\n');
    if (metadataArray.length === 0) {
      console.log('No metadata found');
      return {};
    }

    const metadataObject: any = {};
    metadataArray = metadataArray.map((item: string) => item.trim());
    metadataArray.forEach((item, index) => {
      if (item.length === 0)
        if (metadataArray[index + 1] && metadataArray[index + 1][0] != '-') {
          console.log('Empty item');
          return;
          // check if next item is -
        }
      // check if item has a colon
      if (!item.includes(':')) {
        if (item[0] != '-') {
          console.log('No colon found');
          return;
        } else {
          let list = metadataArray[index - 1].split(':')[0];

          if(!metadataObject[list]){
            metadataObject[list] = []; 
          }

          let values = metadataObject[list];
          console.log(list, values);

          let value = item;

          metadataObject[list].push(value);
          return;

        }

      } else {

        let itemArray = item.split(':');
        // const key = itemArray[0].trim(); trip not possible
        // const value = itemArray[1].trim();
        // smt creative to remove the space in the key and value start and end
        const key = itemArray[0];
        const value = itemArray[1];

        if (key.length === 0) {
          console.log('Empty key');
          return;
        }

        metadataObject[key] = value;
        return
      }
    });
    console.log('Metadata object:', metadataObject);




    return metadataObject;
  };

  return new Response(JSON.stringify(entityData.map((file: any) => {
    const content = file.content;
    const metadataString = content.split('---')[1];
    const metadata = extractMetadata(metadataString);
    return metadata;
  })), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}
