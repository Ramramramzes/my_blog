import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useBlogPost } from "../../hooks/useBlogPost";
import { useEffect } from "react";
import { setPostData } from "../../store/blog";
import { useNavigate } from "react-router-dom";

export function Blogline() {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  const data = useBlogPost(Number(BlogState.mainUserId));
  const navigation = useNavigate();

  useEffect(() => {
    async function getPost() {
      try{
        const res = await useBlogPost(Number(BlogState.mainUserId))
        dispatch(setPostData(res))
      }catch(err){
        console.log(err);
      }
    }

    BlogState.mainUserId && getPost()
  },[data])
  
  
  return (
    <ul>
      {!BlogState.mainUserId && <button onClick={() => navigation('/')}>Войти</button>}
      {BlogState.postData.length > 0 && BlogState.postData.map((el,index) => {
        return (
          <li key={index}>
            <p>{el.post_text}</p>
          </li>
        )
      } )}
    </ul>
  );
}

