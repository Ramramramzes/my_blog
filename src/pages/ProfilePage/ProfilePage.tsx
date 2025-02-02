import { Button, TextareaAutosize } from "@mui/material"
import { Layout } from "../../hocs/Layout"
// import { useUser } from "../../hocs/UserData"
import { useState } from "react"
import SendIcon from '@mui/icons-material/Send';

export const ProfilePage:React.FC = () => {
    // const { theme } = useTheme()
    // const { allUserData } = useUser();
    const [newPost, setNewPost] = useState('')
    const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewPost(event.target.value)
    }

  return (
    <Layout partOfLayout={false}>
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
        >
          Опубликовать
        </Button>
    </Layout>
  )
}