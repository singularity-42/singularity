import fs from 'fs';
import * as glob from 'glob';

import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
    let entity_name = req.nextUrl.searchParams.get('name');
    const entityFiles = glob.sync(`./docs/**/*.md`);
    const relevantEntityFiles = entityFiles.filter((file) => {
        const [file_name] = file.split('/').slice(-1)[0].split('.md');
        return file_name === entity_name;
    });
    const entities = relevantEntityFiles.map((file) => {
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
                }
            } else {
                const [key, value] = item.split(':').map((s) => s.trim());
                if (key.length > 0) metadata[key] = value;
            }
        });
        let _metadata = {
            title,
            ...metadata,
        }
        return _metadata;
    };

    let foundEntity = null;

    for (const file of entities) {
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