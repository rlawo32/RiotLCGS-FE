import cp from "child_process";
import util from "util";

import MainView from "./MainView";
import RiotWebSocketMatch from "@/app/api/RiotWebSocketMatch";
import RiotWebSocketRank from "@/app/api/RiotWebSocketRank";
import RiotWebSocketLatest from "@/app/api/RiotWebSocketLatest";
import RiotWebSocketTimeline from "@/app/api/RiotWebSocketTimeline";
import RiotWebSocketHistory from "@/app/api/RiotWebSocketHistory";

import { authenticate } from "league-connect";

const MainTask = async () => {
    let gameId:number = 7800181301;
    let gameData:object = {};
    let rankData:{
        puuid:string,
        wins:number,
        points:number,
        presentTier:string,
        presentDivision:string,
        presentHighestTier:string,
        presentHighestDivision:string,
        previousTier:string,
        previousDivision:string,
        previousHighestTier:string,
        previousHighestDivision:string,
    }[] = [];
    const exec = util.promisify(cp.exec);

    const processName:string = "LeagueClientUx";   
    let credentials;
    let playerArr:any = [];
    let result_1:string = "N";
    let result_2:string = "N";
    let result_3:string = "N";
  
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
        console.log(gameLatest);

        if(Object.keys(gameLatest).length !== 0) {
            const data:any = Object.values(gameLatest);
            console.log(data);

            const games:any = Object.values(data[10]);
            console.log(games);
            const gameArr:any = Object.values(games[10]);

            gameId = gameArr[0].gameId;
            console.log(gameId);

            result_2 = gameId.toString.length > 0 ? 'Y' : 'N';
        }
    }
  
    if(result_1 === 'Y' && result_2 === 'Y') {
        const gameDataCheck:object = await RiotWebSocketMatch(gameId, credentials);
        const gameTimeline:object = await RiotWebSocketTimeline(gameId, credentials);

        // console.log(gameTimeline);
        
        if(Object.keys(gameDataCheck).length !== 0) {
            gameData = gameDataCheck;

            const data:any = Object.values(gameData);
            // console.log(data);
            const participantIdentities:any = Object.values(data[10]);
            playerArr = Object.values(participantIdentities);

            result_3 = playerArr.length > 0 ? 'Y' : 'N';
        }
    }

    if(result_1 === 'Y' && result_3 === 'Y') {
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
            <MainView gameId={gameId} gameData={gameData} rankData={rankData} connection={result_1} />
        </>
    )
}

export default MainTask;