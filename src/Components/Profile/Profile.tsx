import styles from './profile.module.css';
import { Upload } from '../Upload';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function Profile() {
  const BlogState = useSelector((state: RootState) => state.blog);

  return (
    <div className={styles.profile}>
      <div className={styles.profileBlock}>
        {/* <img className={styles.image} src={getUserbyId[0].avatar != '' ? getUserbyId[0].avatar : 'src/img/assets/no.png'} alt="" /> */}
        <p>Имя</p>
        <Upload />
      </div>
    </div>
  );
}
