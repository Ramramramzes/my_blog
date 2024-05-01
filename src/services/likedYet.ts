import axios from "axios";

export const likedYet = async (post_id:number,user_id:number) => {
  try{
    const response = await axios.get("/get-likes",{
      params: { post_id: post_id, user_id: user_id },
    });
    
    console.log(response.data);
    return response.data
  }catch(err){
    console.log(err)
  }
}