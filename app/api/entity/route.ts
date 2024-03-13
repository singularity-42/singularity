import { loadFile } from '@/data/tools/file';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
    let fileName = req.nextUrl.searchParams.get('name') || '';
    let fileDate = req.nextUrl.searchParams.get('date') || '';
    let fileCategory = req.nextUrl.searchParams.get('category') || '';

    if (fileCategory) fileCategory = decodeURIComponent(fileCategory) || '';
    if (fileDate) fileDate = decodeURIComponent(fileDate) || '';
    if (fileName) fileName = decodeURIComponent(fileName) || '';
    
    let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];
  
    let file = loadFile(credentials, fileName, "", fileCategory, fileDate);

    if( file == null) return new Response("File not found", {
        status: 404,
    });

    return new Response(JSON.stringify(file), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
    });
}