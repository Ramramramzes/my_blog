import { createSlice } from "@reduxjs/toolkit";

interface IBlog{
  mainLogin: string;
  mainId: string;
}

const initialState:IBlog = {
  mainLogin: '',
  mainId: '',
}

const blogSlice = createSlice({
  name: 'Blog',
  initialState,
  reducers: {
    setMainId: (state, action) => {
      state.mainId = action.payload;
    },
    setMainLogin: (state, action) => {
      state.mainLogin = action.payload;
    }
  }
})

export const { setMainId, setMainLogin } = blogSlice.actions;
export default blogSlice.reducer