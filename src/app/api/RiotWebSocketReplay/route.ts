import { NextResponse } from 'next/server';
import { createHttp1Request } from "league-connect";

export async function POST(request: Request) {
  try {
    const { gameId, credentials } = await request.json();

    const response = await createHttp1Request({
      method: 'POST',
      // url: `/lol-replays/v1/metadata/${gameId}`,
      // url: `/lol-replays/v1/rofls/${gameId}/watch`,
      url: `/lol-replays/v1/rofls/${gameId}/download`,
      body: {
        contextData: {}
      }
    }, credentials);

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ err: 'Failed to fetch rank data' }, { status: 500 });
  }
}