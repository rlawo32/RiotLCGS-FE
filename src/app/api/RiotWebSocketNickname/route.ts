// src/app/api/RiotWebSocketNickname/route.ts
import { NextResponse } from 'next/server';
import { createHttp1Request } from "league-connect";

export async function POST(request: Request) {
  try {
    const { puuid, credentials } = await request.json();

    const response = await createHttp1Request({
      method: 'GET',
      url: `/lol-summoner/v2/summoners/puuid/${puuid}`
    }, credentials);

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rank data' }, { status: 500 });
  }
}