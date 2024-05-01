import axios from "axios";

export const getAllLikes = async (post_id:number) => {
  try{
    const response = await axios.get("/get-all-likes",{
      params: { post_id: post_id},
    });
    return response.data
  }catch(err){
    console.log(err)
  }
}