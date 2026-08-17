import { NextResponse } from 'next/server';
import cp from "child_process";
import util from "util";

const exec = util.promisify(cp.exec);

export async function GET() {
  try {
    const processName:string = "LeagueClientUx";   
    // const command = `wmic process get caption | findstr ${processName}.exe`;
    const command = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE '${processName}.exe'" | Select-Object -ExpandProperty CommandLine`;
    const executionOptions = {shell: "powershell"};

    const portRegex = /--app-port=([0-9]+)(?= *"| --)/;
    const passwordRegex = /--remoting-auth-token=(.+?)(?= *"| --)/;
    const pidRegex = /--app-pid=([0-9]+)(?= *"| --)/;

    const { stdout: stdout, stderr: stderr } = await exec(command, executionOptions);

    const [, port] = stdout.match(portRegex);
    const [, pid] = stdout.match(pidRegex);
    const [, password] = stdout.match(passwordRegex);

    if (stderr) {
      return NextResponse.json({ err: 'Failed to fetch connection data', status: 500 }, { status: 500 });
    }

    return NextResponse.json({ port: port, pid: pid, password: password, status: 200 }, { status: 200 });
  } catch {
    return NextResponse.json({ err: 'Failed to fetch connection data', status: 500 }, { status: 500 });
  }
}