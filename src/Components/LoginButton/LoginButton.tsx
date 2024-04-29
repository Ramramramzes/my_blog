import { useDispatch, useSelector } from "react-redux";
import { checkOneUser } from "../../services/checkOne";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setErrorState, setLogin, setPassword } from "../../store/login";
import { setmainUserId, setMainLogin, setViewId } from "../../store/blog";
import { updateToken } from "../../services/updateToken";

export function LoginButton() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const clickHandler = async() => {
    const checkOne = await checkOneUser(LogingState.login, LogingState.password);

    if(!checkOne) {
      return []
    }

    if(checkOne.length != 0){
      dispatch(setMainLogin(LogingState.login));
      dispatch(setmainUserId(checkOne[0].id));
      dispatch(setViewId(checkOne[0].id));
      dispatch(setLogin(''));
      dispatch(setPassword(''));
      dispatch(setErrorState(''));
      if(checkOne[0].token === '' || checkOne[0].token != LogingState.userFingerprint){
        updateToken(checkOne[0].id,LogingState.userFingerprint)
      }
      navigate('/blog');
    }else{
      dispatch(setErrorState('Логин или пароль неверны'));
    }
  }
  
  return (
    <input type="submit" value='Войти' onClick={clickHandler}/>
  );
}
