
import { IconButton, Stack } from "@mui/material"
import { useTheme } from "../../hocs/useTheme"
import { NavTabs } from "../UI/Navbar"
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';

export const Header = () => {
  const { changeTheme, theme } = useTheme()
  
  return (
    <Stack direction={'row'} display={'flex'} width={'100%'} padding={3} justifyContent={'center'} gap={'30px'}>
      <NavTabs />
      <IconButton
        aria-label="delete"
        size="large"
        onClick={changeTheme}>
          {theme.palette.mode === 'light' ?  <LightModeIcon /> : <ModeNightIcon />}
      </IconButton>
    </Stack>
  )
}