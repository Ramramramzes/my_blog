import { Route, Routes } from "react-router-dom"
import { Registrate } from "./pages/Registrate/Registrate"
import { General } from "./pages/General/General"
import { Login } from "./pages/Login/Login"
import { RequireAuth } from "./hoks/RequireAuth"

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={
          <Registrate /> 
        }/>
      <Route path="/login" element={
          <Login />
        } />
      <Route path="/general" element={
        <RequireAuth>
          <General />
        </RequireAuth>
      } />
    </Routes>
  )
}
