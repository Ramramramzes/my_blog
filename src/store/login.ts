import { createSlice } from "@reduxjs/toolkit";

interface ILogin{
  login: string;
  password: string;
  inputMode: string;
}

const initialState: ILogin = {
  login: '',
  password: '',
  inputMode: 'login',
}

const loginSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setInputMode: (state, action) => {
      state.inputMode = action.payload;
    },
  }
})

export const { setLogin, setPassword, setInputMode } = loginSlice.actions;
export default loginSlice.reducer