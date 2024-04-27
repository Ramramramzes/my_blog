import styles from './upload.module.css'
import { ChangeEvent, useState } from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';


export function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const BlogState = useSelector((state: RootState) => state.blog);
  
  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  const handleSend = async() => {
    const formData = new FormData();
    formData.append('avatar', selectedFile ? selectedFile : '');
    try{
      const res = await axios.post(`/upload?user_id=${BlogState.mainUserId}`, formData);
      console.log(res);
    }catch(err){
      console.log(err);
      
    }
  }

  return (
    <>
      <input type="file" 
      onChange={handleChange}
      accept='image/* ,.png,.jpg,.web,.jpeg '/>
      <input type="submit" value="Сохранить" onClick={handleSend}/>
    </>
  );
}
