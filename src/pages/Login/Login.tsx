import styles from './login.module.css'
import { ChangeEvent, FormEvent, useEffect } from "react";
import { setErrorState, setFingerprint, setInputMode, setLogin, setPassword } from "../../store/login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { RegisterButton } from '../../Components/RegisterButton';
import { LoginButton } from '../../Components/LoginButton';
import { useCheckToken } from '../../services/checkToken';
import { setMainLogin, setViewId, setmainUserId } from '../../store/blog';
import { useNavigate } from 'react-router-dom';
const fpPromise = FingerprintJS.load();

export function Login() {
  const LoginState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      const fp = await fpPromise
      const result = await fp.get()
      dispatch(setFingerprint(result.visitorId))
    })()
  },[])

  useEffect(() => {
    async function checkToken(){
      try{
        const res = await useCheckToken(LoginState.userFingerprint)
        if(res?.token){
          dispatch(setmainUserId(res?.id));
          dispatch(setViewId(res?.id));
          dispatch(setMainLogin(res?.login));
          navigate('/blog'); 
        }
      }
      catch(err){
        console.log(err);
      }
    }
    checkToken()
  },[LoginState.userFingerprint]);


  
  const loginChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    dispatch(setLogin(event.target.value));
  }

  const passwordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value));
  }

  const modeChangeHandlerReg = () => {
    dispatch(setInputMode('registration'));
    dispatch(setLogin(''));
    dispatch(setPassword(''));
    dispatch(setErrorState(''));
  }

  const modeChangeHandlerLog = () => {
    dispatch(setInputMode('login'));
    dispatch(setLogin(''));
    dispatch(setPassword(''));
    dispatch(setErrorState(''));
  }

  const submitHamdler = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <>
      <div className={styles.formBlock}>
        <form onSubmit={submitHamdler} className={styles.form}>
          <div className={styles.modeBlock}>
            <span className={styles.mode} style={LoginState.inputMode != 'login' ? {opacity: .4} : {}} onClick={modeChangeHandlerLog}>Вход</span>
            <span className={styles.mode} style={LoginState.inputMode != 'registration' ? {opacity: .4} : {}} onClick={modeChangeHandlerReg}>Регистрация</span>
          </div>
          <label htmlFor="login"></label>
          <input type="text" name="login" placeholder="Логин" onChange={loginChangeHandler} value={LoginState.login}/>
          <label htmlFor="password"></label>
          <input type="text" name="password" placeholder="Пароль" onChange={passwordChangeHandler} value={LoginState.password}/>
          {LoginState.error != ''? <div className={styles.error}>{LoginState.error}</div> : ''}
          {LoginState.inputMode === 'login' ? <LoginButton/> : <RegisterButton />}
        </form>
      </div>
    </>
  );
}
