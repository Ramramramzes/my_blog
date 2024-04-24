import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

export function Blog() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  console.log(BlogState.mainId,BlogState.mainLogin);
  
  return (
    <>
    <p>Blog page</p>
    </>
  );
}
