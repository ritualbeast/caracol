/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import '../../styles/createRole.css';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import KeyIcon from '@mui/icons-material/Key';
import Select from 'react-select';
import { ConsultarPermisos, CrearRol, ConsultarCanal } from '../../services/ServicesRol';

const CreateRole = ({handleCloseModal, handleRefresh, userId}) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [permisos, setPermisos] = useState([]);
  const [consultaCanal, setConsultaCanal] = useState([]);
  const [error, setError] = useState("");
  const [userIdPermiso, setUserIdPermiso] = useState(userId);
  const [camposIncompletos, setCamposIncompletos] = useState([]);
  const [formState, setFormState] = useState({
    nombre : '',
    descripcion : '',
    mnemonico : '',
    estado : 'A',
    usuarioCreacion : localStorage.getItem('nombreUsuario'),
    listPermisos : [],
    idCanal: ''
  });
  const [canales, setCanales] = useState([]);
  const [permisosCanal, setPermisosCanal] = useState([]);

  const [selectedPermisos, setSelectedPermisos] = useState([]);

  useEffect(() => {
    setSelectedPermisos(
      formState.listPermisos.map((permiso) => ({
        value: permiso.nombre,
        label: permiso.nombre,
        idPermiso: permiso.idPermiso,
        estado: permiso.estado,
      }))
    );
  }, [formState.listPermisos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      listPermisos: [], // Reinicia los permisos cuando cambia la opción del canal
      idCanal: value // Conserva el valor de idCanal
    }));
    mostrarPermisos(value); // Actualiza los permisos según la opción seleccionada
  };  

  const handleChangePermisos = (selectedOptions) => {
    const selectedPermisos = selectedOptions.map((option) => ({
      idPermiso: option.idPermiso,
      nombre: option.value,
      estado: option.estado
    }));
  
    setFormState((prevState) => ({
      ...prevState,
      listPermisos: selectedPermisos
    }));
  
    // Filtrar los permisos disponibles
    const updatedPermisosCanal = permisosCanal.filter((permiso) => {
      // Verificar si el permiso seleccionado ya existe en los permisos seleccionados
      return !selectedPermisos.some((selectedPermiso) => selectedPermiso.idPermiso === permiso.idPermiso);
    });
  
    setPermisosCanal(updatedPermisosCanal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await CrearRol(formState);
      if (response.success === true) {
        toast.success(`${response.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            fontSize: '11px' // Tamaño de letra deseado
          }
        });
        setFormState({
          nombre : '',
          descripcion : '',
          mnemonico : '',
          estado : '',
          usuarioCreacion : '',
          listPermisos : []
        });
        // Cerrar el modal después de enviar el formulario
          setTimeout(() => {
          handleRefresh();
          handleCloseModal(false)
        }, 1500);
      } else {
        let errorMessage = 'Error al crear el usuario';
        if (response.code === 400) {
          errorMessage = 'Ha ocurrido un error en la solicitud';
          setCamposIncompletos(errorMessage);
        } else if (response.code === 500) {
          errorMessage = 'Ha ocurrido un error en el servidor';
        } else if (response.code === 401) {
          errorMessage = 'No estás autorizado para realizar esta acción';
        }
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            fontSize: '11px' // Tamaño de letra deseado
          }
        });
      }
    } catch (error) {
      console.error(error);
      setError('Error al enviar el formulario');
    }
  };

  useEffect(() => {
    consultaPermisos();
    obtenerPermisos();
    consultarCanales();
  }, []);

  useEffect(() => {
    mostrarPermisos(formState.idCanal);
  }, [formState.idCanal]);  

  const obtenerPermisos = async () => {
    try {
      const data = await ConsultarPermisos(userIdPermiso);
      setPermisos(data.data.listPermisos);
    } catch (error) {
      console.error(error);
    }
  };

  const consultaPermisos = async (idCanal) => {
    try {
      const response = await ConsultarPermisos(idCanal);
      const permisos = response.data.listPermisos;
      setPermisosCanal(permisos);
    } catch (error) {
      console.error('Error al consultar los permisos:', error);
    }
  };  

  const consultarCanales = async () => {
    try {
      const response = await ConsultarCanal();
      const canales = response.data.row;
      setCanales(canales);
    } catch (error) {
      console.error('Error al consultar los canales:', error);
    }
  };

  const mostrarPermisos = async (opcion) => {
    const canalSeleccionado = canales.find((canal) => canal.idCanal === opcion);
    if (canalSeleccionado) {
      const idCanal = canalSeleccionado.idCanal;
      await consultaPermisos(idCanal);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };  

  const opcionesCanal = consultaCanal.map((canal) => ({value: canal.nombre, label: canal.nombre}));

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <KeyIcon style={{ width: 50, height: 50 }} />
        </div>
          <h2>Crear nuevo Rol</h2>
          {showErrorMessage && (
            <div className="error-message">Todos los campos son obligatorios</div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre">
              <Form.Label>
                Nombre {<span className="error-message">*</span>}
              </Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                onChange={handleChange}
                required
                maxLength={45}
              />
            </Form.Group>

            <Form.Group controlId="descripcion">
              <Form.Label>
                Descripción {<span className="error-message">*</span>}
              </Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                onChange={handleChange}
                required
                maxLength={400}
              />
            </Form.Group>

            <Form.Group controlId="mnemonico">
              <Form.Label>
                Nemonico {<span className="error-message">*</span>}
              </Form.Label>
              <Form.Control
                as="textarea"
                name="mnemonico"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                required
                maxLength={150}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>
                Estado {<span className="error-message">*</span>}
              </Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formState.estado}
                onChange={handleChange}
                defaultValue={formState.estado[0]}
                required
              >
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="canal">
              <Form.Label>
                Canal <span className="error-message">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                name="canal"
                onChange={handleChange}
                required
                value={formState.idCanal}
              >
                <option value="">Seleccione un canal</option>
                {canales.map((canal) => (
                  <option key={canal.idCanal} value={canal.idCanal}>
                    {canal.nemonico}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="permiso">
              <Form.Label>
                Permiso <span className="error-message">*</span>
              </Form.Label>
              <Select
                options={permisosCanal.map((permiso) => ({
                  value: permiso.nombre,
                  label: permiso.nombre,
                  idPermiso: permiso.idPermiso,
                  estado: permiso.estado
                }))}
                isMulti
                value={selectedPermisos}
                onChange={handleChangePermisos}
              />
            </Form.Group>

            <Row className="justify-content-center">
              <Col md={4}>
                <Button

                  variant="primary"
                  type="submit"
                  className="btnblock"

                >
                  Crear
                </Button>
              </Col>
              
            </Row>

          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateRole;