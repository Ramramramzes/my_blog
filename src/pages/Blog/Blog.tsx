import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Profile } from "../../Components/Profile";

export function Blog() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  console.log(BlogState.mainUserId,BlogState.mainLogin);
  
  return (
    <div>
      <Profile />
    </div>
  );
}
