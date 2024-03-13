import { loadCategories } from '@/data/tools/file';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
    let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];
  
    let categories = loadCategories(credentials);
    
    if (!categories)
        return new Response(JSON.stringify({}), {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
        });
    
    return new Response(JSON.stringify(categories), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
    });
};