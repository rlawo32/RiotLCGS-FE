import { RiotWebCredentials } from "@/app/config/RiotWebCredentials"

const RiotWebSocketRank = async (puuid:string, clientPort: number, clientPid: number, clientPassword: string) => {
    const response = await fetch('/api/RiotWebSocketPlayerRank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credentials: {
                ...RiotWebCredentials,
                port: clientPort,
                pid: clientPid,
                password: clientPassword,
            },
            puuid: puuid,
        }),
    });

    return await response.json();
}

const RiotWebSocketLevel = async (puuid:string, clientPort: number, clientPid: number, clientPassword: string) => {
    const response = await fetch('/api/RiotWebSocketPlayerLevel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credentials: {
                ...RiotWebCredentials,
                port: clientPort,
                pid: clientPid,
                password: clientPassword,
            },
            puuid: puuid,
        }),
    });

    return await response.json();
}

export const getPlayerRankData = async (playerArr: any[], clientPort: number, clientPid: number, clientPassword: string) => {
    const rankData:{
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
        level:number;
    }[] = [];
    let tempData:any = {};
    for(let i=0; i<playerArr.length; i++) {
        tempData = await RiotWebSocketRank(playerArr[i].player.puuid, clientPort, clientPid, clientPassword);
        const data:any = Object.values(tempData);
        const highestRankedEntrySR:any = data[6];
        const resLevelData = await RiotWebSocketLevel(playerArr[i].player.puuid, clientPort, clientPid, clientPassword);
        const playerLevel = resLevelData.summonerLevel

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
            level:playerLevel,
        });
    }

    return rankData;
}

export const getPlayerLevelData = async (playerArr: any[], clientPort: number, clientPid: number, clientPassword: string) => {
    const levelData:{
        puuid:string;
        level:number;
    }[] = [];
    for(let i=0; i<playerArr.length; i++) {
        const responseData = await RiotWebSocketLevel(playerArr[i].player.puuid, clientPort, clientPid, clientPassword);

        // console.log(playerArr[i].player.puuid);

        levelData.push({
            puuid:playerArr[i].player.puuid,
            level:responseData.summonerLevel,
        });
    }

    return levelData;
}