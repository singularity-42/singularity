import { NextRequest, NextResponse } from 'next/server';
import { IgApiClient } from 'instagram-web-api';
import { Url } from 'next/dist/shared/lib/router/router';

export const GET = async (req: NextRequest, res: NextResponse) => {
  const ig = new IgApiClient();
  //  const username = url
  let url: Url = req.url as Url;
  let username = url.toString().split('=')[1];

  try {
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    const user = await ig.user.info(username);
    const feed = await ig.feed.user(user.pk);
    const first4Images = feed.items.slice(0, 4);
    const imageUrls = first4Images.map((post: any) => `https://www.instagram.com/p/${post.code}`);

    return new Response(JSON.stringify({ imageUrls }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
