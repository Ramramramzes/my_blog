import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const getUser = (id: number) => {
  const BlogState = useSelector((state: RootState) => state.blog);
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get("/getuser", {
          params: { id: id },
        });
        setData(response.data)
      }catch(err){
        console.log(err)
      }
    }

    fetchData();
  },[data,BlogState.photoChange])
  
  return data
}
