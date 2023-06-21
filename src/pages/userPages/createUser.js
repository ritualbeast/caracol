import React, { useState, useEffect } from 'react';
import '../../styles/createuser.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import PersonIcon from '@material-ui/icons/Person';
import { includes } from 'lodash';
import Empresas from '../../_mock/empresas';
import { CrearUsuario, ConsultarArea } from '../../services/Userservices';
import { ConsultarEmpresas } from '../../services/Empresaservices';

const CreateUser = ({handleCloseModal, handleRefresh}) => {
  
  const [error, setError] = useState("");
  const [camposIncompletos, setCamposIncompletos] = useState([]);
  const [tipoIdentificacionSeleccionado, setTipoIdentificacionSeleccionado] = useState('');
  const [formState, setFormState] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefonoMovil: "",
    usuario: "",
    contrasenia: "",
    idEmpresa: Empresas.length > 0 ? Empresas[0].id : "",
    tipoIdentificacion: "",
    identificacion: "",
    estado: "A",
    area: "",
  });

  useEffect(() => { 
    consultarEmpresas();
    consultararea();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    let sanitizedValue = value;
  
    // Validaciones y limitaciones de longitud
    if (name === 'telefonoMovil' || name === 'identificacion') {
      sanitizedValue = value.replace(/\s+/g, '').replace(/\D/g, '').slice(0, 10);
    } else if (name === 'correo') {
      sanitizedValue = value.replace(/\s+/g, '').slice(0, 150);

    } else if (name === 'usuario' || name === 'contrasenia') {
      sanitizedValue = value.replace(/\s+/g, '').slice(0, 45);
    }
    else if (name === 'apellidos' || name === 'nombres' || name === 'area') {
      sanitizedValue = value.slice(0, 45);
    }
  
    if (name === 'tipoIdentificacion') {
      setTipoIdentificacionSeleccionado(value);
    }
  
    setFormState((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCamposIncompletos([]);
    if (formState.telefonoMovil.length !== 10 || !formState.telefonoMovil.startsWith('09')
      ) {
      toast.error('El Telefono debe tener 10 números y comenzar con 09', {
        autoClose: 2000}
      );
      return;
    }
    
    try {
      const response = await CrearUsuario(formState);
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
          nombres : '',
          apellidos : '',
          correo : '',
          telefonoMovil : '',
          usuario : '',
          contrasenia : '',
          idEmpresa : '1',
          tipoIdentificacion : '',
          identificacion : '',
          estado : 'A',
        });
        // Cerrar el modal después de enviar el formulario
        setTimeout(() => {
          handleCloseModal(false)
        }, 1500);
        handleRefresh();
      } else {
        let errorMessage = 'Error al crear el usuario';
        if (response.code === 400) {
          errorMessage = response.message;
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


  const getBorderStyle = (fieldName) => {
    if (formState[fieldName] === '' && fieldName !== 'identificacion' && fieldName !== 'tipoIdentificacion') {
      return { borderColor: '#E5664B' };
    }
    if (formState[fieldName] !== '' && fieldName !== 'identificacion' && fieldName !== 'tipoIdentificacion') {
      return { borderColor: '#ced4da' };
    }
    return {};
  };
  
  // crear consumo empresa
  const [empresas, setEmpresas] = useState([]);
  const consultarEmpresas = async () => {
    try {
      const response = await  ConsultarEmpresas();
      
      setEmpresas(response.data.row);
    } catch (error) {
      console.error(error);
    }
  };

  // consumo de area
  const [areas, setAreas] = useState([]);
  const consultararea = async () => {
    try{
      const response = await ConsultarArea();
      const areas = response.data.areas;
      console.log(areas);
      setAreas(areas);
    }
    catch (error) {
      console.error('Error al consultar los canales:', error);
    }
  }
  
  return (
    <Container >
      <ToastContainer />
      <Row className="justify-content-center">
        <Col>
          < PersonIcon  style={{ width: 50, height: 50 }}/>
          <h2>Crear nuevo Usuario</h2>
          
          <Form onSubmit={handleSubmit}>
          
            <Form.Group  className='formuser' controlId="firstName">
            <Form.Label>Nombres <span className="required-asterisk">*</span></Form.Label>
            <Form.Control
              type="text"
              name="nombres"
              value={formState.nombres}
              onChange={handleChange}
              required
              style={getBorderStyle('nombres')}
              placeholder='Nombres'
            />
            </Form.Group>

            <Form.Group className='formuser' controlId="lastName">
                  <Form.Label>Apellidos  <span className="required-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidos"
                    value={formState.apellidos}
                    onChange={handleChange}
                    required
                    style={getBorderStyle('apellidos')}
                    placeholder='Apellidos'
                  />
            </Form.Group>
              
            <Form.Group className='formuser' controlId="email">
              <Form.Label>Correo Electronico  <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formState.correo}
                onChange={handleChange}
                required
                style={getBorderStyle('correo')}
                placeholder='Correo Electronico'
              />
            </Form.Group>
            
            <Form.Group className='formuser' controlId="phone">
              <Form.Label>Telefono  <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="text"
                name="telefonoMovil"
                value={formState.telefonoMovil}
                onChange={handleChange}
                required
                style={getBorderStyle('telefonoMovil')}
                placeholder='Telefono movil'
              />
            </Form.Group>

            <Form.Group className='formuser' controlId="user">
              <Form.Label>Usuario  <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={formState.usuario}
                onChange={handleChange}
                required
                style={getBorderStyle('usuario')}
                placeholder='Usuario'
              />
            </Form.Group>

            <Form.Group className='formuser' controlId="password">
              <Form.Label>Contraseña  <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="password"
                name="contrasenia"
                value={formState.contrasenia}
                onChange={handleChange}
                required
                style={getBorderStyle('contrasenia')}
                placeholder='Contraseña'
              />
            </Form.Group>

            <Form.Group className='formuser' controlId="company">
              <Form.Label>Empresa <span className="required-asterisk">*</span></Form.Label>
              
              <Form.Control
                as="select"
                name="idEmpresa"
                onChange={handleChange} // Pasar el evento completo en lugar de event.target.value
                required
                value={formState.idEmpresa}
                style={getBorderStyle('idEmpresa')}
              >
                {empresas.map((empresa) => (
                  <option key={empresa.idEmpresa} value={empresa.idEmpresa}>{empresa.nombre}</option> // Agregar value={empresa.idEmpresa} al option
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className='formuser' controlId="area">
              <Form.Label>
                Area <span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                name="canal"
                onChange={handleChange}
                required
                value={formState.area}
                defaultValue={formState.area[0]}
              >
                {areas.map((area) => (
                  <option key={area.idArea} value={area.idArea}>
                    {area.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className='formuser' controlId="identificationType">
              <Form.Label>Tipo de Identificacion</Form.Label>
              <Form.Control
                as="select"
                name="tipoIdentificacion"
                value={formState.tipoIdentificacion}
                defaultValue={formState.tipoIdentificacion[0]}
                onChange={handleChange}
                style={getBorderStyle('tipoIdentificacion')}
                
              >
                <option value="">Seleccione...</option>
                <option value="CED">Cedula de Ciudadania</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className='formuser' controlId="identification">
              <Form.Label>Identificacion</Form.Label>
              <Form.Control

                type="text"
                name="identificacion"
                value={formState.identificacion}
                onChange={handleChange}
                style={getBorderStyle('identificacion')}
                placeholder='Identificacion'
                disabled={!tipoIdentificacionSeleccionado}
              />
            </Form.Group>

            <Form.Group className='formuser' controlId="status">
              <Form.Label>Estado  <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formState.estado}
                onChange={handleChange}
                defaultValue={formState.estado[0]}
                required
                style={getBorderStyle('estado')}
              >
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </Form.Control>
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

export default CreateUser;