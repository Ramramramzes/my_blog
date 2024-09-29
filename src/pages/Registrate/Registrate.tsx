import { Stack, TextField, Box, Button, Alert, InputAdornment, IconButton } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChangeEvent, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function Registrate() {
  const [formData , setFormData] = useState(
    { 
      username: "",
      password: "",
      repeated: "",
      email: "",
    }
  )
  const [showAlert, setShowAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData)
  }

  useEffect(() => {
    if (formData.password !== formData.repeated) {
      setShowAlert(true)
    }else{
      setShowAlert(false)
    }
  },[formData])

  return (
    <Box
      sx={{display: 'flex',height: '80vh', justifyContent: 'center', alignItems: 'center'}}
      >
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
        />
        <TextField
          label="Почта"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
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
        >
          Регистрация
        </Button>
      </Stack>
    </Box>
  );
}
