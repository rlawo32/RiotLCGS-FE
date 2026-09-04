import type { TypeLaneData } from "@/app/types/laneData";
import * as JsonData from "@/app/config/JsonData"

export const playerDataLaneConversion = (lane:string) => {
    let result:string = "";
    if(lane === 'TOP') {
        result = "TOP";
    } else if(lane === 'JUNGLE') {
        result = "JUG";
    } else if(lane === 'MIDDLE') {
        result = "MID";
    } else if(lane === 'BOTTOM') {
        result = "ADC";
    } else if(lane === 'UTILITY') {
        result = "SUP";
    }

    return result;
}

export const playerDataCheck = async (gameId:number, laneData: TypeLaneData[]) => {
    if(JsonData.autoPlayerData.find((item) => item.gameId === gameId) !== undefined) {
        const idx:number = JsonData.autoPlayerData.findIndex((item) => item.gameId === gameId);
        const oldData:{
            rowNum:number,
            gameId:number,
            teamBlueTop:string,
            teamBlueJug:string,
            teamBlueMid:string,
            teamBlueAdc:string,
            teamBlueSup:string,
            teamRedTop:string,
            teamRedJug:string,
            teamRedMid:string,
            teamRedAdc:string,
            teamRedSup:string
        } = JsonData.autoPlayerData[idx];
        const newData:TypeLaneData[] = laneData;

        const oldBlueTop:string = oldData.teamBlueTop;
        const newBlueTop:string|undefined = newData.find((item) => item.team === 'B' && item.lane === 'TOP')?.name;
        if(oldBlueTop === newBlueTop) {
            console.log(`BLUE TOP 일치!`);
        } else {
            console.log(`${oldBlueTop} / ${newBlueTop} : BLUE TOP 불일치!`);
        }

        const oldBlueJug:string = oldData.teamBlueJug;
        const newBlueJug:string|undefined = newData.find((item) => item.team === 'B' && item.lane === 'JUG')?.name;
        if(oldBlueJug === newBlueJug) {
            console.log(`BLUE JUG 일치!`);
        } else {
            console.log(`${oldBlueJug} / ${newBlueJug} : BLUE JUG 불일치!`);
        }

        const oldBlueMid:string = oldData.teamBlueMid;
        const newBlueMid:string|undefined = newData.find((item) => item.team === 'B' && item.lane === 'MID')?.name;
        if(oldBlueMid === newBlueMid) {
            console.log(`BLUE MID 일치!`);
        } else {
            console.log(`${oldBlueMid} / ${newBlueMid} : BLUE MID 불일치!`);
        }

        const oldBlueAdc:string = oldData.teamBlueAdc;
        const newBlueAdc:string|undefined = newData.find((item) => item.team === 'B' && item.lane === 'ADC')?.name;
        if(oldBlueAdc === newBlueAdc) {
            console.log(`BLUE ADC 일치!`);
        } else {
            console.log(`${oldBlueAdc} / ${newBlueAdc} : BLUE ADC 불일치!`);
        }

        const oldBlueSup:string = oldData.teamBlueSup;
        const newBlueSup:string|undefined = newData.find((item) => item.team === 'B' && item.lane === 'SUP')?.name;
        if(oldBlueSup === newBlueSup) {
            console.log(`BLUE SUP 일치!`);
        } else {
            console.log(`${oldBlueSup} / ${newBlueSup} : BLUE SUP 불일치!`);
        }

        const oldRedTop:string = oldData.teamRedTop;
        const newRedTop:string|undefined = newData.find((item) => item.team === 'R' && item.lane === 'TOP')?.name;
        if(oldRedTop === newRedTop) {
            console.log(`RED TOP 일치!`);
        } else {
            console.log(`${oldRedTop} / ${newRedTop} : RED TOP 불일치!`);
        }

        const oldRedJug:string = oldData.teamRedJug;
        const newRedJug:string|undefined = newData.find((item) => item.team === 'R' && item.lane === 'JUG')?.name;
        if(oldRedJug === newRedJug) {
            console.log(`RED JUG 일치!`);
        } else {
            console.log(`${oldRedJug} / ${newRedJug} : RED JUG 불일치!`);
        }

        const oldRedMid:string = oldData.teamRedMid;
        const newRedMid:string|undefined = newData.find((item) => item.team === 'R' && item.lane === 'MID')?.name;
        if(oldRedMid === newRedMid) {
            console.log(`RED MID 일치!`);
        } else {
            console.log(`${oldRedMid} / ${newRedMid} : RED MID 불일치!`);
        }

        const oldRedAdc:string = oldData.teamRedAdc;
        const newRedAdc:string|undefined = newData.find((item) => item.team === 'R' && item.lane === 'ADC')?.name;
        if(oldRedAdc === newRedAdc) {
            console.log(`RED ADC 일치!`);
        } else {
            console.log(`${oldRedAdc} / ${newRedAdc} : RED ADC 불일치!`);
        }

        const oldRedSup:string = oldData.teamRedSup;
        const newRedSup:string|undefined = newData.find((item) => item.team === 'R' && item.lane === 'SUP')?.name;
        if(oldRedSup === newRedSup) {
            console.log(`RED SUP 일치!`);
        } else {
            console.log(`${oldRedSup} / ${newRedSup} : RED SUP 불일치!`);
        }
    } else {
        console.log(`JSON DATA 없음!`)
    }
}