import axios from "axios";

export const useCheckToken = async (token: string) => {
  let flag = 0;
  try{
    const res = await axios.get("/checktoken", {
      params: { token: token }
    });
    flag = res.data.length > 0 ? res.data[0].id : 0;
  }catch(err){
    console.log(err);
    flag = -1;
  }
  return flag;
}