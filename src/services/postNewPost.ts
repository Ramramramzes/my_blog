import axios from "axios";

export const postNewPost = async(post_text:string,user_id:string,imagePath:string,mainLogin:string) => {
  try{
    const res = await axios.post('/postnewpost',{
      user_id: Number(user_id),
      post_text: post_text,
      image_path: imagePath,
      user_login: mainLogin,
    })
    return res.data;
  }catch(err){
    console.log(err);
  }
}