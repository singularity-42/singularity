import { FileContent } from '@/types';
import { loadFile } from '@/utilities/file';
import fs from 'fs';
import * as glob from 'glob';

import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
    let fileName = req.nextUrl.searchParams.get('name') || '';

    if (fileName) fileName = decodeURIComponent(fileName) || '';
    let file: FileContent = loadFile(fileName);

    return new Response(JSON.stringify(file), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
    });
}