import { authenticate, createHttp1Request, createHttp2Request } from "league-connect";

const RiotWebSocketRank = async (puuid:string, credentials:any) => {

  const response = await createHttp1Request({
    method: 'GET',
    url: '/lol-ranked/v1/ranked-stats/' + puuid
  }, credentials);

  // console.log(response.json());

  return response.json();
}

export default RiotWebSocketRank;