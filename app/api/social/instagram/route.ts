import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
  let entity_name = req.nextUrl.searchParams.get('name');

  // entity decode from url
  if (entity_name) {
      entity_name = decodeURIComponent(entity_name);
  }

  const username = (entity_name || '').toLowerCase();

  let imageLinks: string[] = [];

  let url = `https://www.instagram.com/${username}/`;
  
  try {
      // Send a GET request to the URL
      const response = await axios.get(url);

      // Parse the HTML content of the page
      const html_content = response.data;

      // Use a regular expression to find the user ID in the HTML content
      const user_id = html_content.match(/"id":"(.*?)"/)[1];

      let imagesUrl = `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables={%22id%22:${user_id},%22first%22:6}`;

      // Send a GET request to the URL
      const imagesResponse = await axios.get(imagesUrl);

      // Parse the JSON response
      imagesResponse.data.data.user.edge_owner_to_timeline_media.edges.forEach((edge: any) => {
          const thumbnail_src = edge.node.thumbnail_src
          imageLinks.push(thumbnail_src); 
      });

      return new Response(JSON.stringify(imageLinks), {
          headers: {
              'content-type': 'application/json;charset=UTF-8',
          },
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: 'An error occurred' }), {
          headers: {
              'content-type': 'application/json;charset=UTF-8',
          },
      });
  }
};
