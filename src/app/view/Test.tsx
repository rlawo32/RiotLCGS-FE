import cp from "child_process";
import util from "util";

const Test = async () => {
    const name = "LeagueClientUx";
    let result;

    const exec = util.promisify(cp.exec);

    const command = `wmic process get caption | findstr LeagueClientUx.exe`;
    const executionOptions = {shell: "powershell"};

    try {
        const { stdout: rawStdout } = await exec(command, executionOptions);
        result = rawStdout;
    } catch (err) {
        result = "What?";
    }

    var isWindows = process.platform;

    return (
        <>
        </>
    )
}

export default Test;
