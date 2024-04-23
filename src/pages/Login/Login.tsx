import styles from './login.module.css'
import { ChangeEvent, FormEvent } from "react";
import { setInputMode, setLogin, setPassword } from "../../store/login";
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

  const modeChangeHandlerReg = () => {
    dispatch(setInputMode('registration'));
  }

  const modeChangeHandlerLog = () => {
    dispatch(setInputMode('login'));
  }

  const submitHamdler = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <div className={styles.formBlock}>
      <form onSubmit={submitHamdler} className={styles.form}>
        <div className={styles.modeBlock}>
          <span className={styles.mode} style={LogingState.inputMode != 'login' ? {opacity: .4} : {}} onClick={modeChangeHandlerLog}>Вход</span>
          <span className={styles.mode} style={LogingState.inputMode != 'registration' ? {opacity: .4} : {}} onClick={modeChangeHandlerReg}>Регистрация</span>
        </div>
        <label htmlFor="login"></label>
        <input type="text" name="login" placeholder="Логин" onChange={loginChangeHandler}/>
        <label htmlFor="password"></label>
        <input type="text" name="password" placeholder="Пароль" onChange={passwordChangeHandler}/>
        {LogingState.inputMode === 'login' ? <input type="submit" value='Войти'/> : <input type="submit" value='Создать аккаунт'/>}
      </form>
    </div>
  );
}
