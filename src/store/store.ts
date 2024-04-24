import { combineReducers, configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import blogReducer from './blog'
const rootReducer = combineReducers({
  login: loginReducer,
  blog: blogReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch