
import { Button, Stack } from "@mui/material"
import { useTheme } from "../../hocs/useTheme"

export const Header = () => {
  const { changeTheme } = useTheme()
  return (
    <Stack direction={'row'} width={'100%'} border={'1px solid'}>
      tut header header
      <Button onClick={changeTheme}>Сменить тему</Button>
    </Stack>
  )
}