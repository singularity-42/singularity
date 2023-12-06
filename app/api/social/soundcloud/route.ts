import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
 let entity_name = req.nextUrl.searchParams.get('name');

 // entity decode from url
 if (entity_name) {
    entity_name = decodeURIComponent(entity_name);
 }

 const username = (entity_name || '').toLowerCase();

 let tracks: { stream_url: string, title: string }[] = [];

 const client_id = 'client_id'; // replace with your SoundCloud client id
 const client_secret = 'client_secret'; // replace with your SoundCloud client secret

 try {
    // First, get an access token using the client credentials
    const tokenResponse = await axios.post('https://api.soundcloud.com/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret,
    });

    const access_token = tokenResponse.data.access_token;

    // Send a GET request to the SoundCloud API
    const response = await axios.get(`https://api.soundcloud.com/users/${username}/tracks?client_id=${client_id}`, {
        headers: {
            'Authorization': `OAuth ${access_token}`,
        },
    });

    // Parse the JSON response
    response.data.forEach((track: any) => {
        const stream_url = track.stream_url + '?client_id=' + client_id;
        const title = track.title;
        tracks.push({ stream_url, title });
    });

    return new Response(JSON.stringify(tracks), {
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
