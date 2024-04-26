import axios from "axios";

export interface IProps{
  login: string;
  password: string;
  userFingerprint: string;
}

export const addUser = async ({login,password,userFingerprint}:IProps) => {
  const avatar = '';
  try{
    axios.post('/addUser',{login: login, password: password, userFingerprint: userFingerprint, avatar: avatar})
  }catch(err){
    console.log(err);
  }
}

