import { Route, Routes } from "react-router-dom"
import { Registrate } from "./pages/Registrate/Registrate"
import { General } from "./pages/General/General"
import { Login } from "./pages/Login/Login"

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Registrate />} />
      <Route path="/login" element={<Login />} />
      <Route path="/general" element={<General />} />
    </Routes>
  )
}
