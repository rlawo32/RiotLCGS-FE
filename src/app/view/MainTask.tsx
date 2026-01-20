import cp from "child_process";
import util from "util";

import MainView from "./MainView";
import RiotWebSocketMatch from "@/app/api/RiotWebSocketMatch";
import RiotWebSocketRank from "@/app/api/RiotWebSocketRank";
import RiotWebSocketLatest from "@/app/api/RiotWebSocketLatest";
import RiotWebSocketTimeline from "@/app/api/RiotWebSocketTimeline";
import RiotWebSocketHistory from "@/app/api/RiotWebSocketHistory";

import { authenticate } from "league-connect";

import { playerData } from "./PlayerData";

const MainTask = async () => {
    let gameId:number = 7389173588;
    let gameType:string = "";
    let gameData:object = {};
    let rankData:{
        puuid:string;
        wins:number;
        points:number;
        presentTier:string;
        presentDivision:string;
        presentHighestTier:string;
        presentHighestDivision:string;
        previousTier:string;
        previousDivision:string;
        previousHighestTier:string;
        previousHighestDivision:string;
    }[] = [];
    let laneData:{
        puuid:string;
        team:string;
        lane:string;
        name:string;
    }[] = [];
    const exec = util.promisify(cp.exec);

    const processName:string = "LeagueClientUx";   
    let credentials;
    let playerArr:any = [];
    let status_1:string = "N";
    let result_1:string = "N";
    let result_2:string = "N";
    let result_3:string = "N";
    let result_4:string = "N";
  
    const command = `wmic process get caption | findstr ${processName}.exe`;
    const executionOptions = {shell: "powershell"};
  
    try {
        const { stdout: stdout } = await exec(command, executionOptions);
        credentials = await authenticate({
            awaitConnection: true,
            pollInterval: 1000,
        });

        // console.log(credentials);

        result_1 = (credentials.certificate && credentials.certificate.length > 0) ? 'Y' : 'N';
    } catch (err) {
        result_1 = "N";
    }

    if(result_1 === 'Y') {
        const gameLatest:object = await RiotWebSocketLatest(credentials);

        if(Object.keys(gameLatest).length !== 0) {
            const data:any = Object.values(gameLatest);

            const games:any = Object.values(data[1]);
            const gameArr:any = Object.values(games[5]);

            gameId = gameArr[0].gameId;
            gameType = gameArr[0].gameType;
            gameId = 8002205128;
            gameType = 'CUSTOM_GAME';

            result_2 = gameId.toString.length > 0 && gameType === 'CUSTOM_GAME' ? 'Y' : 'N';
        }
    }
  
    if(result_1 === 'Y' && result_2 === 'Y') {
        const gameDataCheck:object = await RiotWebSocketMatch(gameId, credentials);
        
        if(Object.keys(gameDataCheck).length !== 0) {
            gameData = gameDataCheck;

            const data:any = Object.values(gameData);
            const participantIdentities:any = Object.values(data[10]);
            playerArr = Object.values(participantIdentities);

            result_3 = playerArr.length > 0 ? 'Y' : 'N';
        }
    }

    if(result_1 === 'Y' && result_2 === 'Y' && result_3 === 'Y') {
        const gameTimeline:object = await RiotWebSocketTimeline(gameId, credentials);

        console.log(gameTimeline);
        
        if(Object.keys(gameTimeline).length !== 0) {
            const gameInfo:any = Object.values(gameData)[10];
            const participantIdentities:any = Object.values(gameInfo);
            const timelines:any = Object.values(gameTimeline)[0];
            const timeArr1:any = Object.values(timelines[2].participantFrames);
            const timeArr2:any = Object.values(timelines[3].participantFrames);
            const timeArr3:any = Object.values(timelines[4].participantFrames);
            const timeArr4:any = Object.values(timelines[5].participantFrames);
            const timeArr5:any = Object.values(timelines[6].participantFrames);
            const timeArr6:any = Object.values(timelines[7].participantFrames);
            const timeArr7:any = Object.values(timelines[8].participantFrames);
            const timeArr8:any = Object.values(timelines[9].participantFrames);
            const timeArr9:any = Object.values(timelines[10].participantFrames);
            const timeArrTotal:any[] = [timeArr1, timeArr2, timeArr3, timeArr4, timeArr5, timeArr6, timeArr7, timeArr8, timeArr9];
            const participantIdCheck:number[] = [];
            // console.log(participantIdentities);
            // console.log(timeArr1);
            // console.log(timeArr2);

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
                    laneData.push({puuid:puuid, team:timeArr1[i].participantId < 6 ? 'B' : 'R', lane:'JUG', name:name});
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

                laneData.push({puuid:puuid, team:searchArrSup[i].id < 6 ? 'B' : 'R', lane:'SUP', name:name});
                participantIdCheck.push(searchArrSup[i].id);    
            }

            // MID
            const searchArrMid1 = new Map<number, number>();
            for(let i:number=0; i<timeArr1.length; i++) {
                for(let j:number=0; j<timeArrTotal.length; j++) {
                    if(timeArrTotal[j][i].position.x < 10000 && timeArrTotal[j][i].position.x > 4000 &&
                       timeArrTotal[j][i].position.y < 10000 && timeArrTotal[j][i].position.y > 4000 ) {
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

                laneData.push({puuid:puuid, team:searchArrMid2[i].id < 6 ? 'B' : 'R', lane:'MID', name:name});               
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

                laneData.push({puuid:puuid, team:searchArrAdc2[i].id < 6 ? 'B' : 'R', lane:'ADC', name:name});               
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

                laneData.push({puuid:puuid, team:searchArrTop[i] < 6 ? 'B' : 'R', lane:'TOP', name:name});               
                participantIdCheck.push(searchArrTop[i]);
            }

            // console.log(laneData)

            result_4 = timeArr1.length && timeArr2.length > 0 ? 'Y' : 'N';
        }
    }

    if(result_1 === 'Y' && result_3 === 'Y' && result_4 === 'Y' && status_1 === 'Y') {
        let tempData:any = {};
        for(let i=0; i<playerArr.length; i++) {
            tempData = await RiotWebSocketRank(playerArr[i].player.puuid, credentials);
            const data:any = Object.values(tempData);
            const highestRankedEntrySR:any = data[6];

            // console.log(playerArr[i].player.puuid);

            rankData.push({
                puuid:playerArr[i].player.puuid,
                wins:highestRankedEntrySR.wins,
                points:highestRankedEntrySR.leaguePoints,
                presentTier:highestRankedEntrySR.tier === '' ? 'NA' : highestRankedEntrySR.tier,
                presentDivision:highestRankedEntrySR.division === '' ? 'NA' : highestRankedEntrySR.division,
                presentHighestTier:highestRankedEntrySR.highestTier === '' ? 'NA' : highestRankedEntrySR.highestTier,
                presentHighestDivision:highestRankedEntrySR.highestDivision === '' ? 'NA' : highestRankedEntrySR.highestDivision,
                previousTier:highestRankedEntrySR.previousSeasonEndTier === '' ? 'NA' : highestRankedEntrySR.previousSeasonEndTier,
                previousDivision:highestRankedEntrySR.previousSeasonEndDivision === '' ? 'NA' : highestRankedEntrySR.previousSeasonEndDivision,
                previousHighestTier:highestRankedEntrySR.previousSeasonHighestTier === '' ? 'NA' : highestRankedEntrySR.previousSeasonHighestTier,
                previousHighestDivision:highestRankedEntrySR.previousSeasonHighestDivision === '' ? 'NA' : highestRankedEntrySR.previousSeasonHighestDivision,
            });
        }
    }
    
    //var isWindows = process.platform;

    return (
        <>
            <MainView gameId={gameId} gameData={gameData} rankData={rankData} laneData={laneData} connection={result_1} credential={credentials} />
        </>
    )
}

export default MainTask;
