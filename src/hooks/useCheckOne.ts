import axios from "axios";

export const checkOneUser = async (login:string,password:string) => {
  try {
    const res = await axios.get('/checkOneUser',{
      params: { login: login, password:password}
    });
    return res.data
  }catch (err) {
    console.log(err);
  }
}