import axios from "axios";

export const like = async (post_id:number,user_id:number) => {
  try {
    await axios.post('/like',{post_id:post_id,user_id:user_id});
    console.log('liked');
  }catch (err) {
    console.log(err);
  }
}