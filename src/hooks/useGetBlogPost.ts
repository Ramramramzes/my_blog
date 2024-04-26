import axios from "axios";
import { useEffect, useState } from "react";

export const useBlogPost = (id:number) => {
  const [data,setData] = useState([]);
  
  useEffect(() => {
    axios.get(`/getblogpost`,{
      params: { id: id }
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err))
  },[data])

  return data
}