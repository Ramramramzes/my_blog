import { useUsersApi } from "../../hooks/useUsersApi"


export const General = () => {
  const { logout } = useUsersApi(); 
  
  return(
    <>General
      <button onClick={logout}>logout</button>
    </>
  )
}