import axios from "axios";

export const dislike = async (post_id:number,user_id:number) => {
  try {
    await axios.post('/dislike',{post_id:post_id,user_id:user_id});
    console.log('disliked');
  }catch (err) {
    console.log(err);
  }
}