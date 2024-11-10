import { Container, Stack } from "@mui/material"
import { Sidebar } from "../components/LayoutComponents/Sidebar"
import { Header } from "../components/LayoutComponents/Header"

export const Layout = ({children}) => {
  return(
    <Stack direction={'row'}>
      <Sidebar />
      <Stack direction={'column'} width={'100%'}>
        <Header />
        <Container maxWidth={'md'} sx={{backgroundColor:'red'}}>
          {children}
        </Container>
      </Stack>
    </Stack>
  )
}