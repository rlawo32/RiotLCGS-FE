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
    const playerData:{idx:number; puuid:string; name:string;}[] = [
        {idx:1, puuid:'1e062cfe-c62e-53ef-9145-ab0d6c76d40d', name:'성재'}, 
        {idx:2, puuid:'1127fed4-642a-5b70-bab9-1c7a326ca923', name:'현석'}, 
        {idx:3, puuid:'3a92b571-e69c-5f17-bdca-f9762d456b31', name:'인석'},
        {idx:4, puuid:'3d63dcaf-bfbc-5327-8551-45157712d820', name:'재섭'}, 
        {idx:5, puuid:'50834af7-5fad-538a-83b5-e6a26a4ccfee', name:'대훈'}, 
        {idx:6, puuid:'60e3571d-2b64-5e2b-b9ba-c73789b86639', name:'광호'},
        {idx:7, puuid:'8535ea73-208b-5bff-8b98-c138f2717cf6', name:'해용'}, 
        {idx:8, puuid:'864ff5ac-b218-55fd-94ba-cb9cabe66ce4', name:'승준'}, 
        {idx:9, puuid:'bdfd249c-244c-536a-8c56-fe2ff8e74792', name:'문석'},
        {idx:10, puuid:'fd234707-5d0b-5db9-92e1-9b8fae3b1b84', name:'지훈'}, 
        {idx:11, puuid:'339a9ee7-a515-5c38-bd86-b405adb37310', name:'유민'}, 
        {idx:12, puuid:'1c0748d2-418d-5324-a035-70736d9f6138', name:'정호'},
        {idx:13, puuid:'0d698fc9-7d69-5c0f-8c10-14a827e8de2d', name:'경우'}, 
        {idx:14, puuid:'8c77580d-04d8-5885-94a0-6fea71350fa4', name:'경우'}, 
        {idx:15, puuid:'e6dc5822-34c6-53c7-938f-9da5ae68928e', name:'내색'},
        {idx:16, puuid:'a8815b7d-ff51-5e25-aa0f-a40e4bf998d1', name:'굴비'}, 
        {idx:17, puuid:'2726fdb4-9799-5ca7-8566-33ab32df993b', name:'규창'}, 
        {idx:18, puuid:'bf62f62b-d33d-5315-85d6-89dc2fa26f2b', name:'태훈'},
        {idx:19, puuid:'bf7527a8-d5eb-5e33-9577-491aea8dba47', name:'재희'}, 
        {idx:20, puuid:'47933f05-aa83-5afa-abd6-ca9dd8bfc145', name:'대방'}, 
        {idx:21, puuid:'', name:''},
    ];
  
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

            // gameId = gameArr[0].gameId;
            gameId = 7844570967;

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

            let adNsp:number = -1;
            for(let i:number=0; i<timeArr1.length; i++) {
                const puuid:string = participantIdentities.find((item:any) => item.participantId === timeArr[i].participantId)!.player.puuid;
                const name:string = playerData.find((item) => item.puuid === puuid)!.name;
                let lane:string = '';

                if(timeArr1[i].position.x < 3000 && timeArr1[i].jungleMinionsKilled < 3) {
                    lane = 'TOP';
                } else if(timeArr1[i].level > 1 && ((timeArr1[i].jungleMinionsKilled > 2 && timeArr1[i].minionsKilled < 3) || (timeArr2[i].jungleMinionsKilled > 3 && timeArr2[i].minionsKilled < 5))) {
                    lane = 'JUG';
                } else if(timeArr1[i].position.x > 10000) {
                    if(adNsp === -1){
                        adNsp = timeArr1[i].minionsKilled;
                        lane = adNsp < timeArr1[i].minionsKilled ? 'ADC' : 'SUP' || adNsp < timeArr2[i].minionsKilled ? 'ADC' : 'SUP';
                        adNsp = -1;
                    }
                } else {
                    lane = 'MID';    
                }
                
                laneData.push({puuid:puuid, team:i < 5 ? 'B' : 'R', lane:lane, name:name});
            }
            laneData.forEach((item) => {
                if(item.lane === '') {
                    item.lane = 'SUP';
                }
            })

            result_4 = timeArr.length > 0 ? 'Y' : 'N';
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
