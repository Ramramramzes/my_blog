import { createSlice } from "@reduxjs/toolkit";

interface IBlog {
  mainLogin: string;
  mainUserId: string;
  postData: IBlogData[]
  userData: IUserData[]
}

interface IUserData {
  id: number;
  login: string;
  password: string;
  avatar: string;
  token: string;
}

interface IBlogData {
  post_id: number;
  user_id: number;
  date: string;
  post_text: string;
  like_count: number;
  comment_count: number;
}

const initialState:IBlog = {
  mainLogin: '',
  mainUserId: '',
  postData: [],
  userData: [],
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
    },
    setPostData: (state, action) => {
      state.postData = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  }
})

export const { setmainUserId, setMainLogin, setPostData, setUserData } = blogSlice.actions;
export default blogSlice.reducer