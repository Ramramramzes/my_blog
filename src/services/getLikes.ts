import axios from "axios";

export const getLikes = async (post_id:number,user_id:number) => {
  try{
    const response = await axios.get("/get-likes",{
      params: { post_id: post_id, user_id: user_id },
    });
    return response.data
  }catch(err){
    console.log(err)
  }
}