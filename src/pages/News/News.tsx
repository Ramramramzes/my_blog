import styles from './news.module.css'
import { Header } from "../../Components/Header";
import { getAllNews } from '../../hooks/getAllnews';
import { IBlogData } from '../../store/blog';
import { useEffect } from 'react';


export function News() {
  const AllPostData:IBlogData[] = getAllNews();
  
  return (
    <>
      <div>
        <Header />
      </div>
      <div>
      <ul className={styles.list}>
      {AllPostData && AllPostData.map((el,index) => {
        return (
          <li key={index} className={styles.listItem}>
            <div className={styles.userInfo}>
              <div className={styles.userInfoPhotoBlock}>
                <div style={el.image_path ? {backgroundImage: `url(${el.image_path})`} : {backgroundImage: `url('/src/img/assets/no.png')`}} className={styles.userInfoPhoto}></div>
                <span>{el.user_login}</span>
              </div>
              <span className={styles.dateTime}>{`${new Date(Number(el.date)).getDate()}.${new Date(Number(el.date)).getMonth()}.${new Date(Number(el.date)).getFullYear()}`}</span>
            </div>
            {el.post_text}
            <div className={styles.userInfo}>
              <div>Блок с лайками комментами</div>
              <span className={styles.dateTime}>{`${new Date(Number(el.date)).getHours()}:${new Date(Number(el.date)).getMinutes()}`}</span>
            </div>
          </li>
        )
      })}
    </ul>
      </div>
    </>
  );
}
