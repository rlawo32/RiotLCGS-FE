'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

import * as JsonData from "./JsonData"

const MainView = (props:{gameId:number, gameData:object, rankData:object, laneData:Object[], connection:string}) => {
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
    const [jsonText, setJsonText] = useState<string>("");

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
        axios({
            method: "POST",
            url: "/local/riot/test",
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
            {rowNum:JsonData.autoPlayerData.length+1, gameId:props.gameId, teamBlueTop:teamBlueTop, teamBlueJug:teamBlueJug, teamBlueMid:teamBlueMid, teamBlueAdc:teamBlueAdc, teamBlueSup:teamBlueSup, 
                teamRedTop:teamRedTop, teamRedJug:teamRedJug, teamRedMid:teamRedMid, teamRedAdc:teamRedAdc, teamRedSup:teamRedSup};

        const jsonFormatted:string = "{" +  Object.entries(jsonData).map(([key, value]) => key === 'rowNum' || key === 'gameId' ? `${key}:${value}` :`${key}:'${value}'`).join(', ') + "},";
        console.log("{" + jsonFormatted + "},");

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

    useEffect(() => {
        props.laneData.forEach((item:any) => {
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
        })
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
    }, [teamRedSup])

    return (
        <div className="view_main">
            <h1>커스텀 게임 입력</h1>
            <div className="setting_section">
                <div className="gameId_section">
                    <h3>GAME ID</h3>
                    <input type="text" value={props.gameId} readOnly />
                    {props.connection === 'N' ? <h5>롤 클라이언트가 꺼져있습니다.</h5> : <></>}
                </div>
                <div className="jsonText_section">
                    <h3>JSON DATA</h3>
                    <div>
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
                <div>
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
