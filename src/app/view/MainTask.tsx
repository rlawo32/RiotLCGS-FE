import cp from "child_process";
import util from "util";

import MainView from "./MainView";
import RiotWebSocketMatch from "@/app/api/RiotWebSocketMatch";
import RiotWebSocketRank from "@/app/api/RiotWebSocketRank";
import RiotWebSocketHistory from "@/app/api/RiotWebSocketHistory";

import { authenticate } from "league-connect";

const MainTask = async () => {
    const gameId:number = 7800181301;
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

    const processName = "LeagueClientUx";   
    let credentials;
    let playerArr:any = [];
    let result_1 = "N";
    let result_2 = "N";
  
    const command = `wmic process get caption | findstr ${processName}.exe`;
    const executionOptions = {shell: "powershell"};
  
    try {
        const { stdout: stdout } = await exec(command, executionOptions);
        credentials = await authenticate({
            awaitConnection: true,
            pollInterval: 1000,
        });
        // console.log(credentials);
        result_1 = "Y";
    } catch (err) {
        result_1 = "N";
    }
    // await RiotWebSocketHistory(credentials)
    result_1 === 'Y' ? gameData = await RiotWebSocketMatch(gameId, credentials) : 0;
  
    if(result_1 === 'Y') {
        const data:any = Object.values(gameData);
        // console.log(data);
        const participantIdentities:any = Object.values(data[10]);
        playerArr = Object.values(participantIdentities);
        
        for(let i=0; i<playerArr.length; i++) {
            console.log(playerArr[i].player.puuid);
        }

        result_2 = 'Y';
    }

    if(result_2 === 'Y') {
        let tempData:any = {};
        for(let i=0; i<playerArr.length; i++) {
            tempData = await RiotWebSocketRank(playerArr[i].player.puuid, credentials);
            const data:any = Object.values(tempData);
            const highestRankedEntrySR:any = data[6];

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

    // for(let i=0; i<rankData.length; i++) {
    //     console.log(rankData[i]);
    // }
    
    //var isWindows = process.platform;

    return (
        <>
            <MainView gameId={gameId} gameData={gameData} rankData={rankData} connection={result_2} />
        </>
    )
}

export default MainTask;