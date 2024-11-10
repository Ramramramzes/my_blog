import { Route, Routes } from "react-router-dom";
import { Registrate } from "./pages/Registrate/Registrate";
import { General } from "./pages/General/General";
import { Login } from "./pages/Login/Login";
import { RequireAuth } from "./hocs/RequireAuth";
import CssBaseline from '@mui/material/CssBaseline';

export const App = () => {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Registrate />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/general"
          element={
            <RequireAuth>
              <General />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};