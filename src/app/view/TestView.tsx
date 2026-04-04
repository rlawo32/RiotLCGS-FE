'use client'

const TestView = (props : {data:any, onClose: () => void}) => {

    return (
        <div className="modal-overlay" onClick={props.onClose}>
            <div className="teams-container">
                <div className="team-box blue">
                    <h3 className="team-name">Blue Team</h3>
                    <div className="player-list">
                        <p><span>TOP</span> {props.data["BlueTeam-TOP"]}</p>
                        <p><span>JUG</span> {props.data["BlueTeam-JUG"]}</p>
                        <p><span>MID</span> {props.data["BlueTeam-MID"]}</p>
                        <p><span>ADC</span> {props.data["BlueTeam-ADC"]}</p>
                        <p><span>SUP</span> {props.data["BlueTeam-SUP"]}</p>
                    </div>
                </div>

                <div className="team-box red">
                    <h3 className="team-name">Red Team</h3>
                    <div className="player-list">
                        <p><span>TOP</span> {props.data["RedTeam-TOP"]}</p>
                        <p><span>JUG</span> {props.data["RedTeam-JUG"]}</p>
                        <p><span>MID</span> {props.data["RedTeam-MID"]}</p>
                        <p><span>ADC</span> {props.data["RedTeam-ADC"]}</p>
                        <p><span>SUP</span> {props.data["RedTeam-SUP"]}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestView;