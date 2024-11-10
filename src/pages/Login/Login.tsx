import { Visibility, VisibilityOff } from "@mui/icons-material"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Alert, Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react";
import { LoginUserData } from "../../interfaces/users.ts";
import { LOGIN_INITIAL_USER_DATA } from "../../const/constants.ts";
import { useNavigate } from "react-router-dom";
import { useUsersApi } from "../../hooks/useUsers_API.ts";

export const Login = () => {
  const [formData , setFormData] = useState<LoginUserData>(LOGIN_INITIAL_USER_DATA)
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate()

  const { checkUser, checkUserResult, error } = useUsersApi()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    checkUser(formData)
  }

  useEffect(() => {
    if(checkUserResult){
      navigation('/general')
    }
  },[checkUserResult, navigation])

  return (
    <Stack
      direction={'column'}
      sx={{display: 'flex',height: '80vh', justifyContent: 'center', alignItems: 'center', gap: '20px'}}
      >
      {
        error && 
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
        <Button
          color="primary"
          variant="contained"
          type="submit"
          >
            Вход
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => navigation('/')}
          >
            Зарегистрироваться
        </Button>
      </Stack>
    </Stack>
  )
}