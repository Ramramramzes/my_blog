import { createSlice } from "@reduxjs/toolkit";

interface ILogin{
  login: string;
  password: string;
  inputMode: string;
  userFingerprint: string;
}

const initialState: ILogin = {
  login: '',
  password: '',
  inputMode: 'login',
  userFingerprint: '',
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
    setFingerprint: (state, action) => {
      state.userFingerprint = action.payload;
    }
  }
})

export const { setLogin, setPassword, setInputMode, setFingerprint } = loginSlice.actions;
export default loginSlice.reducer