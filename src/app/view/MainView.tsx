'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

import * as JsonData from "./JsonData"

const MainView = (props:{gameId:number, gameData:object, rankData:object, connection:string}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [aTeamTop, setATeamTop] = useState<string>("");
    const [aTeamJug, setATeamJug] = useState<string>("");
    const [aTeamMid, setATeamMid] = useState<string>("");
    const [aTeamAdc, setATeamAdc] = useState<string>("");
    const [aTeamSup, setATeamSup] = useState<string>("");
    const [bTeamTop, setBTeamTop] = useState<string>("");
    const [bTeamJug, setBTeamJug] = useState<string>("");
    const [bTeamMid, setBTeamMid] = useState<string>("");
    const [bTeamAdc, setBTeamAdc] = useState<string>("");
    const [bTeamSup, setBTeamSup] = useState<string>("");
    const [jsonText, setJsonText] = useState<string>("");

    const insertDataHandler = ():void => {

        if(props.connection === 'Y') {

            if( aTeamTop.length > 0 && aTeamJug.length > 0 &&
                aTeamMid.length > 0 && aTeamAdc.length > 0 &&
                aTeamSup.length > 0 && bTeamTop.length > 0 &&
                bTeamJug.length > 0 && bTeamMid.length > 0 &&
                bTeamAdc.length > 0 && bTeamSup.length > 0 ) {
                    const riotData:object = {
                        gameData: props.gameData,
                        teamData: [
                            {puuid:'', teamId:100, line:'TOP', name:aTeamTop},
                            {puuid:'', teamId:100, line:'JUG', name:aTeamJug},
                            {puuid:'', teamId:100, line:'MID', name:aTeamMid},
                            {puuid:'', teamId:100, line:'ADC', name:aTeamAdc},
                            {puuid:'', teamId:100, line:'SUP', name:aTeamSup},
                            {puuid:'', teamId:200, line:'TOP', name:bTeamTop},
                            {puuid:'', teamId:200, line:'JUG', name:bTeamJug},
                            {puuid:'', teamId:200, line:'MID', name:bTeamMid},
                            {puuid:'', teamId:200, line:'ADC', name:bTeamAdc},
                            {puuid:'', teamId:200, line:'SUP', name:bTeamSup}
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
        setATeamTop("");
        setATeamJug("");
        setATeamMid("");
        setATeamAdc("");
        setATeamSup("");
        setBTeamTop("");
        setBTeamJug("");
        setBTeamMid("");
        setBTeamAdc("");
        setBTeamSup("");
    }


    const insertJsonHandler = ():string => {
        const jsonData:{rowNum:number, gameId:number, blueTeamTop:string, blueTeamJug:string, blueTeamMid:string, blueTeamAdc:string, blueTeamSup:string, 
            redTeamTop:string, redTeamJug:string, redTeamMid:string, redTeamAdc:string, redTeamSup:string} 
            = 
            {rowNum:JsonData.autoPlayerData.length+1, gameId:props.gameId, blueTeamTop:aTeamTop, blueTeamJug:aTeamJug, blueTeamMid:aTeamMid, blueTeamAdc:aTeamAdc, blueTeamSup:aTeamSup, 
                redTeamTop:bTeamTop, redTeamJug:bTeamJug, redTeamMid:bTeamMid, redTeamAdc:bTeamAdc, redTeamSup:bTeamSup};

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
        for(let i = 0; i < JsonData.autoPlayerData.length; i++) {
            if(JsonData.autoPlayerData[i].gameId === props.gameId) {
                setATeamTop(JsonData.autoPlayerData[i].blueTeamTop);
                setATeamJug(JsonData.autoPlayerData[i].blueTeamJug);
                setATeamMid(JsonData.autoPlayerData[i].blueTeamMid);
                setATeamAdc(JsonData.autoPlayerData[i].blueTeamAdc);
                setATeamSup(JsonData.autoPlayerData[i].blueTeamSup);
                setBTeamTop(JsonData.autoPlayerData[i].redTeamTop);
                setBTeamJug(JsonData.autoPlayerData[i].redTeamJug);
                setBTeamMid(JsonData.autoPlayerData[i].redTeamMid);
                setBTeamAdc(JsonData.autoPlayerData[i].redTeamAdc);
                setBTeamSup(JsonData.autoPlayerData[i].redTeamSup);
                break;
            }
        }
    }, [props.gameId])

    useEffect(() => {
        const jsonText:string = insertJsonHandler();
        setJsonText(jsonText);
    }, [bTeamSup])

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
                    <input type="text" value={aTeamTop} onChange={(e) => setATeamTop(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>JUG</h4>
                    <input type="text" value={aTeamJug} onChange={(e) => setATeamJug(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>MID</h4>
                    <input type="text" value={aTeamMid} onChange={(e) => setATeamMid(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>ADC</h4>
                    <input type="text" value={aTeamAdc} onChange={(e) => setATeamAdc(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>SUP</h4>
                    <input type="text" value={aTeamSup} onChange={(e) => setATeamSup(e.target.value)} placeholder="name" maxLength={3} />
                </div>
                <div>
                    <Image src={"/vs_image.png"} alt={"VS"} height={120} width={120} />
                </div>
                <div className="insert_team team_b">
                    <h3>팀 B (레드팀)</h3>
                    <h4>TOP</h4>
                    <input type="text" value={bTeamTop} onChange={(e) => setBTeamTop(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>JUG</h4>
                    <input type="text" value={bTeamJug} onChange={(e) => setBTeamJug(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>MID</h4>
                    <input type="text" value={bTeamMid} onChange={(e) => setBTeamMid(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>ADC</h4>
                    <input type="text" value={bTeamAdc} onChange={(e) => setBTeamAdc(e.target.value)} placeholder="name" maxLength={3} />
                    <h4>SUP</h4>
                    <input type="text" value={bTeamSup} onChange={(e) => setBTeamSup(e.target.value)} placeholder="name" maxLength={3} />
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