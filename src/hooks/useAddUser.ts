import axios from "axios";

export interface IProps{
  login: string;
  password: string;
  userFingerprint: string;
}

export const addUser = async ({login,password,userFingerprint}:IProps) => {
  try{
    axios.post('/addUser',{login: login, password: password, userFingerprint: userFingerprint})
  }catch(err){
    console.log(err);
  }
}

