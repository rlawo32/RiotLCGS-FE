import MainTask from "./view/MainTask";
import styles from "./page.module.css";

export default async function Home() {
  
  return (
    <div className={styles.page}>
      <MainTask />
    </div>
  );
}
