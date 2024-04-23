import { createSlice } from "@reduxjs/toolkit";

interface ILogin{
  login: string;
  password: string;
}

const initialState: ILogin = {
  login: '',
  password: '',
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
  }
})

export const { setLogin, setPassword } = loginSlice.actions;
export default loginSlice.reducer