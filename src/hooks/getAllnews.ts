import axios from "axios";
import { useEffect, useState } from "react";
import { IBlogData } from "../store/blog";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const getAllNews = () => {
  const [data, setData] = useState<IBlogData[]>([])
  const BlogState = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get("/get-news");

        setData(response.data.reverse())
      }catch(err){
        console.log(err)
      }
    }

    fetchData();
  },[BlogState.likeHandler])
  return data
}