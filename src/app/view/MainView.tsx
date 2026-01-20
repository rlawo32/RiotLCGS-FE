'use client'

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

import * as JsonData from "./JsonData"
import { playerData } from "./PlayerData";

const MainView = (props:{gameId:number, gameData:object, rankData:object, laneData:{puuid:string; team:string; lane:string; name:string;}[], connection:string, credential:any}) => {
    const inputRef = useRef<HTMLInputElement>(null);

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

    const insertDataHandler = ():void => {
        if(props.connection === 'Y') {
            if( teamBlueTop.name.length > 0 && teamBlueJug.name.length > 0 &&
                teamBlueMid.name.length > 0 && teamBlueAdc.name.length > 0 &&
                teamBlueSup.name.length > 0 && teamRedTop.name.length > 0 &&
                teamRedJug.name.length > 0 && teamRedMid.name.length > 0 &&
                teamRedAdc.name.length > 0 && teamRedSup.name.length > 0 ) {
                    const riotData:object = {
                        gameData: props.gameData,
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
                        url: "/local/riot/insertData",
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
            alert("롤 클라이언트를 켜주세요.");
        }
    }

    const insertPlayerDataHandler = ():void => {
        if(props.connection === 'Y') {
            const riotData:object = {
                gameData: props.gameData,
                rankData: props.rankData
            }
    
            axios({
                method: "POST",
                url: "/local/riot/insertPlayerData",
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
            alert("롤 클라이언트를 켜주세요.");
        }
    }

    const insertTestHandler = ():void => {
        console.log(props.gameData);

        const riotData:object = {
            gameData: props.gameData,
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
            url: "/local/riot/test",
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
    }

    const insertResetHandler = ():void => {
        setTeamBlueTop({puuid:'', name:''});
        setTeamBlueJug({puuid:'', name:''});
        setTeamBlueMid({puuid:'', name:''});
        setTeamBlueAdc({puuid:'', name:''});
        setTeamBlueSup({puuid:'', name:''});
        setTeamRedTop({puuid:'', name:''});
        setTeamRedJug({puuid:'', name:''});
        setTeamRedMid({puuid:'', name:''});
        setTeamRedAdc({puuid:'', name:''});
        setTeamRedSup({puuid:'', name:''});
    }

    const insertJsonHandler = ():string => {
        const jsonData:{rowNum:number, gameId:number, teamBlueTop:string, teamBlueJug:string, teamBlueMid:string, teamBlueAdc:string, teamBlueSup:string, 
            teamRedTop:string, teamRedJug:string, teamRedMid:string, teamRedAdc:string, teamRedSup:string} 
            = 
            {rowNum:JsonData.autoPlayerData.length+1, gameId:props.gameId, 
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
        props.laneData.forEach((item:any, idx:number, arr:any[]) => {
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
                const response = await fetch('/api/RiotWebSocketNickname', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        puuid: playerPuuidB, 
                        credentials: props.credential, 
                    }),
                });
        
                if (!response.ok) throw new Error('Network response was not ok. Not found Nickname');

                const gameData = (props.gameData as any);
                const responseData = await response.json();
                const playerNicknameB = responseData.gameName;
                const playerTagLineB = responseData.tagLine;
                const playerProfileIcon = responseData.profileIconId;
                const playerSummonerId = responseData.summonerId;
                console.log("변경할 정보 => 닉네임:", playerNicknameB + " / 태그:" + playerTagLineB + " / 아이콘:" + playerProfileIcon + " / ID:" + playerSummonerId);

                gameData.participantIdentities.forEach((item:any) => {
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
        sessionStorage.removeItem(removeItem);
        insertLineData();
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

    useEffect(() => {
        if(JsonData.autoPlayerData.find((item) => item.gameId === props.gameId) !== undefined) {
            const idx:number = JsonData.autoPlayerData.findIndex((item) => item.gameId === props.gameId);
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
            const newData:{puuid:string; team:string; lane:string; name:string;}[] = props.laneData;

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
    }, [])

    useEffect(() => {
        if(sessionStorage.getItem("change_count") !== null) {
            setChangePlayerC(Number(sessionStorage.getItem("change_count")));
        }
        insertLineData();
    }, [])

    useEffect(() => {
        for(let i = 0; i < JsonData.autoPlayerData.length; i++) {
            if(JsonData.autoPlayerData[i].gameId === props.gameId) {
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
    }, [props.gameId])

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
                        <input type="text" value={props.gameId} readOnly />
                        {props.connection === 'N' ? <h5>롤 클라이언트가 꺼져있습니다.</h5> : <></>}
                    </div>
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
                <button onClick={() => insertTestHandler()}>TEST</button>
                <button onClick={() => insertResetHandler()}>초기화</button>
            </div>
            <div className="jsonText_section">
            </div>
        </div>
    )
}
 
export default MainView;