import { Route, Routes } from "react-router-dom"
import { Registrate } from "./pages/Registrate/Registrate"

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Registrate />} />
    </Routes>
  )
}
