import MainView from "./view/MainView";
import styles from "./page.module.css";

import RiotClient from "@/app/api/RiotWebSocket";

export default async function Home() {
  const gameId:number = 7389173589;
  const gameData:object = [];
  //const test = await RiotClient(7389173589);
  
  return (
    <div className={styles.page}>
      <MainView gameId={gameId} gameData={gameData} />
    </div>
  );
}
