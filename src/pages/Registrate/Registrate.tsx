import { Stack, TextField, Box, Button } from "@mui/material";
import { ChangeEvent, useState } from "react";

export function Registrate() {
  const [formData , setFormData] = useState(
    { 
      username: "",
      password: "",
      repeated: "",
      email: "",
    }
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData)
  }

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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Повторите пароль"
          variant="outlined"
          type="password"
          name="repeated"
          value={formData.repeated}
          onChange={handleChange}
        />
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
