import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { checkUsers } from "../../hooks/useCheckUsers";
import { addUser } from "../../hooks/addUser";

export function RegisterButton() {
  const LogingState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  
  const clickHandler = async() => {
    if(LogingState.password.length > 2){
      if(await checkUsers(LogingState.login) === 0){
        await addUser({login: LogingState.login, password: LogingState.password, userFingerprint: LogingState.userFingerprint});
        //? Тут добавить переход на главную страницу с данными пользователя
      }else{
        console.log('Логин уже существует');
      }
    }else{
      console.log('Пароль слишком короткий');
    }
  }

  return (
    <input type="submit" value='Создать аккаунт' onClick={clickHandler}/>
  );
}
