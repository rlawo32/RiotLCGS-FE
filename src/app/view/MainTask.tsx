import cp from "child_process";
import util from "util";

import MainView from "./MainView";
import RiotClient from "@/app/api/RiotWebSocket";

const MainTask = async () => {
    const gameId:number = 7389173588;
    let gameData:object = {};
    const exec = util.promisify(cp.exec);

    const processName = "LeagueClientUx";
    let result;
  
    const command = `wmic process get caption | findstr ${processName}.exe`;
    const executionOptions = {shell: "powershell"};
  
    try {
        const { stdout: stdout } = await exec(command, executionOptions);
        result = "Y";
    } catch (err) {
        result = "N";
    }

    result === 'Y' ? gameData = await RiotClient(gameId) : 0;
  
    //var isWindows = process.platform;

    return (
        <>
            <MainView gameId={gameId} gameData={gameData} connection={result} />
        </>
    )
}

export default MainTask;