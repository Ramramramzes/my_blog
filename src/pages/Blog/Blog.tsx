import styles from './blog.module.css';
import { Profile } from "../../Components/Profile";
import { Header } from "../../Components/Header";
import { Blogline } from "../../Components/Blogline";

export function Blog() {  
  return (
    <div className={styles.blog}>
      <Profile />
      <div className={styles.rightPart}>
        <Header />
        <Blogline />
      </div>
    </div>
  );
}
