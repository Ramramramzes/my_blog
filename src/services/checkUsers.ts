import axios from "axios";

export const checkUsers = async (login: string) => {
  try {
    const response = await axios.get('/checkAllUsers', {
      params: { login: login }
    });
    const result = response.data.length;
    return result;
  } catch (err) {
    console.log(err);
    return -1; 
  }
}
