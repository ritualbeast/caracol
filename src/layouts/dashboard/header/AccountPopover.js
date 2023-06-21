import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Tooltip } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    localStorage.clear();
    window.location.href = '/login';
  };
  const handleClose2 = () => {
    setOpen(null);

  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        
        onClose={handleClose2}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Tooltip  title={localStorage.getItem('nombreUsuario')} placement="top">
            <Typography variant="subtitle2" noWrap>
              {localStorage.getItem('nombreUsuario')}
            </Typography>
          </Tooltip>
          <Tooltip title={localStorage.getItem('correoUsuario')} placement="top">
          
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {localStorage.getItem('correoUsuario')}
            </Typography>
          </Tooltip>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Cerrar sesión
        </MenuItem>
      </Popover>
    </>
  );
}
