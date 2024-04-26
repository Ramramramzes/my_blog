import styles from './blogline.module.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getPostDataById } from "../../hooks/getPostDataById";
import { useEffect } from "react";
import { setPostData, setUserData} from "../../store/blog";
import { useNavigate } from "react-router-dom";
import { PostPopup } from '../PostPopup';
import { getUser } from '../../hooks/getUser';

export function Blogline() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigate();
  const allPost = getPostDataById(Number(BlogState.viewId))
  const userData = getUser(Number(BlogState.viewId))

  useEffect(() => {
    dispatch(setPostData(allPost))
    dispatch(setUserData(userData))
  },[allPost,userData,dispatch])
  

  return (
    <ul className={styles.list}>
      {!BlogState.mainUserId && <button onClick={() => navigation('/')}>Войти</button>}
      {BlogState.postData.map((el,index) => {
        return (
          <li key={index} className={styles.listItem}>
            <div className={styles.userInfo}>
              <span>{BlogState.userData.length > 0 && BlogState.userData[0].login}</span>
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

      {BlogState.mainUserId === BlogState.viewId && (
        <li className={styles.listItemLast}>
          <PostPopup />
        </li>
      )}
    </ul>
  );
}

