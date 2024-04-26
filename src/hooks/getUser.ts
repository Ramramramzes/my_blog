import axios from "axios";
import { useState } from "react";

export const getUser = (id:number) => {
  const [data,setData] = useState([]);
  axios.get("/getuser",{
    params: {id: id},
  })
  .then(res => setData(res.data))
  .catch(err => console.log(err))

  return data;
}