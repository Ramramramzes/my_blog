import { Button, Stack, TextareaAutosize } from "@mui/material";
import { Layout } from "../../hocs/Layout";
import { Ws } from "../../hooks/useWs_API";
import React, { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useUser } from "../../hocs/UserData";
// import { useTheme } from "../../hocs/useTheme";


export const General = () => {
  const {sendPost , postData, postAddStatus} = Ws()
  // const { theme } = useTheme()
  const { user } = useUser();
  const [newPost, setNewpost] = useState('')
  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewpost(event.target.value)
  }

  useEffect(() => {
    console.log(postData);
    console.log('Это статус =>', postAddStatus);
  },[postData, postAddStatus])


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
          onClick={() => sendPost(newPost, user)}>
          Опубликовать
        </Button>
      </Stack>
      <Stack>
        {postData.map((post, index) => (
          <Stack key={index} direction={'row'} width={'100%'} border={'1px solid'}>
            {post.post_id} ___ {post.content}
          </Stack>
        ))}
      </Stack>
    </Layout>
  );
};

export default General;