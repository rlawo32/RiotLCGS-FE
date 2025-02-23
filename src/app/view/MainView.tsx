'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const MainView = (props:{gameId:number, gameData:object, rankData:object, connection:string}) => {

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

    const insertDataHandler = ():void => {

        if(props.connection === 'Y') {
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
            alert("롤 클라이언트를 켜주세요.");
        }
    }

    console.log(props.gameData);
    console.log(props.rankData);

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

    return (
        <div className="view_main">
            <h1>커스텀 게임 입력</h1>
            <div className="setting_section">
                {props.connection === 'N' ? <h5>롤 클라이언트가 꺼져있습니다.</h5> : <></>}
                <h3>GAME ID</h3>
                <input type="text" value={props.gameId} readOnly />
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
            </div>
        </div>
    )
}
 
export default MainView;