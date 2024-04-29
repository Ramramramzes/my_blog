import axios from "axios";

export const updateToken = async (id:number,token:string) => {
  try{
    axios.post('/update-token',{id:id,token:token})
  }catch(err){
    console.log(err);
  }
}

