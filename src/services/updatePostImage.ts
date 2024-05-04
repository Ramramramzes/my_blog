import axios from "axios";

export const updatePostImage = async (user_id:number, image_path: string) => {
  try {
    await axios.post('/update-post-image',{user_id:user_id, image_path:image_path});
  }catch (err) {
    console.log(err);
  }
}