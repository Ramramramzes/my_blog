import { Container, Stack } from "@mui/material"
import { Sidebar } from "../components/LayoutComponents/Sidebar"
import { Header } from "../components/LayoutComponents/Header"

export const Layout = ({children, partOfLayout}) => {
  return(
    !partOfLayout ? 
    <Stack direction={'row'}>
      <Sidebar />
      <Stack direction={'column'} width={'100%'}>
        <Header />
        <Container maxWidth={'md'}>
          {children}
        </Container>
      </Stack>
    </Stack>
    :
    <Stack direction={'row'}>
      <Stack direction={'column'} width={'100%'}>
        <Header />
        <Container maxWidth={'md'}>
          {children}
        </Container>
      </Stack>
    </Stack>
  )
}