import { createSlice } from "@reduxjs/toolkit";

interface IBlog {
  mainLogin: string;
  mainUserId: string;
  viewId: string;
  postData: IBlogData[]
  userData: IUserData[]
  addPostState: boolean;
  addPostText: string;
  photoChange: boolean;
  imagePath: string;
  likeHandler: boolean;
}

export interface IUserData {
  id: number;
  login: string;
  password: string;
  avatar: string;
  token: string;
}

export interface IBlogData {
  post_id: number;
  user_id: number;
  image_path: string;
  user_login: string;
  date: string;
  post_text: string;
  like_count: number;
  comment_count: number;
}

const initialState:IBlog = {
  mainLogin: '',
  mainUserId: '',
  viewId: '',
  postData: [],
  userData: [],
  addPostState: false,
  addPostText: '',
  photoChange: false,
  imagePath:'',
  likeHandler: false,
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
    setViewId: (state, action) => {
      state.viewId = action.payload;
    },
    changeAddPost: (state) => {
      state.addPostState = !state.addPostState;
    },
    changeAddPostText: (state,action) => {
      state.addPostText = action.payload;
    },
    changePhotoChange: (state) => {
      state.photoChange =!state.photoChange;
    },
    setPhotoPath: (state,action) => {
      state.imagePath = action.payload;
    },
    catchLikesClick: (state) => {
      state.likeHandler =!state.likeHandler;
    },
  }
})

export const { setmainUserId, setMainLogin, setPostData, setUserData, setViewId, changeAddPost, changeAddPostText, changePhotoChange, setPhotoPath, catchLikesClick } = blogSlice.actions;
export default blogSlice.reducer