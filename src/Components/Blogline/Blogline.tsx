import styles from './blogline.module.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useBlogPost } from "../../hooks/useBlogPost";
import { useEffect } from "react";
import { setPostData, setUserData } from "../../store/blog";
import { useNavigate } from "react-router-dom";
import { getUser } from '../../hooks/useGetUser';

export function Blogline() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigate();

  useEffect(() => {
    if(BlogState.mainUserId){
      async function getData() {
        try{
          const resPost = await useBlogPost(Number(BlogState.mainUserId))
          dispatch(setPostData(resPost))
          const resUser = await getUser(Number(BlogState.mainUserId))
          dispatch(setUserData(resUser))
        }catch(err){
          console.log(err);
        }
      }

      BlogState.mainUserId && (getData())
    }
    
  },[BlogState.mainUserId])
  
  useEffect(() => {
    if(!BlogState.mainUserId){
      navigation('/')
    }
  },[])
  
  return (
    <ul className={styles.list}>
      {!BlogState.mainUserId && <button onClick={() => navigation('/')}>Войти</button>}
      {BlogState.postData.length > 0 && BlogState.postData.map((el,index) => {
        return (
          <li key={index} className={styles.listItem}>
            <div className={styles.userInfo}>
              <span>{BlogState.userData.length > 0 && BlogState.userData[0].login}</span>
              <span className={styles.dateTime}>{`${new Date(Number(el.date)).getDate()}.${new Date(Number(el.date)).getMonth()}.${new Date(Number(el.date)).getFullYear()}`}</span>
              {/* {`${new Date(Number(el.date)).getHours()}:${new Date(Number(el.date)).getMinutes()}`} */}
            </div>
            {el.post_text}
            <div className={styles.userInfo}>
              <div>Блок с лайками комментами</div>
              <span className={styles.dateTime}>{`${new Date(Number(el.date)).getHours()}:${new Date(Number(el.date)).getMinutes()}`}</span>
            </div>
          </li>
        )
      } )}
    </ul>
  );
}

