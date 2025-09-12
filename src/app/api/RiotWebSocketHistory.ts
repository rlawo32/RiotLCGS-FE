import { authenticate, createHttp1Request, createHttp2Request } from "league-connect";

const RiotWebSocketHistory = async (credentials:any) => {
  
  const response = await createHttp1Request({
    method: 'GET',
    url: '/lol-match-history/v1/delta'
    // url: '/lol-match-history/v1/game-timelines/' + gameId
  }, credentials);

  console.log(response.json());

  return response.json();
}

export default RiotWebSocketHistory;