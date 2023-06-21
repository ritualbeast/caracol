import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Paper,
  TableRow,
  MenuItem,
  InputLabel,
  Modal,
  TableBody,
  Radio, 
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TableCell,
  Container,
  Typography,
  Menu,
  IconButton,
  Select,
  FormControl,
  TableContainer,
  TablePagination,
  Box
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import CloseIcon from '@material-ui/icons/Close';
import '../styles/roles.css'
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import CreateRole from './roles/createRole';
import ModificarRole from './roles/ModificarRole';
import { ConsultarRoles, EliminarRol } from '../services/ServicesRol';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'nombre', label: 'Nombre', alignRight: false },
  { id: 'descripcion', label: 'Descripcion', alignRight: false },
  { id: 'nemonico', label: 'Nemonico', alignLeft: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'action', label: 'Acciones' },
]

// ----------------------------------------------------------------------
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  if (!Array.isArray(array)) {
    return []; // o cualquier otro valor predeterminado según tus necesidades
  }

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(stabilizedThis.map((el) => el[0]), (_user) =>
      _user.nombre.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('A');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openModificar, setOpenModificar] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [datosUser, setDatosUser] = useState([]);
  const [isSelectUsed, setIsSelectUsed] = useState(false);
  const [isToolbarUsed, setIsToolbarUsed] = useState(false); // Cambiar el orden
  const isButtonDisabled = !(isSelectUsed && isToolbarUsed);
  const [valorcheck2, setValorcheck2] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
  });  
  
  const handleOpenMenu = (event, roleId) => {
    setOpen(event.currentTarget);
    setSelectedUserId(roleId);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenEliminar = () => {
    setOpenEliminar(true);
  };

  const handleCloseEliminar = () => {
    setOpenEliminar(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    if (!event.target.value) {
      setIsToolbarUsed(false);
    } else {
      setIsToolbarUsed(true);
    }
  };

  // const filteredUsers = applySortFilter(datosUser, getComparator(order, orderBy), filterName);
  // // const isNotFound = !filteredUsers.length && !!filterName;

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModificar = () => {
    setOpenModificar(true);
  };

  const handleCloseModificar = () => {
    setOpenModificar(false);
  };

  useEffect(() => {
    verificarLocalStorage();
    fetchData();
  }, []);

  const verificarLocalStorage = () => {
    const isAdmin = localStorage.getItem("nombreUsuario");
    if (isAdmin === null) {
      window.location.href = "/login";
    }
  }

  const fetchData = async () => {
    try {
      // clear checkitems
      setIsSelectUsed (false);
      setSelectedOption('');
      setFilterName('');
      const response = await ConsultarRoles();
      setDatosUser(response.data.listRoles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFiltrar = async () => {
    try {
      const response = await ConsultarRoles(filterName, selectedOption);
      if (response.data.listRoles.length === 0) {
        toast.error(`No se encontraron resultados para la busqueda: ${filterName}`, {
          autoClose: 1500,
        });
      } else if (response.success === true) {
        setDatosUser(response.data.listRoles);
      } else {
        toast.error(`${response.message}`
          , {
            position: "bottom-right",
            autoClose: 2000,
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

const handleEliminar = async () => {
  try {
    const response = await EliminarRol(selectedUserId);
    if (response.success === true) {
      fetchData();
      handleCloseEliminar();
      
    }
    else if (response.success === false) {
      toast.error(`${response.message}`
        , {
          position: "top-right",
          autoClose: 2000,
        });
    }

  } catch (error) {
    console.error(error);
    toast.error( `${error}` , {
      position: "top-right",
      autoClose: 2000,
    });

  }
};

   const paginatedData = datosUser.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
    { value: 'No', label: 'Nombres' },
    { value: 'De', label: 'Descripcion' },
    { value: 'E', label: 'Estado' },
  ];

  const getOptionLabel = (value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : '';
  };
  const [selectedEstado, setSelectedEstado] = useState('');
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    setIsSelectUsed(true);
    const option = event.target.value;
      setSelectedOption(option);

      if (option === 'E') {
        setShowEstadoOptions(true);
        setIsToolbarUsed(true);

      } else if (option !== 'E') 
      {
        setShowEstadoOptions(false);
        setIsToolbarUsed(false);
      }
  };

  const handleEstadoChange = (event) => {
    const { value } = event.target;
    setSelectedEstado(value);
    setIsSelectUsed(true);
    setFilterName(value);
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title> Security </title>
      </Helmet>

      <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Roles de Usuario
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenModal}
            >
              Nuevo Rol
            </Button>
          </Stack>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
              <FormControl variant="outlined" style={{ width: '20%' }}>
                <InputLabel id="select-label">Filtrar por</InputLabel>
                <Select
                  labelId="select-label"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  label="Filtrar por"
                  renderValue={(selected) => getOptionLabel(selected) || 'Seleccionar'}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            {selectedOption === 'E' && (
              <>
                <FormControl component="fieldset" style={{ marginLeft: '1rem' }}>
                  <FormLabel component="legend">Estado</FormLabel>
                  <RadioGroup
                    aria-label="estado"
                    name="estado"
                    value={selectedEstado}
                    onChange={handleEstadoChange}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio />}
                      label="Activo"
                    />
                    <FormControlLabel
                      value="I"
                      control={<Radio />}
                      label="Inactivo"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
            {!showEstadoOptions && (
              <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            )          
            }
              
              <Button style={{ margin: '0 0 0 1rem' }} variant="contained" onClick={handleFiltrar} disabled={isButtonDisabled}>
                Filtrar
              </Button>
              <Button style={{ margin: '0 0 0 1rem' }} variant="contained" onClick={fetchData}>
                Limpiar
              </Button>
            </div>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead headLabel={TABLE_HEAD} />
                  
                  {isNotFound ? (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Sin resultados
                            </Typography>
                            <Typography variant="body2">
                              No existen resultados para  &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Intenta verificar errores tipográficos o buscar por otra palabra.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {Array.isArray(paginatedData) && paginatedData.map((user, index) => (
                        <TableRow key={user.idUsuario}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{user.nombre}</TableCell>
                          <TableCell>{user.descripcion}</TableCell>
                          <TableCell>{user.nemonico}</TableCell>
                          <TableCell>{user.estado}</TableCell>
                          <TableCell align="center">
                            <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, user.idRol)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>

                </TableContainer>
              </Scrollbar>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={datosUser.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
      </Container>

      <Menu
        open={Boolean(open)}
        onClose={handleCloseMenu}
        anchorEl={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenModificar}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenEliminar}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Menu>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          p: '1rem',
          bgcolor: '#f7f7f7',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          overflowY: 'auto',
          
        }}>
          <IconButton onClick={handleCloseModal} style={{ position: 'absolute', top: 0, right: 0, color: 'white' }}>
          <CloseIcon />
        </IconButton>
            <CreateRole  
             handleCloseModal={handleCloseModal}
             handleRefresh={fetchData}
             />
        </Box>
      </Modal>

      <Modal
        open={openModificar}
        onClose={handleCloseModificar}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          p: '1rem',
          bgcolor: '#f7f7f7',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          overflowY: 'auto',
        }}>
          <IconButton onClick={handleCloseModificar} style={{ position: 'absolute', top: 0, right: 0, color: 'white' }}>
            <CloseIcon />
          </IconButton>
          <ModificarRole
            handleCloseModificar={handleCloseModificar} 
            roleId={selectedUserId}
            handleRefresh = {fetchData}
            
          />
        </Box>
      </Modal>

      <Modal
        open={openEliminar}
        onClose={handleCloseEliminar}
        sx={{width: '60%',height: '60%', display: 'flex',alignItems: 'center',justifyContent: 'center',margin: 'auto', marginTop: '5%',
        }}
      >
        <Box sx={{ width: '50%' }}>
        <Container>
          <Row>
            <Col>
              Desea eliminar el usuario?
            </Col>
            <Col>
              <Button className='buttondeleteuser' variant="contained" color="primary"
              onClick={handleEliminar}
              >
                Eliminar
              </Button>
              <Button className='buttondeleteuser' variant="contained" color="primary" onClick={handleCloseEliminar}>
                Cancelar
              </Button>
            </Col>
          </Row>  
        </Container>
        
        <ToastContainer />
        </Box>
      </Modal>
    </>
  );
}
