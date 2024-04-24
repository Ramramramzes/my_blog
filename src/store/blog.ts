import { createSlice } from "@reduxjs/toolkit";

interface IBlog{
  mainLogin: string;
  mainUserId: string;
}

const initialState:IBlog = {
  mainLogin: '',
  mainUserId: '',
}

const blogSlice = createSlice({
  name: 'Blog',
  initialState,
  reducers: {
    setmainUserId: (state, action) => {
      state.mainUserId = action.payload;
    },
    setMainLogin: (state, action) => {
      state.mainLogin = action.payload;
    }
  }
})

export const { setmainUserId, setMainLogin } = blogSlice.actions;
export default blogSlice.reducer