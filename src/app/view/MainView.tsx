'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const MainView = (props:{gameId:number, gameData:object, connection:string}) => {

    const [teamA1, setTeamA1] = useState<string>("");
    const [teamA2, setTeamA2] = useState<string>("");
    const [teamA3, setTeamA3] = useState<string>("");
    const [teamA4, setTeamA4] = useState<string>("");
    const [teamA5, setTeamA5] = useState<string>("");
    const [teamB1, setTeamB1] = useState<string>("");
    const [teamB2, setTeamB2] = useState<string>("");
    const [teamB3, setTeamB3] = useState<string>("");
    const [teamB4, setTeamB4] = useState<string>("");
    const [teamB5, setTeamB5] = useState<string>("");

    const insertDataHandler = ():void => {

        if(props.connection === 'Y') {
            const riotData:object = {
                gameData: props.gameData,
                teamData: {
                    teamA1: teamA1,
                    teamA2: teamA2,
                    teamA3: teamA3,
                    teamA4: teamA4,
                    teamA5: teamA5,
                    teamB1: teamB1,
                    teamB2: teamB2,
                    teamB3: teamB3,
                    teamB4: teamB4,
                    teamB5: teamB5
                },
            }
    
            axios({
                method: "POST",
                url: "/local/riot/insertData",
                data: JSON.stringify(riotData),
                headers: {'Content-type': 'application/json'}
            }).then((res):void => {
                if(res.data.result) {
                    alert(res.data.data);
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
 
    useEffect(() => {
        if(teamA1.length >= 3) {

        }
    }, [teamA1, teamA2, teamA3, teamA4, teamA5, teamB1, teamB2, teamB3, teamB4, teamB5]);
 
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
                    <h2>팀 A</h2>
                    <input type="text" value={teamA1} onChange={(e) => setTeamA1(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamA2} onChange={(e) => setTeamA2(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamA3} onChange={(e) => setTeamA3(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamA4} onChange={(e) => setTeamA4(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamA5} onChange={(e) => setTeamA5(e.target.value)} placeholder="name" maxLength={3} />
                </div>
                <div>
                    <Image src={"/vs_image.png"} alt={"VS"} height={120} width={120} />
                </div>
                <div className="insert_team team_b">
                    <h2>팀 B</h2>
                    <input type="text" value={teamB1} onChange={(e) => setTeamB1(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamB2} onChange={(e) => setTeamB2(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamB3} onChange={(e) => setTeamB3(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamB4} onChange={(e) => setTeamB4(e.target.value)} placeholder="name" maxLength={3} />
                    <input type="text" value={teamB5} onChange={(e) => setTeamB5(e.target.value)} placeholder="name" maxLength={3} />
                </div>
            </div>
            <div className="button_section">
                <button onClick={() => insertDataHandler()}>저장</button>
            </div>
        </div>
    )
}
 
export default MainView;