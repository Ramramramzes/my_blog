import axios from "axios";

export const getUser = async (id:number) => {
  try {
    const response = await axios.get("/getuser",{
      params: {id: id},
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}