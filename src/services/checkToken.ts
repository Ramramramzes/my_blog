import axios from "axios";

export const useCheckToken = async (token: string) => {
  try{
    const res = await axios.get("/checktoken", {
      params: { token: token }
    });
      return {
        id: res.data[0].id,
        token: res.data[0].token,
      };
  }catch(err){
    console.log(err);
  }
}