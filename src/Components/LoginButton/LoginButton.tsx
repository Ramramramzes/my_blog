import { useDispatch, useSelector } from "react-redux";
import { checkOneUser } from "../../hooks/useCheckOne";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setErrorState } from "../../store/login";

export function LoginButton() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const clickHandler = async() => {
    const checkOne = await checkOneUser(LogingState.login, LogingState.password);
    if(checkOne.length != 0){
      navigate('/blog');
    }else{
      dispatch(setErrorState('Логин или пароль неверны'));
    }
  }
  
  return (
    <input type="submit" value='Войти' onClick={clickHandler}/>
  );
}
