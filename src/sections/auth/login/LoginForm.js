import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';


// components
import Iconify from '../../../components/iconify';
import { LoginToken, ValidarToken } from '../../../services/Userservices';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await LoginToken(usuario, contrasenia);

      if (response.success === true) {
        toast.success('Bienvenido');
        navigate('/security/user', { replace: true });
      } else {
        const errorMessage = response.message;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    // Aquí puedes realizar alguna acción adicional antes de enviar el formulario, si es necesario
  };

  const sanitizeValue = (name, value) => {
    if (name === 'usuario' || name === 'contrasenia') {
      return value.replace(/\s+/g, '');
    }
    return value;
  };


  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="usuario"
            placeholder="Usuario"
            value={usuario}
            onChange={(event) => setUsuario(sanitizeValue(event.target.name, event.target.value))}
            required
          />

          <TextField
            name="contrasenia"
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={contrasenia}
            onChange={(event) => setContrasenia(sanitizeValue(event.target.name, event.target.value))}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <Link variant="subtitle2" underline="hover">
            ¿Olvidaste tu contraseña?
          </Link> */}
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Ingresar
        </LoadingButton>
      </form>
    </>
    
  );
}
