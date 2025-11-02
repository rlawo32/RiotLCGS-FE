import { authenticate, createHttp1Request, createHttp2Request } from "league-connect";

const RiotWebSocketLatest = async (credentials:any) => {
  
  const response = await createHttp1Request({
    method: 'GET',
    url: '/lol-match-history/v1/products/lol/current-summoner/matches'
  }, credentials);

  console.log(response.json());

  return response.json();
}

export default RiotWebSocketLatest;