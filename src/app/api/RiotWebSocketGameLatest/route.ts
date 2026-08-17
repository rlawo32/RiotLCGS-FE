import { NextResponse } from 'next/server';
import { createHttp1Request } from "league-connect";

export async function POST(request: Request) {
  try {
    const { credentials } = await request.json();

    const response = await createHttp1Request({
      method: 'GET',
      url: '/lol-match-history/v1/products/lol/current-summoner/matches',
    }, credentials);

    const data:any = await response.json();

    return NextResponse.json({ gameId:data.games.games[0].gameId, gameType:data.games.games[0].gameType });
  } catch {
    return NextResponse.json({ err: 'Failed to fetch rank data' }, { status: 500 });
  }
}