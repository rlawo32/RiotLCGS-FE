'use client'

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

import * as JsonData from "../config/JsonData"
import { playerData } from "../config/PlayerData";
import TestView from "./TestView";

import type { TypeGameData, TypeParticipantIdentities } from "@/app/types/gameData";
import type { TypeRankData } from "@/app/types/rankData";
import type { TypeLaneData } from "@/app/types/laneData";
import type { TypeSessionData, TypeSessionGameData, TypeSessionTeams } from "@/app/types/sessionData";

import { getPlayerRankData } from "@/app/util/PlayerDataExtraction";
import { playerDataCheck, playerDataLaneConversion } from "@/app/util/PlayerDataAgreeCheck";
import { RiotWebCredentials } from "@/app/config/RiotWebCredentials"

const MainView = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isClient, setIsClient] = useState<boolean>(false);
    const [clientPort, setClientPort] = useState<number>(0);
    const [clientPid, setClientPid] = useState<number>(0);
    const [clientPassword, setClientPassword] = useState<string>("");

    const [gameId, setGameId] = useState<number>(0);
    const [gameType, setGameType] = useState<string>("");
    const [gameData, setGameData] = useState<TypeGameData>();
    const [rankData, setRankData] = useState<TypeRankData[]>([]);
    const [laneData, setLaneData] = useState<TypeLaneData[]>([]);

    const [teamBlueTop, setTeamBlueTop] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamBlueJug, setTeamBlueJug] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamBlueMid, setTeamBlueMid] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamBlueAdc, setTeamBlueAdc] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamBlueSup, setTeamBlueSup] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamRedTop, setTeamRedTop] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamRedJug, setTeamRedJug] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamRedMid, setTeamRedMid] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamRedAdc, setTeamRedAdc] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [teamRedSup, setTeamRedSup] = useState<{puuid:string, name:string}>({puuid:'', name:''});
    const [dataLoad, setDataLoad] = useState<boolean>(false);
    const [jsonText, setJsonText] = useState<string>("");

    const [changePlayerA, setChangePlayerA] = useState<string>(""); // A를 B로 변경
    const [changePlayerB, setChangePlayerB] = useState<string>(""); // A를 B로 변경
    const [changePlayerC, setChangePlayerC] = useState<number>(0); // 변경 정보 카운트

    const [latestGame, setLatestGame] = useState<number>(0);
    const [phaseGame, setPhaseGame] = useState<string>("");

    const [apiTestResult, setApiTestResult] = useState<boolean>(false);
    const [apiTestData, setApiTestData] = useState<{}>({}); 

    const insertDataHandler = ():void => {
        if(!isClient) {
            alert("롤 클라이언트를 켜주세요.");
            return;
        }
        if(gameId > 0 && gameData !== undefined) {
            if( teamBlueTop.name.length > 0 && teamBlueJug.name.length > 0 &&
                teamBlueMid.name.length > 0 && teamBlueAdc.name.length > 0 &&
                teamBlueSup.name.length > 0 && teamRedTop.name.length > 0 &&
                teamRedJug.name.length > 0 && teamRedMid.name.length > 0 &&
                teamRedAdc.name.length > 0 && teamRedSup.name.length > 0 ) {
                    const riotData:object = {
                        gameData: gameData,
                        teamData: [
                            {puuid:teamBlueTop.puuid, teamId:100, line:'TOP', name:teamBlueTop.name},
                            {puuid:teamBlueJug.puuid, teamId:100, line:'JUG', name:teamBlueJug.name},
                            {puuid:teamBlueMid.puuid, teamId:100, line:'MID', name:teamBlueMid.name},
                            {puuid:teamBlueAdc.puuid, teamId:100, line:'ADC', name:teamBlueAdc.name},
                            {puuid:teamBlueSup.puuid, teamId:100, line:'SUP', name:teamBlueSup.name},
                            {puuid:teamRedTop.puuid, teamId:200, line:'TOP', name:teamRedTop.name},
                            {puuid:teamRedJug.puuid, teamId:200, line:'JUG', name:teamRedJug.name},
                            {puuid:teamRedMid.puuid, teamId:200, line:'MID', name:teamRedMid.name},
                            {puuid:teamRedAdc.puuid, teamId:200, line:'ADC', name:teamRedAdc.name},
                            {puuid:teamRedSup.puuid, teamId:200, line:'SUP', name:teamRedSup.name}
                        ]
                    }
            
                    axios({
                        method: "POST",
                        url: "/api/riot/insertGameData",        // REAL
                        // url: "/local/riot/insertGameData",   // TEST
                        data: JSON.stringify(riotData),
                        headers: {'Content-type': 'application/json'}
                    }).then((res):void => {
                        if(res.data.result) {
                            alert(res.data.message);
                            window.location.reload();
                        } else {
                            alert(res.data.message);
                        }
                    }).catch((err):void => {
                        alert("서버를 확인해주세요.");
                        console.log(err.message);
                    })
            } else {
                alert("포지션에 플레이어 이름을 입력해주세요.");
            }
        } else {
            alert("Game ID 또는 Game Data가 없습니다.");
        }
    }

    const insertPlayerDataHandler = ():void => {
        if(!isClient) {
            alert("롤 클라이언트를 켜주세요.");
            return;
        }
        if(gameId > 0 && gameData !== undefined && rankData.length > 0) {
            const riotData:object = {
                gameData: gameData,
                rankData: rankData
            }
            console.log(riotData);
    
            axios({
                method: "POST",
                // url: "/api/riot/insertPlayerData",      // REAL
                url: "/local/riot/insertPlayerData", // TEST
                data: JSON.stringify(riotData),
                headers: {'Content-type': 'application/json'}
            }).then((res):void => {
                if(res.data.result) {
                    alert(res.data.message);
                    window.location.reload();
                } else {
                    alert(res.data.message);
                }
            }).catch((err):void => {
                alert("서버를 확인해주세요.");
                console.log(err.message);
            })
        } else {
            alert("Game ID 또는 Game Data/Rank Data가 없습니다.");
        }
    }

    const callTestHandler = (flag:string):void => {
        const riotData:object = {
            gameData: gameData,
            teamData: [
                {puuid:teamBlueTop.puuid, teamId:100, line:'TOP', name:teamBlueTop.name},
                {puuid:teamBlueJug.puuid, teamId:100, line:'JUG', name:teamBlueJug.name},
                {puuid:teamBlueMid.puuid, teamId:100, line:'MID', name:teamBlueMid.name},
                {puuid:teamBlueAdc.puuid, teamId:100, line:'ADC', name:teamBlueAdc.name},
                {puuid:teamBlueSup.puuid, teamId:100, line:'SUP', name:teamBlueSup.name},
                {puuid:teamRedTop.puuid, teamId:200, line:'TOP', name:teamRedTop.name},
                {puuid:teamRedJug.puuid, teamId:200, line:'JUG', name:teamRedJug.name},
                {puuid:teamRedMid.puuid, teamId:200, line:'MID', name:teamRedMid.name},
                {puuid:teamRedAdc.puuid, teamId:200, line:'ADC', name:teamRedAdc.name},
                {puuid:teamRedSup.puuid, teamId:200, line:'SUP', name:teamRedSup.name}
            ],
            rankData: rankData
        }

        axios({
            method: "POST",
            // url: `/api/riot/${flag}`,       // REAL
            url: `/local/riot/${flag}`,  // TEST
            data: JSON.stringify(riotData),
            headers: {'Content-type': 'application/json'}
        }).then((res):void => {
            if(res.data) {
                setApiTestResult(true);
                setApiTestData(res.data);
            }
        }).catch((err):void => {
            alert("서버를 확인해주세요.");
            console.log(err.message);
        })
    }

    const imageUploadHandler = ():void => {
        axios({
            method: "GET",
            url: `/api/riot/uploadImage`,       // REAL
            // url: `/local/riot/uploadImage`,  // TEST
        }).then(():void => {
        }).catch((err):void => {
            console.log(err.message);
        })
    }

    const patchNoteUpdateHandler = ():void => {
        axios({
            method: "GET",
            // url: `/api/riot/updatePatchNote`,       // REAL
            url: `/local/riot/updatePatchNote?version=16`,  // TEST
        }).then(():void => {
        }).catch((err):void => {
            console.log(err.message);
        })
    }

    const insertJsonHandler = ():string => {
        const jsonData:{rowNum:number, gameId:number, teamBlueTop:string, teamBlueJug:string, teamBlueMid:string, teamBlueAdc:string, teamBlueSup:string, 
            teamRedTop:string, teamRedJug:string, teamRedMid:string, teamRedAdc:string, teamRedSup:string} 
            = 
            {rowNum:JsonData.autoPlayerData.length+1, gameId:gameId, 
                teamBlueTop:teamBlueTop.name, teamBlueJug:teamBlueJug.name, teamBlueMid:teamBlueMid.name, teamBlueAdc:teamBlueAdc.name, teamBlueSup:teamBlueSup.name, 
                teamRedTop:teamRedTop.name, teamRedJug:teamRedJug.name, teamRedMid:teamRedMid.name, teamRedAdc:teamRedAdc.name, teamRedSup:teamRedSup.name};

        const jsonFormatted:string = "{" +  Object.entries(jsonData).map(([key, value]) => key === 'rowNum' || key === 'gameId' ? `${key}:${value}` :`${key}:'${value}'`).join(', ') + "},";
        // console.log("{" + jsonFormatted + "},");

        return jsonFormatted;
    }

    const inputDataCopyHandler = async ():Promise<void> => {
        const input = inputRef.current;
        if (!input) return;

        try {
            await navigator.clipboard.writeText(input.value);
            alert('복사되었습니다.');
        } catch (err) {
            console.error('복사 실패:', err);
        }
    }

    const insertLineData = () => {
        laneData.forEach((item:any, idx:number, arr:any[]) => {
            if(item.team === 'B') {
                if(item.lane === 'TOP') setTeamBlueTop({puuid:item.puuid, name:item.name});
                else if(item.lane === 'JUG') setTeamBlueJug({puuid:item.puuid, name:item.name});
                else if(item.lane === 'MID') setTeamBlueMid({puuid:item.puuid, name:item.name});
                else if(item.lane === 'ADC') setTeamBlueAdc({puuid:item.puuid, name:item.name});
                else if(item.lane === 'SUP') setTeamBlueSup({puuid:item.puuid, name:item.name});
            } else {
                if(item.lane === 'TOP') setTeamRedTop({puuid:item.puuid, name:item.name});
                else if(item.lane === 'JUG') setTeamRedJug({puuid:item.puuid, name:item.name});
                else if(item.lane === 'MID') setTeamRedMid({puuid:item.puuid, name:item.name});
                else if(item.lane === 'ADC') setTeamRedAdc({puuid:item.puuid, name:item.name});
                else if(item.lane === 'SUP') setTeamRedSup({puuid:item.puuid, name:item.name});
            }

            if (idx === arr.length-1) {
                setDataLoad(!dataLoad);
            }
        })
    }
    
    const selectBox = () => {
        return playerData.map((item, i) => {
            const optionItem = (
                i === 0 ?
                    <React.Fragment key={i}>
                        <option value={""}>선택</option>
                        <option value={`${item.puuid}|${item.name}`}>{item.name}</option>
                    </React.Fragment>
                    :
                    <option key={i} value={`${item.puuid}|${item.name}`}>{item.name}</option>
            );

            return optionItem;
        })
    }

    const changeLineData = (playerPuuidA:string, playerPuuidB:string, playerNameB:string) => {
        if(teamBlueTop.puuid === playerPuuidA) {
            setTeamBlueTop({puuid:playerPuuidB, name:playerNameB});
        } else if(teamBlueJug.puuid === playerPuuidA) {
            setTeamBlueJug({puuid:playerPuuidB, name:playerNameB});
        } else if(teamBlueMid.puuid === playerPuuidA) {
            setTeamBlueMid({puuid:playerPuuidB, name:playerNameB});
        } else if(teamBlueAdc.puuid === playerPuuidA) {
            setTeamBlueAdc({puuid:playerPuuidB, name:playerNameB});
        } else if(teamBlueSup.puuid === playerPuuidA) {
            setTeamBlueSup({puuid:playerPuuidB, name:playerNameB});
        } else if(teamRedTop.puuid === playerPuuidA) {
            setTeamRedTop({puuid:playerPuuidB, name:playerNameB});
        } else if(teamRedJug.puuid === playerPuuidA) {
            setTeamRedJug({puuid:playerPuuidB, name:playerNameB});
        } else if(teamRedMid.puuid === playerPuuidA) {
            setTeamRedMid({puuid:playerPuuidB, name:playerNameB});
        } else if(teamRedAdc.puuid === playerPuuidA) {
            setTeamRedAdc({puuid:playerPuuidB, name:playerNameB});
        } else if(teamRedSup.puuid === playerPuuidA) {
            setTeamRedSup({puuid:playerPuuidB, name:playerNameB});
        } 

        const requestPlayerNickname = async () => {
            try {
                if(!isClient) {
                    alert("롤 클라이언트를 켜주세요.");
                    return;
                }
                const response = await fetch('/api/RiotWebSocketNickname', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        credentials: {
                            ...RiotWebCredentials,
                            port: clientPort,
                            pid: clientPid,
                            password: clientPassword,
                        },
                        puuid: playerPuuidB,
                    }),
                });
        
                if (!response.ok) throw new Error('Network response was not ok. Not found Nickname');

                const responseData = await response.json();
                const playerNicknameB = responseData.gameName;
                const playerTagLineB = responseData.tagLine;
                const playerProfileIcon = responseData.profileIconId;
                const playerSummonerId = responseData.summonerId;
                console.log("변경할 정보 => 닉네임:", playerNicknameB + " / 태그:" + playerTagLineB + " / 아이콘:" + playerProfileIcon + " / ID:" + playerSummonerId);

                gameData.participantIdentities.forEach((item:TypeParticipantIdentities) => {
                    if(item.player.puuid === playerPuuidA) {
                        item.player.puuid = playerPuuidB;
                        item.player.gameName = playerNicknameB;
                        item.player.tagLine = playerTagLineB;
                        item.player.profileIcon = playerProfileIcon;
                        item.player.summonerId = playerSummonerId;
                    }
                })
                // return await response.json();
            } catch (error) {
                const msg = error instanceof Error ? error.message : '알 수 없는 오류';
                console.error(`오류 발생: ${msg}`);
            } 
        };
        requestPlayerNickname();
    }

    const changePlayerData = () => {
        const changePlayerPuuidA:string = changePlayerA;
        const playerPuuidA:string = changePlayerPuuidA.split("|")[0];
        const changePlayerPuuidB:string = changePlayerB;
        const playerPuuidB:string = changePlayerPuuidB.split("|")[0];
        const playerNameB:string = changePlayerPuuidB.split("|")[1];
        const storageData:string = changePlayerPuuidA + "&" + changePlayerPuuidB;

        if(teamBlueTop.puuid === playerPuuidB || teamBlueJug.puuid === playerPuuidB || 
           teamBlueMid.puuid === playerPuuidB || teamBlueAdc.puuid === playerPuuidB || 
           teamBlueSup.puuid === playerPuuidB || teamRedTop.puuid === playerPuuidB || 
           teamRedJug.puuid === playerPuuidB || teamRedMid.puuid === playerPuuidB || 
           teamRedAdc.puuid === playerPuuidB || teamRedSup.puuid === playerPuuidB) {
            alert('이미 존재하는 플레이어입니다.');
            return;
        }
        sessionStorage.setItem(`change_${changePlayerC}`, storageData);
        sessionStorage.setItem(`change_count`, (changePlayerC+1).toString());
        setChangePlayerC(Number(sessionStorage.getItem('change_count')));

        changeLineData(playerPuuidA, playerPuuidB, playerNameB);
        // const result = playerData.map(player => {
        //     if(player.puuid === changePlayerPuuidB) {
        //         return { ...player, puuid: changePlayerPuuidA, nickname: changePlayerNicknameA};
        //     }
        //     return player;
        // })
    }

    const storageDataRemove = (removeItem:string) => {
        const playerPuuidA:string|undefined = sessionStorage.getItem(removeItem)?.split("&")[1].split("|")[0];
        const playerPuuidB:string|undefined = sessionStorage.getItem(removeItem)?.split("&")[0].split("|")[0];
        const playerNameB:string|undefined = sessionStorage.getItem(removeItem)?.split("&")[0].split("|")[1];
        if(playerPuuidA !== undefined && playerPuuidB !== undefined && playerNameB !== undefined) {
            changeLineData(playerPuuidA, playerPuuidB, playerNameB);
            sessionStorage.removeItem(removeItem);
        }
    }

    const storageDataList = () => {
        const result:any[] = [];
        for(let i:number=0; i<Number(sessionStorage.getItem("change_count")); i++) {
            const storageData:string|null = sessionStorage.getItem(`change_${i}`);
            if(storageData) {
                const playerNameA:string = storageData.split("&")[0].split("|")[1];
                const playerNameB:string = storageData.split("&")[1].split("|")[1];
                result.push(<div key={i}>
                    {playerNameA}{"->"}{playerNameB} <button onClick={() => storageDataRemove(`change_${i}`)}>X</button>
                </div>);
            }
        }
        return result;
    }

    const requestGameId = async (type:string) => {
        try {
            if(!isClient) {
                alert("롤 클라이언트를 켜주세요.");
                return;
            }
            const response = await fetch('/api/RiotWebSocketGameLatest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credentials: {
                        ...RiotWebCredentials,
                        port: clientPort,
                        pid: clientPid,
                        password: clientPassword,
                    },
                }),
            });
    
            if (!response.ok) throw new Error('Network response was not ok. Not found Newgame');

            const responseData = await response.json();
            setGameId(responseData.gameId);
            setGameType(responseData.gameType);
            if(type === 'N') {
                setLatestGame(responseData.gameId);
            } else {
                return responseData.gameId;
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    const requestGameData = async () => {
        try {
            if(!isClient) {
                alert("롤 클라이언트를 켜주세요.");
                return;
            }
            if(gameId > 0) {
                const response = await fetch('/api/RiotWebSocketGameData', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credentials: {
                            ...RiotWebCredentials,
                            port: clientPort,
                            pid: clientPid,
                            password: clientPassword,
                        },
                        gameId: gameId,
                    }),
                });

                const resGameData = await response.json();
                setGameData(resGameData.gameData);
                setLaneData(resGameData.laneData);
                if(resGameData.playerArr.length > 0) {
                    getPlayerRankData(resGameData.playerArr, clientPort, clientPid, clientPassword).then((rankData) => {
                        setRankData(rankData);
                    });
                }
            } else {
                alert("게임 ID를 입력해주세요.");
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    const requestGameFlow = async (type:string) => {
        try {
            if(!isClient) {
                alert("롤 클라이언트를 켜주세요.");
                return;
            }
            const response = await fetch('/api/RiotWebSocketGameFlow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credentials: {
                        ...RiotWebCredentials,
                        port: clientPort,
                        pid: clientPid,
                        password: clientPassword,
                    },
                }),
            });
    
            if (!response.ok) throw new Error('Network response was not ok. Not found GameFlow');

            const responseData = await response.json();

            if(type === 'N') {
                setPhaseGame(responseData);
            } else {
                return responseData;
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    const requestGameSession = async () => {
        try {
            if(!isClient) {
                alert("롤 클라이언트를 켜주세요.");
                return;
            }
            // const response = await fetch('/api/RiotWebSocketGameSession', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         credentials: {
            //             ...RiotWebCredentials,
            //             port: clientPort,
            //             pid: clientPid,
            //             password: clientPassword,
            //         },
            //     }),
            // });

            // const responseData:TypeSessionData = await response.json();

            // const inProgressGameData:TypeSessionGameData = responseData.gameData;
            // const inProgressGameId:number = inProgressGameData.gameId;
            // const teamOne:TypeSessionTeams[] = inProgressGameData.teamOne;
            // const teamTwo:TypeSessionTeams[] = inProgressGameData.teamTwo;
            // console.log(teamOne);
            // console.log(teamTwo);

            // if(teamOne.length >= 5 && teamTwo.length >= 5) {
            if(isClient) {                
                const sessionTeamData:object = {
                    // teamBlue: [
                    //     {puuid:teamOne[0].puuid, lane:playerDataLaneConversion(teamOne[0].selectedPosition), championId:teamOne[0].championId},
                    //     {puuid:teamOne[1].puuid, lane:playerDataLaneConversion(teamOne[1].selectedPosition), championId:teamOne[1].championId},
                    //     {puuid:teamOne[2].puuid, lane:playerDataLaneConversion(teamOne[2].selectedPosition), championId:teamOne[2].championId},
                    //     {puuid:teamOne[3].puuid, lane:playerDataLaneConversion(teamOne[3].selectedPosition), championId:teamOne[3].championId},
                    //     {puuid:teamOne[4].puuid, lane:playerDataLaneConversion(teamOne[4].selectedPosition), championId:teamOne[4].championId},
                    // ],
                    // teamRed: [
                    //     {puuid:teamTwo[0].puuid, lane:playerDataLaneConversion(teamTwo[0].selectedPosition), championId:teamTwo[0].championId},
                    //     {puuid:teamTwo[1].puuid, lane:playerDataLaneConversion(teamTwo[1].selectedPosition), championId:teamTwo[1].championId},
                    //     {puuid:teamTwo[2].puuid, lane:playerDataLaneConversion(teamTwo[2].selectedPosition), championId:teamTwo[2].championId},
                    //     {puuid:teamTwo[3].puuid, lane:playerDataLaneConversion(teamTwo[3].selectedPosition), championId:teamTwo[3].championId},
                    //     {puuid:teamTwo[4].puuid, lane:playerDataLaneConversion(teamTwo[4].selectedPosition), championId:teamTwo[4].championId},
                    // ]
                    teamBlue: [
                        {puuid:'bdfd249c-244c-536a-8c56-fe2ff8e74792', championId:106, lane:playerDataLaneConversion('TOP')},
                        {puuid:'1e062cfe-c62e-53ef-9145-ab0d6c76d40d', championId:59, lane:playerDataLaneConversion('JUNGLE')},
                        {puuid:'3d63dcaf-bfbc-5327-8551-45157712d820', championId:84, lane:playerDataLaneConversion('MIDDLE')},
                        {puuid:'60e3571d-2b64-5e2b-b9ba-c73789b86639', championId:18, lane:playerDataLaneConversion('BOTTOM')},
                        {puuid:'1127fed4-642a-5b70-bab9-1c7a326ca923', championId:111, lane:playerDataLaneConversion('UTILITY')},
                    ],
                    teamRed: [
                        {puuid:'50834af7-5fad-538a-83b5-e6a26a4ccfee', championId:516, lane:playerDataLaneConversion('TOP')},
                        {puuid:'864ff5ac-b218-55fd-94ba-cb9cabe66ce4', championId:950, lane:playerDataLaneConversion('JUNGLE')},
                        {puuid:'1c0748d2-418d-5324-a035-70736d9f6138', championId:517, lane:playerDataLaneConversion('MIDDLE')},
                        {puuid:'fd234707-5d0b-5db9-92e1-9b8fae3b1b84', championId:51, lane:playerDataLaneConversion('BOTTOM')},
                        {puuid:'8535ea73-208b-5bff-8b98-c138f2717cf6', championId:161, lane:playerDataLaneConversion('UTILITY')},
                    ]
                }
                await fetch('/api/RiotWebSocketRealTimeInfo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionTeamData: sessionTeamData,
                    }),
                });
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    const requestGameConnection = async () => {
        try {
            const response = await fetch('/api/RiotWebSocketConnection', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();

            if(responseData.status === 200) {
                setClientPort(responseData.port);
                setClientPid(responseData.pid);
                setClientPassword(responseData.password);
                setIsClient(true);
            } else {
                setClientPort(0);
                setClientPid(0);
                setClientPassword("");
                setIsClient(false);
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    const requestPlayerLevel = async () => {
        try {
            if(!isClient) {
                alert("롤 클라이언트를 켜주세요.");
                return;
            }
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
                    puuid: 'bf62f62b-d33d-5315-85d6-89dc2fa26f2b',
                }),
            });
    
            if (!response.ok) throw new Error('Network response was not ok. Not found GameFlow');

            const responseData = await response.json();

            console.log(responseData.summonerLevel);
        } catch (error) {
            const msg = error instanceof Error ? error.message : '알 수 없는 오류';
            console.error(`오류 발생: ${msg}`);
        } 
    }

    useEffect(() => {
        let timerId:any;
        let isStopped:boolean = false;
        let pollingCount:number = 0;

        const newGamePolling = async () => {
            if (isStopped) return;

            const newGameId = await requestGameId('Y');
            console.log(`newGameId : ${newGameId}`);

            if (newGameId !== latestGame) {
                console.log(`${latestGame} === ${newGameId} stopping polling.`);
                setLatestGame(newGameId);
                return; 
            }

            console.log(`NewGame Polling... [count:${pollingCount++}]`);
            timerId = setTimeout(newGamePolling, 60000);
        };

        const newPhasePolling = async () => {
            if (isStopped) return;

            const newPhase = await requestGameFlow('Y');
            console.log(`Gameflow : ${newPhase}`);
            if(newPhase === 'InProgress') {
                console.log(`newPhase stopping polling.`);
                requestGameSession();
                return; 
            }

            console.log(`newPhase Polling... [count:${pollingCount++}]`);
            timerId = setTimeout(newPhasePolling, 5000);
        };

        // newGamePolling();
        console.log(isClient)
        if(isClient) {
            newPhasePolling();
        }

        return () => {
            isStopped = true;
            clearTimeout(timerId);
        };
    }, [gameId]);

    useEffect(() => {
        if(sessionStorage.getItem("change_count") !== null) {
            setChangePlayerC(Number(sessionStorage.getItem("change_count")));
        }
        requestGameConnection();
        // requestGameId('N');
    }, [])

    useEffect(() => {
        insertLineData();
        playerDataCheck(gameId, laneData);
    }, [laneData])

    useEffect(() => {
        for(let i = 0; i < JsonData.autoPlayerData.length; i++) {
            if(JsonData.autoPlayerData[i].gameId === gameId) {
                setTeamBlueTop({puuid:'', name:JsonData.autoPlayerData[i].teamBlueTop});
                setTeamBlueJug({puuid:'', name:JsonData.autoPlayerData[i].teamBlueJug});
                setTeamBlueMid({puuid:'', name:JsonData.autoPlayerData[i].teamBlueMid});
                setTeamBlueAdc({puuid:'', name:JsonData.autoPlayerData[i].teamBlueAdc});
                setTeamBlueSup({puuid:'', name:JsonData.autoPlayerData[i].teamBlueSup});
                setTeamRedTop({puuid:'', name:JsonData.autoPlayerData[i].teamRedTop});
                setTeamRedJug({puuid:'', name:JsonData.autoPlayerData[i].teamRedJug});
                setTeamRedMid({puuid:'', name:JsonData.autoPlayerData[i].teamRedMid});
                setTeamRedAdc({puuid:'', name:JsonData.autoPlayerData[i].teamRedAdc});
                setTeamRedSup({puuid:'', name:JsonData.autoPlayerData[i].teamRedSup});
                break;
            }
        }
    }, [gameId])

    useEffect(() => {
        const jsonText:string = insertJsonHandler();
        setJsonText(jsonText);

        if(Number(sessionStorage.getItem('change_count')) > 0) {
            for(let i:number=0; i<sessionStorage.length; i++) {
                const storageData:string|null = sessionStorage.getItem(`change_${i}`);
                if(storageData) {
                    const playerPuuidA:string = storageData.split("&")[0].split("|")[0];
                    const playerPuuidB:string = storageData.split("&")[1].split("|")[0];
                    const playerNameB:string = storageData.split("&")[1].split("|")[1];
                    changeLineData(playerPuuidA, playerPuuidB, playerNameB);
                }
            }
        }
    }, [dataLoad])

    return (
        <div className="view_main">
            {apiTestResult ? <TestView data={apiTestData} onClose={() => setApiTestResult(false)} /> : <></>}
            <h1>커스텀 게임 입력</h1>
            <div className="setting_section">
                <div className="jsonText_section">
                    <h3>CHANGE DATA</h3>
                    <div className="control_box">
                        <select onChange={(e) => setChangePlayerA(e.target.value)}>
                            {selectBox()}
                        </select>
                        &nbsp;{"->"}&nbsp;
                        <select onChange={(e) => setChangePlayerB(e.target.value)}>
                            {selectBox()}
                        </select>
                        <button onClick={() => changePlayerData()}>변경</button>
                    </div>
                </div>
                <div className="gameId_section">
                    <h3>GAME ID</h3>
                    <div className="control_box">
                        <input type="text" value={gameId} onChange={(e) => setGameId(e.target.valueAsNumber)} />
                        {/* {!client ? <h5>롤 클라이언트가 꺼져있습니다.</h5> : <></>} */}
                    </div>
                    <div><h5>{gameType}</h5></div>
                </div>
                <div className="jsonText_section">
                    <h3>JSON DATA</h3>
                    <div className="control_box">
                        <input type="text" value={jsonText} ref={inputRef} readOnly={true} />
                        <button onClick={() => inputDataCopyHandler()}>복사</button>
                    </div>
                </div>
            </div>
            <div className="insert_section">
                <div className="insert_team team_a">
                    <h3>팀 A (블루팀)</h3>
                    <h4>TOP</h4>
                    <input type="text" value={teamBlueTop.name} onChange={(e) => setTeamBlueTop({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>JUG</h4>
                    <input type="text" value={teamBlueJug.name} onChange={(e) => setTeamBlueJug({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>MID</h4>
                    <input type="text" value={teamBlueMid.name} onChange={(e) => setTeamBlueMid({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>ADC</h4>
                    <input type="text" value={teamBlueAdc.name} onChange={(e) => setTeamBlueAdc({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>SUP</h4>
                    <input type="text" value={teamBlueSup.name} onChange={(e) => setTeamBlueSup({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                </div>
                <div className="insert_info">
                    <div className="change_info">
                        {changePlayerC > 0 ? storageDataList() : <></>}
                    </div>
                    <Image src={"/vs_image.png"} alt={"VS"} height={120} width={120} />
                </div>
                <div className="insert_team team_b">
                    <h3>팀 B (레드팀)</h3>
                    <h4>TOP</h4>
                    <input type="text" value={teamRedTop.name} onChange={(e) => setTeamRedTop({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>JUG</h4>
                    <input type="text" value={teamRedJug.name} onChange={(e) => setTeamRedJug({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>MID</h4>
                    <input type="text" value={teamRedMid.name} onChange={(e) => setTeamRedMid({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>ADC</h4>
                    <input type="text" value={teamRedAdc.name} onChange={(e) => setTeamRedAdc({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                    <h4>SUP</h4>
                    <input type="text" value={teamRedSup.name} onChange={(e) => setTeamRedSup({puuid:'', name:e.target.value})} placeholder="name" maxLength={3} />
                </div>
            </div>
            <div className="button_section">
                <button onClick={() => insertDataHandler()}>게임 저장</button>
                <button onClick={() => insertPlayerDataHandler()}>플레이어 저장</button>
                <button onClick={() => callTestHandler('apiTest')}>API TEST</button>
                <button onClick={() => callTestHandler('insertTest')}>INSERT TEST</button>
                <button onClick={() => imageUploadHandler()}>IMAGE UPLOAD</button>
                <button onClick={() => patchNoteUpdateHandler()}>패치노트 업데이트</button>
                <button onClick={() => requestGameData()}>게임 Data 가져오기</button>
                <button onClick={() => requestGameId('Y')}>게임 ID 가져오기</button>
                <button onClick={() => requestGameFlow('Y')}>GAMEFLOW TEST</button>
                <button onClick={() => requestGameSession()}>SESSION TEST</button>
                <button onClick={() => requestPlayerLevel()}>LEVEL TEST</button>
                
            </div>
            <div className="jsonText_section">
            </div>
        </div>
    )
}
 
export default MainView;