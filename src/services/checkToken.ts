import axios from "axios";
import login from "../store/login";

export const useCheckToken = async (token: string) => {
  try{
    const res = await axios.get("/checktoken", {
      params: { token: token }
    });
      return {
        id: res.data[0].id,
        login: res.data[0].login,
        token: res.data[0].token,
      };
  }catch(err){
    console.log(err);
  }
}