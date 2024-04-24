import axios from "axios";

export const useBlogPost = async(id:number) => {
  try{
    const res = await axios.get(`/getblogpost`,{
      params: { id: id }
    })
    return res.data
  }catch(err){
    console.log(err);
  }
}