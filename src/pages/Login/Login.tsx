import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { LoginUserData } from "../../interfaces/useUserApi";
import { LOGIN_INITIAL_USER_DATA } from "../../common/common.ts";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [formData , setFormData] = useState<LoginUserData>(LOGIN_INITIAL_USER_DATA)
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData);
  }

  return (
    <Stack
      direction={'column'}
      sx={{display: 'flex',height: '80vh', justifyContent: 'center', alignItems: 'center', gap: '20px'}}
      >
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
            Регистрация
        </Button>
      </Stack>
    </Stack>
  )
}