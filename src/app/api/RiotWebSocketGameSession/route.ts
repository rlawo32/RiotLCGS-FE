import { NextResponse } from 'next/server';
import { createHttp1Request } from "league-connect";

export async function POST(request: Request) {
  try {
    const { credentials } = await request.json();

    const response = await createHttp1Request({
      method: 'GET',
      url: `/lol-gameflow/v1/session`,
      // url: `/lol-gameflow/v1/gameflow-metadata/player-status`,
    }, credentials);

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ err: 'Failed to fetch rank data' }, { status: 500 });
  }
}