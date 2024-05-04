import styles from './profile.module.css';
import { Upload } from '../Upload';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getUser } from '../../hooks/getUser';
import { IUserData, setPhotoPath } from '../../store/blog';
import { useEffect } from 'react';
import { updatePostImage } from '../../services/updatePostImage';

export function Profile() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const userData:IUserData[] = getUser(Number(BlogState.viewId))
  const dispatch = useDispatch<AppDispatch>();
  
  const imageUrl = userData.length !== 0 && userData[0].avatar ? userData[0].avatar : 'src/img/assets/no.png';

  useEffect(() => {
    dispatch(setPhotoPath(imageUrl))
    updatePostImage(Number(BlogState.mainUserId),imageUrl)
  },[imageUrl])
  
  const imageBlock = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: imageUrl ==='src/img/assets/no.png'? 'contain' : 'cover' ,
    backgroundPosition: 'center',
    width: '200px',
    height: '300px',
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileBlock}>
        <div style={imageBlock}></div>  
        <div>{userData.length !== 0 && userData[0].login}</div>
        <Upload path={userData.length != 0 && userData[0].avatar ? userData[0].avatar : ''}/>
      </div>
    </div>
  );
}
