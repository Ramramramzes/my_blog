import axios from "axios";
import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export const getLikes = (post_id:number) => {
  const [data, setData] = useState([])
  const BlogState = useSelector((state: RootState) => state.blog);
  const [time, setTime] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try{
        const response = await axios.get("/get-likes",{
          params: { post_id: post_id},
        });
        
        setData(response.data)
      }catch(err){
        console.log(err)
      }
    }
    setTimeout(() => {
    setTime(!time);
    }, 30000);
    fetchData()
  },[BlogState.likeHandler, time])

  return data
}
