import styles from './upload.module.css'
import { ChangeEvent, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { changePhotoChange } from '../../store/blog';


export function Upload({path}:{path: string}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  
  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  const handleSend = async() => {
    const formData = new FormData();
    formData.append('avatar', selectedFile ? selectedFile : '');
    try{
      await axios.post(`/upload?user_id=${BlogState.mainUserId}`, formData);
      await axios.delete(`/delete-image?filePath=${path}`);

      dispatch(changePhotoChange())
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
