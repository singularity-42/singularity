import fs from 'fs';
import * as glob from 'glob';

import { NextRequest, NextResponse } from 'next/server';


// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const useEntity = ( name: string ) => {
//     const [entity, setEntity] = useState<any | null>(null);
    
//     useEffect(() => {
//         if (!name) {
//         return;
//         }
    
//         const fetchEntity = async () => {
//         try {
//             // http://localhost:3000/api/entity
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/entity?name=${name}`;
    
//             // let url = 'http://localhost:3000/api/entities?entity_type='creative'&filter='artist, album''
//             const response = await axios.get(url);
//             setEntity(response.data);
//         } catch (error) {
//             console.error(error);
//         }
//         };
    
//         fetchEntity();
//     }, [name]);

//     return entity;
// }

// export default useEntity;

export const GET = async (req: NextRequest, res: NextResponse) => {
    let entity_name = req.nextUrl.searchParams.get('name');
    const entityFiles = glob.sync(`./docs/**/*.md`);
    const relevantEntityFiles = entityFiles.filter((file) => {
        const [file_name] = file.split('/').slice(-1)[0].split('.md');
        return file_name === entity_name;
    });
    const entityData = relevantEntityFiles.map((file) => {
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

    let foundEntity = null;

    for (const file of entityData) {
        const [file_name] = file.file.split('/').slice(-1)[0].split('.md');
        const metadataString = file.content.split('---')[1];
        let metadata = extractMetadata(metadataString, file_name);

        let description = file.content.split('---')[2];

        metadata = {
            ...metadata,
            description
        }

        if (entity_name && metadata.title === entity_name) {
            foundEntity = metadata;
            break; // Found the entity, exit the loop
        }
    }

    if (foundEntity) {
        return new Response(JSON.stringify(foundEntity), {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        });
    } else {
        return new Response(JSON.stringify({}), { status: 404 });
    }
};