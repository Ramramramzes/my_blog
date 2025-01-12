import { Button } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from "react";

export const UpdateBtns:React.FC<{
  updatePost: Function
  post: any
  user: string
  newPost: string
  setNewPost: Function
}> = ({
  updatePost,
  post,
  user,
  newPost,
  setNewPost
}) => {
  const [sendMode, setSendMode] = useState<boolean>(false)

  return(
    sendMode ? 
    <Button 
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() => {
          updatePost(newPost, user, post.post_id);
          setSendMode(false);
          setNewPost('')
        }}>
        Отправить
      </Button>
      :
      <Button 
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() => {
          setSendMode(true)
          setNewPost(post.content);
        }}>
        Редактировать
      </Button>
  )
}