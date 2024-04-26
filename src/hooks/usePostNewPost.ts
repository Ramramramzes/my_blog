import axios from "axios";

export const postNewPost = async(post_text:string,user_id:string) => {
  try{
    const res = await axios.post('/postnewpost',{
      user_id: Number(user_id),
      post_text: post_text,
    })
    return res.data;
  }catch(err){
    console.log(err);
  }
}