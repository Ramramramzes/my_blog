import { Button, Stack, TextareaAutosize } from "@mui/material";
import { Layout } from "../../hocs/Layout";
import { Ws } from "../../hooks/useWs_API";
import React, { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useUser } from "../../hocs/UserData";
import { Post } from "../../UI/Post";
// import { useTheme } from "../../hocs/useTheme";


export const General = () => {
  const {
    sendPost,
    postData,
    // postStatus
  } = Ws()
  // const { theme } = useTheme()
  const { allUserData } = useUser();
  const [newPost, setNewPost] = useState('')
  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPost(event.target.value)
  }

  useEffect(() => {
    // console.log(postData);
    // console.log('Это статус =>', postStatus);
  },[])


  return (
    <Layout>
      <Stack direction={'row'} width={'100%'}>
        <TextareaAutosize 
          aria-label="minimum height"
          minRows={3}
          placeholder="Что у вас нового ?"
          style={{
            outline: 'none',
            resize: 'none',
          }}
          value={newPost}
          onChange={(e) => handlePostChange(e)}
        />
        <Button 
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => sendPost(newPost, allUserData)}>
          Опубликовать
        </Button>
      </Stack>
      <Stack>
        {postData.map((post, index) => (
          <Post post={post} key={index}/>
        ))}
      </Stack>
    </Layout>
  );
};

export default General;