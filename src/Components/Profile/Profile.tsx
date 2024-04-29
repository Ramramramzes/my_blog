import styles from './profile.module.css';
import { Upload } from '../Upload';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getUser } from '../../hooks/getUser';
import { IUserData } from '../../store/blog';

export function Profile() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const userData:IUserData[] = getUser(Number(BlogState.viewId))

  return (
    <div className={styles.profile}>
      <div className={styles.profileBlock}>
        <img className={styles.image} src={userData.length != 0 && userData[0].avatar ? userData[0].avatar : 'src/img/assets/no.png'} alt="" />
        
        <Upload path={userData.length != 0 && userData[0].avatar ? userData[0].avatar : ''}/>
      </div>
    </div>
  );
}
