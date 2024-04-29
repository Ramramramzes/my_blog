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

  const miniImage = {
    backgroundImage: `url(${BlogState.imagePath})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '100%',
  }

  useEffect(() => {
    dispatch(setPostData(allPost))
    dispatch(setUserData(userData))
  },[allPost,userData,dispatch,])

  useEffect(() => {
    if(!BlogState.mainUserId){
      navigation('/news');
    }
  },[])

  return (
    <ul className={styles.list}>
      {BlogState.mainUserId === BlogState.viewId && (
        <li className={styles.listItemLast}>
          <PostPopup />
        </li>
      )}
      {/* {!BlogState.mainUserId && <button onClick={() => navigation('/')}>Войти</button>} */}
      {BlogState.postData && BlogState.postData.map((el,index) => {
        return (
          <li key={index} className={styles.listItem}>
            <div className={styles.userInfo}>
              <div className={styles.userInfoPhotoBlock}>
                <div style={miniImage} className={styles.userInfoPhoto}></div>
                <span>{BlogState.userData.length > 0 && BlogState.userData[0].login}</span>
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
  );
}

