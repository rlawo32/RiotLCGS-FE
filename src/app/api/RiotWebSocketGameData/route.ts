import { NextResponse } from 'next/server';
import { createHttp1Request } from "league-connect";
import { playerData } from "@/app/config/PlayerData";

export async function POST(request: Request) {
  try {
    const { credentials, gameId } = await request.json();

    let gameData:object = {};
    let playerArr:any = [];
    const laneData:{puuid:string; team:string; lane:string; name:string; level:number;}[] = [];
    const levelData:{puuid:string; level:any;}[] = [];

    const resHistory = await createHttp1Request({
      method: 'GET',
      url: '/lol-match-history/v1/games/' + gameId
    }, credentials);

    const dataHistory:object = await resHistory.json();

    if(Object.keys(dataHistory).length !== 0) {
      gameData = dataHistory;
      const tempGameData = Object.values(dataHistory);
      const participantIdentities:any = Object.values(tempGameData[10]);
      playerArr = Object.values(participantIdentities);
    }

    if(playerArr.length > 0) {
      for(let i=0; i<playerArr.length; i++) {
        const lvPuuid = playerArr[i].player.puuid;
        const resLevel = await createHttp1Request({
          method: 'GET',
          url: '/lol-summoner/v2/summoners/puuid/' + lvPuuid
        }, credentials);

        const data = await resLevel.json();
        const level = data.summonerLevel;

        levelData.push({puuid:lvPuuid, level:level});
      }
    }

    const resTimeline = await createHttp1Request({
      method: 'GET',
      url: '/lol-match-history/v1/game-timelines/' + gameId
    }, credentials);

    const dataTimeline:object = await resTimeline.json();

    if(Object.keys(dataTimeline).length !== 0) {
      const gameInfo:any = Object.values(gameData)[10];
      const participantIdentities:any = Object.values(gameInfo);
      const timelines:any = Object.values(dataTimeline)[0];
      const timeArr1:any = timelines.length > 2 ? Object.values(timelines[2].participantFrames) : [];
      const timeArr2:any = timelines.length > 3 ? Object.values(timelines[3].participantFrames) : [];
      const timeArr3:any = timelines.length > 4 ? Object.values(timelines[4].participantFrames) : [];
      const timeArr4:any = timelines.length > 5 ? Object.values(timelines[5].participantFrames) : [];
      const timeArr5:any = timelines.length > 6 ? Object.values(timelines[6].participantFrames) : [];
      const timeArr6:any = timelines.length > 7 ? Object.values(timelines[7].participantFrames) : [];
      const timeArr7:any = timelines.length > 8 ? Object.values(timelines[8].participantFrames) : [];
      const timeArr8:any = timelines.length > 9 ? Object.values(timelines[9].participantFrames) : [];
      const timeArr9:any = timelines.length > 10 ? Object.values(timelines[10].participantFrames) : [];
      const timeArrTotal:any[] = [timeArr1, timeArr2, timeArr3, timeArr4, timeArr5, timeArr6, timeArr7, timeArr8, timeArr9];
      const participantIdCheck:number[] = [];

      if(timeArrTotal.length > 0 && timeArr9.length > 0) {
          // JUG
          for(let i:number=0; i<timeArr9.length; i++) {
            const puuid:string = participantIdentities.find((item:any) => item.participantId === timeArr1[i].participantId)!.player.puuid;
            const targetItem = playerData.find((item) => item.puuid === puuid);

            if (!targetItem) {
                console.error(`데이터를 찾을 수 없습니다. 찾으려는 puuid: ${puuid}`);
                throw new Error(`Player not found: ${puuid}`); 
            }
            const name:string = targetItem.name;

            if(timeArr9[i].jungleMinionsKilled >= 30) {
                let playerLevel:number = 0;
                for(let i=0; i<levelData.length; i++) {
                  if(levelData[i].puuid === puuid) {
                    playerLevel = levelData[i].level;
                  }
                }
                laneData.push({puuid:puuid, team:timeArr1[i].participantId < 6 ? 'B' : 'R', lane:'JUG', name:name, level:playerLevel});
                participantIdCheck.push(timeArr1[i].participantId);
            }                
          }

          // SUP
          let searchArrSup:{id:number; minion:number;}[] = [];
          for(let i:number=0; i<timeArr9.length; i++) {
            searchArrSup.push({id:timeArr9[i].participantId, minion:timeArr9[i].minionsKilled+timeArr9[i].jungleMinionsKilled});
          }
          searchArrSup = searchArrSup.sort((a, b) => a.minion - b.minion).slice(0, 2).sort((a, b) => a.id - b.id);
          for(let i:number=0; i<2; i++) {
            const puuid:string = participantIdentities.find((item:any) => item.participantId === searchArrSup[i].id)!.player.puuid;
            const targetItem = playerData.find((item) => item.puuid === puuid);

            if (!targetItem) {
                console.error(`데이터를 찾을 수 없습니다. 찾으려는 puuid: ${puuid}`);
                throw new Error(`Player not found: ${puuid}`); 
            }
            const name:string = targetItem.name;

            let playerLevel:number = 0;
            for(let i=0; i<levelData.length; i++) {
              if(levelData[i].puuid === puuid) {
                playerLevel = levelData[i].level;
              }
            }
            laneData.push({puuid:puuid, team:searchArrSup[i].id < 6 ? 'B' : 'R', lane:'SUP', name:name, level:playerLevel});
            participantIdCheck.push(searchArrSup[i].id);    
          }

          // MID
          const searchArrMid1 = new Map<number, number>();
          for(let i:number=0; i<timeArr1.length; i++) {
            for(let j:number=0; j<timeArrTotal.length; j++) {
                if(timeArrTotal[j][i].position.x < 10000 && timeArrTotal[j][i].position.x > 4000 && timeArrTotal[j][i].position.y < 10000 && timeArrTotal[j][i].position.y > 4000 ) {
                    const currentScore = searchArrMid1.get(timeArrTotal[j][i].participantId) || 0;
                    searchArrMid1.set(timeArrTotal[j][i].participantId, currentScore + 10);
                }
            }
          }
          const searchArrMid2 = Array.from(searchArrMid1, ([id, score]) => ({id, score}));
          searchArrMid2.sort((a, b) => b.score - a.score);
          for(let i:number=0; i<2; i++) {
            const puuid:string = participantIdentities.find((item:any) => item.participantId === searchArrMid2[i].id)!.player.puuid;
            const targetItem = playerData.find((item) => item.puuid === puuid);

            if (!targetItem) {
                console.error(`데이터를 찾을 수 없습니다. 찾으려는 puuid: ${puuid}`);
                throw new Error(`Player not found: ${puuid}`); 
            }
            const name:string = targetItem.name;

            let playerLevel:number = 0;
            for(let i=0; i<levelData.length; i++) {
              if(levelData[i].puuid === puuid) {
                playerLevel = levelData[i].level;
              }
            }
            laneData.push({puuid:puuid, team:searchArrMid2[i].id < 6 ? 'B' : 'R', lane:'MID', name:name, level:playerLevel});               
            participantIdCheck.push(searchArrMid2[i].id);
          }

          // ADC
          const searchArrSup1:{id:number; position:{x:number; y:number;};}[] = []; // blue
          const searchArrSup2:{id:number; position:{x:number; y:number;};}[] = []; // red
          const searchArrAdc1 = new Map<number, number>();
          for(let i:number=0; i<timeArr1.length; i++) {
            for(let j:number=0; j<timeArrTotal.length; j++) {
                if(timeArrTotal[j][i].participantId < 6 && timeArrTotal[j][i].participantId === searchArrSup[0].id) {
                    searchArrSup1.push({id:timeArrTotal[j][i].participantId, position:timeArrTotal[j][i].position});
                } else if(timeArrTotal[j][i].participantId > 5 && timeArrTotal[j][i].participantId === searchArrSup[1].id) {
                    searchArrSup2.push({id:timeArrTotal[j][i].participantId, position:timeArrTotal[j][i].position});
                }
            }
          }
          if(searchArrSup1.length > 0 && searchArrSup2.length > 0) {
            for(let i:number=0; i<timeArr1.length; i++) {
                for(let j:number=0; j<timeArrTotal.length; j++) {
                    if(timeArrTotal[j][i].participantId < 6) {
                        if(timeArrTotal[j][i].position.x > 9000 && timeArrTotal[j][i].position.y < 3000 ||
                        (Math.abs(timeArrTotal[j][i].position.x - searchArrSup1[j].position.x) < 1500 && 
                            Math.abs(timeArrTotal[j][i].position.y - searchArrSup1[j].position.y) < 1500)
                        ) {
                            const currentScore = searchArrAdc1.get(timeArrTotal[j][i].participantId) || 0;
                            searchArrAdc1.set(timeArrTotal[j][i].participantId, currentScore + 10);
                        }
                    } else {
                        if(timeArrTotal[j][i].position.x > 9000 && timeArrTotal[j][i].position.y < 3000 ||
                        (Math.abs(timeArrTotal[j][i].position.x - searchArrSup2[j].position.x) < 1500 && 
                            Math.abs(timeArrTotal[j][i].position.y - searchArrSup2[j].position.y) < 1500)
                        ) {
                            const currentScore = searchArrAdc1.get(timeArrTotal[j][i].participantId) || 0;
                            searchArrAdc1.set(timeArrTotal[j][i].participantId, currentScore + 10);
                        }
                    }
                }
            }
          }
          let searchArrAdc2 = Array.from(searchArrAdc1, ([id, score]) => ({id, score}));
          searchArrAdc2 = searchArrAdc2.filter((item) => item.id !== searchArrSup[0].id && item.id !== searchArrSup[1].id).sort((a, b) => b.score - a.score);
          for(let i:number=0; i<2; i++) {
            const puuid:string = participantIdentities.find((item:any) => item.participantId === searchArrAdc2[i].id)!.player.puuid;
            const targetItem = playerData.find((item) => item.puuid === puuid);

            if (!targetItem) {
                console.error(`데이터를 찾을 수 없습니다. 찾으려는 puuid: ${puuid}`);
                throw new Error(`Player not found: ${puuid}`); 
            }
            const name:string = targetItem.name;

            let playerLevel:number = 0;
            for(let i=0; i<levelData.length; i++) {
              if(levelData[i].puuid === puuid) {
                playerLevel = levelData[i].level;
              }
            }
            laneData.push({puuid:puuid, team:searchArrAdc2[i].id < 6 ? 'B' : 'R', lane:'ADC', name:name, level:playerLevel});               
            participantIdCheck.push(searchArrAdc2[i].id);
          }

          // TOP
          const searchArrTop:number[] = [];
          for(let i:number=1; i<=10; i++) {
            if(!participantIdCheck.includes(i)) {
                searchArrTop.push(i);
            }
          }
          for(let i:number=0; i<2; i++) {
            const puuid:string = participantIdentities.find((item:any) => item.participantId === searchArrTop[i])!.player.puuid;
            const targetItem = playerData.find((item) => item.puuid === puuid);

            if (!targetItem) {
                console.error(`데이터를 찾을 수 없습니다. 찾으려는 puuid: ${puuid}`);
                throw new Error(`Player not found: ${puuid}`); 
            }
            const name:string = targetItem.name;
            
            let playerLevel:number = 0;
            for(let i=0; i<levelData.length; i++) {
              if(levelData[i].puuid === puuid) {
                playerLevel = levelData[i].level;
              }
            }
            laneData.push({puuid:puuid, team:searchArrTop[i] < 6 ? 'B' : 'R', lane:'TOP', name:name, level:playerLevel});               
            participantIdCheck.push(searchArrTop[i]);
          }
      }
    }
    console.log(laneData);

    return NextResponse.json(Object.keys(gameData).length > 0 ? {gameData:gameData, laneData:laneData, playerArr:playerArr} : {err:'Failed to fetch game data'}, { status: Object.keys(gameData).length > 0 ? 200 : 500 });
  } catch {
    return NextResponse.json({ err: 'Failed to fetch rank data' }, { status: 500 });
  }
}