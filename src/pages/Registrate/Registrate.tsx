import { Stack, TextField, Button, Alert, InputAdornment, IconButton } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChangeEvent, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserData } from "../../interfaces/users.ts";
import { INITIAL_USER_DATA } from "../../const/constants.ts"
import { useUsersApi } from "../../hooks/useUsers_API.ts";
import { useNavigate } from "react-router-dom";

export function Registrate() {
  const [formData , setFormData] = useState<UserData>(INITIAL_USER_DATA)
  const [showAlert, setShowAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate()

  const { addUser, error, addUserSuccess } = useUsersApi()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addUser(formData)
  }

  useEffect(() => {
    if (formData.password !== formData.repeated) {
      setShowAlert(true)
    }else{
      setShowAlert(false)
    }
  },[formData])

  useEffect(() => {
    if(addUserSuccess){
      navigation('/general')
    }
  },[addUserSuccess, error, navigation])

  return (
    <Stack
      direction={'column'}
      sx={{display: 'flex',height: '80vh', justifyContent: 'center', alignItems: 'center', gap: '20px'}}
      >
        {error && 
        <Alert
          color="error"
          icon={<ErrorOutlineIcon />}
        >
          {error && error?.message}
        </Alert>
        }
      <Stack
        component={'form'}
        direction={'column'} sx={{width: '30%', gap: '15px'}}
        onSubmit={handleSubmit}
        >
        <TextField
          label="Логин"
          variant="outlined"
          type="login"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required={true}
        />
        <TextField
          label="Почта"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Повторите пароль"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          name="repeated"
          value={formData.repeated}
          onChange={handleChange}
          required={true}
        />
        {showAlert && 
        <Alert
          color="error"
          icon={<ErrorOutlineIcon />}
        >
          Пароли не совпадают
        </Alert>
        }
        <Button
        color="primary"
        variant="contained"
        type="submit"
        disabled={showAlert}
        >
          Регистрация
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => navigation('/login')}
          >
            Войти
        </Button>
      </Stack>
    </Stack>
  );
}
