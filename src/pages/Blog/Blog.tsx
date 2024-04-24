import styles from './blog.module.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Profile } from "../../Components/Profile";
import { Header } from "../../Components/Header";
import { Blogline } from "../../Components/Blogline";

export function Blog() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  console.log(BlogState.mainUserId,BlogState.mainLogin);
  
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
