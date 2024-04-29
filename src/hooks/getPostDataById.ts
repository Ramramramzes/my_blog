import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const getPostDataById = (id:number) => {
  const [data,setData] = useState([]);
  const BlogState = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const fetchData = async() => {
      try{
        const res = await axios.get(`/getblogpost`,{
          params: { id: id }
        })
        
        setData(res.data.reverse())
      }catch(err){
        console.log(err);
      }
    }
    
    if(id){
      fetchData();
    }
  },[id,BlogState.addPostState]);

  return data
}