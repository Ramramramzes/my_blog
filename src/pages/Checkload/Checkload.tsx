import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useCheckToken } from "../../hooks/useCheckToken";
import { setViewId, setmainUserId } from "../../store/blog";
import { useNavigate } from "react-router-dom";

export function Checkload() {
  const LogingState = useSelector((state: RootState) => state.login);
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  useEffect(() =>{
    async function checkFetch(){
      try {
        const res = await useCheckToken(LogingState.userFingerprint)
        if(res != 0 && res != -1){
          dispatch(setmainUserId(res));
          dispatch(setViewId(BlogState.mainUserId));
          navigate('/blog');
        }
      }catch(err){
        console.log(err);
      }
    }

    checkFetch()
  },[LogingState.userFingerprint])
  
  return (
    <>Loading</>
  );
}
