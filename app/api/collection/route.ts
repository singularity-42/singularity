import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import * as glob from 'glob';
    
function getContentTypeBasedOnExtension(name: string): string {
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }
  
export const GET = async (req: NextRequest, res: NextResponse) => {
    let entity_name = req.nextUrl.searchParams.get('name');

    if (entity_name) {
        entity_name = decodeURIComponent(entity_name);
    }

    const entityImages = glob.sync(`./docs/collections/images/${entity_name}.**`);
    let newRandomImageIndex = Math.floor(Math.random() * 7);
    let imagePath = `./public/template/00${newRandomImageIndex}.jpg`;;
    if (entityImages.length === 0) {
    }else {
        imagePath = entityImages[0];
    }   

    const image = fs.readFileSync(imagePath);

    const contentType = getContentTypeBasedOnExtension(imagePath);

    return new Response(image, {
        headers: {
            'Content-Type': contentType,
        },
    });
}


