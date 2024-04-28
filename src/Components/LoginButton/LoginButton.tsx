import { useDispatch, useSelector } from "react-redux";
import { checkOneUser } from "../../services/checkOne";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setErrorState, setLogin, setPassword } from "../../store/login";
import { setmainUserId, setMainLogin, setViewId } from "../../store/blog";

export function LoginButton() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const clickHandler = async() => {
    const checkOne = await checkOneUser(LogingState.login, LogingState.password);
    if(checkOne.length != 0){
      navigate('/blog');
      dispatch(setMainLogin(LogingState.login));
      dispatch(setmainUserId(checkOne[0].id));
      dispatch(setViewId(checkOne[0].id));
      dispatch(setLogin(''));
      dispatch(setPassword(''));
      dispatch(setErrorState(''));
    }else{
      dispatch(setErrorState('Логин или пароль неверны'));
    }
  }
  
  return (
    <input type="submit" value='Войти' onClick={clickHandler}/>
  );
}
