import { Route, Routes } from "react-router-dom"
import { Registrate } from "./pages/Registrate/Registrate"
import { General } from "./pages/General/General"

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Registrate />} />
      <Route path="/general" element={<General />} />
    </Routes>
  )
}
