import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { checkUsers } from "../../hooks/useCheckUsers";
import { addUser } from "../../hooks/useAddUser";
import { useNavigate } from "react-router-dom";
import { setErrorState, setPassword } from "../../store/login";

export function RegisterButton() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  
  const clickHandler = async() => {
    if(LogingState.password.length > 2){
      if(await checkUsers(LogingState.login) === 0){
        await addUser({login: LogingState.login, password: LogingState.password, userFingerprint: LogingState.userFingerprint});
        dispatch(setPassword(''));
        navigate('/blog');
      }else{
        dispatch(setErrorState('Логин уже существует'));
      }
    }else{
      dispatch(setErrorState('Пароль слишком короткий'));
    }
  }

  return (
    <input type="submit" value='Создать аккаунт' onClick={clickHandler}/>
  );
}
