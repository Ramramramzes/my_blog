import { combineReducers, configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
const rootReducer = combineReducers({
  login: loginReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch