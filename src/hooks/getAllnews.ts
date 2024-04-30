import axios from "axios";
import { useEffect, useState } from "react";
import { IBlogData } from "../store/blog";

export const getAllNews = () => {
  const [data, setData] = useState<IBlogData[]>([])

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
  },[data])
  return data
}