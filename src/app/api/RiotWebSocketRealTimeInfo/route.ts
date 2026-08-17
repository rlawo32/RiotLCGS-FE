import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sessionTeamData } = await request.json();
    console.log(sessionTeamData)

    // const realTimeInfoUrl = 'https://ocp-dudu.duckdns.org/lcg/send-realTimeInfo';
    const realTimeInfoUrl = 'http://localhost:8080/send-realTimeInfo';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(realTimeInfoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionTeamData), 
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMsg = await response.text();
      return NextResponse.json(
        { status: 500, message: `외부 서버 응답 에러: ${errorMsg}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      status: 200, 
      message: 'Node.js 서버로 데이터 전송 완료',
      receivedData: sessionTeamData 
    });
  } catch (err: any) {
    console.error("API Route error:", err);
    const message = err.name === 'AbortError' ? '외부 서버 응답 시간이 초과되었습니다.' : err.message;
    return NextResponse.json(
      { status: 500, message: message }, 
      { status: 500 }
    );
  }
}