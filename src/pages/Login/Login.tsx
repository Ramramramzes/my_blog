import { ChangeEvent, FormEvent } from "react";
import { setLogin, setPassword } from "../../store/login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

export function Login() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();

  const loginChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    dispatch(setLogin(event.target.value));
  }

  const passwordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value));
  }

  const submitHamdler = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <>
      <form onSubmit={submitHamdler}>
        <label htmlFor="login"></label>
        <input type="text" name="login" placeholder="Логин" onChange={loginChangeHandler}/>
        <label htmlFor="password"></label>
        <input type="text" name="password" placeholder="Пароль" onChange={passwordChangeHandler}/>
        <input type="submit"/>
      </form>
    </>
  );
}
