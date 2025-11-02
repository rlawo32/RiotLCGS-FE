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
    let gameId:number = 7800181301;
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
            gameId = 7895822558;

            result_2 = gameId.toString.length > 0 ? 'Y' : 'N';
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
            console.log(participantIdentities);
            console.log(timeArr1);
            console.log(timeArr2);

            let temp:number = -1;
            let radsp:string = '';
            let badsp:string = '';
            for(let i:number=0; i<timeArr1.length; i++) {
                const puuid:string = participantIdentities.find((item:any) => item.participantId === timeArr1[i].participantId)!.player.puuid;
                const name:string = playerData.find((item) => item.puuid === puuid)!.name;
                let lane:string = '';

                if(timeArr1[i].position.x < 3000 && timeArr1[i].jungleMinionsKilled < 3) {
                    lane = 'TOP';
                } else if(timeArr1[i].level > 1 && ((timeArr1[i].jungleMinionsKilled > 2 && timeArr1[i].minionsKilled < 3) || (timeArr2[i].jungleMinionsKilled > 3 && timeArr2[i].minionsKilled < 5))) {
                    lane = 'JUG';
                } else if(timeArr1[i].position.x > 10000) {
                    const cs = timeArr1[i].minionsKilled + timeArr2[i].minionsKilled;
            
                    if (temp === -1) {
                        temp = cs;
                    } else {
                        lane = temp < cs ? 'ADC' : 'SUP';
                        i < 5 ? badsp = lane : radsp = lane;
                        temp = -1;
                    }
                } else {
                    lane = 'MID';    
                }
                
                laneData.push({puuid:puuid, team:i < 5 ? 'B' : 'R', lane:lane, name:name});
            }
            laneData.forEach((item) => {
                if(item.team === 'B' && item.lane === '') {
                    badsp === 'ADC' ? item.lane = 'SUP' : item.lane = 'ADC';
                } else if(item.team === 'R' && item.lane === '') {
                    radsp === 'ADC' ? item.lane = 'SUP' : item.lane = 'ADC';
                }
            })
            console.log(laneData)

            result_4 = timeArr1.length && timeArr2.length > 0 ? 'Y' : 'N';
        }
    }

    if(result_1 === 'Y' && result_3 === 'Y' && result_4 === 'Y') {
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
            <MainView gameId={gameId} gameData={gameData} rankData={rankData} laneData={laneData} connection={result_1} />
        </>
    )
}

export default MainTask;
