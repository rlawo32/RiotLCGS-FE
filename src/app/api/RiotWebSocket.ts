import { authenticate, createHttp1Request } from "league-connect";

const RiotWebSocket = async(gameId:number) => {

  // console.log(credentials);
  
  console.log(gameId);

  const credentials = await authenticate({
    awaitConnection: true,
    pollInterval: 1000,
  });
  console.log(credentials);
  /*
  const cwsc = await createWebSocketConnection({
    authenticationOptions: {
      awaitConnection: true,
    },
    pollInterval: 1000, // wait time
    maxRetries: 10      // retry count
  });
  */
  
  const response = await createHttp1Request({
    method: 'GET',
    url: '/lol-match-history/v1/games/' + gameId
  }, credentials);

  console.log(response.json());

  return response.json();
  /*
  cwsc.subscribe("/lol-store/v1/catalog/sales", (data) => {
    console.log(data);
  });
  */
}

export default RiotWebSocket;