/* eslint-disable prefer-const */

import React, { useEffect, useState } from 'react';
import '../../styles/modificaruser.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import PersonIcon from '@material-ui/icons/Person';
import Empresas from '../../_mock/empresas';
import { ConsultarRolUsuario, ActualizarRolUsuario } from '../../services/Roleservices';
import { ObtenerUsuarioPorId, ActualizarUsuario, ConsultarArea } from '../../services/Userservices';
import { ConsultarRoles } from '../../services/ServicesRol';

const ModificarUser = (props) => {
  const { handleCloseModificar, userId, userIdRol, handleRefresh } = props;
  const [datosRecibidosporId, setDatosRecibidosporId] = useState([]);
  const [error, setError] = useState("");
  const [camposIncompletos, setCamposIncompletos] = useState([]);
  const [tipoIdentificacionSeleccionado, setTipoIdentificacionSeleccionado] = useState('');
  const [formState, setFormState] = useState({
    nombres : '',
    apellidos : '',
    correo : '',
    telefonoMovil : '',
    usuario : '',
    contrasenia : '',
    idEmpresa : '',
    tipoIdentificacion : '',
    identificacion : '',
    estado : '',
    idUsuario: '',
    area: '',
  });
  const [formStateRol, setFormStateRol] = useState([]);
  const [formStateRolBase, setFormStateRolBase] = useState([]);

  const [consultaRol, setConsultaRol] = useState([]);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);

  const [userName, setUserName] = useState(localStorage.getItem('nombreUsuario'));

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    let sanitizedValue = value;
    if (event.target.name !== 'idRol') {
      setFormState({ ...formState, [event.target.name]: event.target.value });
    }
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
  
  useEffect(() => {
    fetchData();
    consultarRol();
    rolesGenerales();
    consultararea();
  }, []);

  useEffect(() => {
      const objeTemp = [];

      opcionesSeleccionadas.forEach((op)=>{
          consultaRol.forEach((rol)=>{
            if(op.value === rol.nombre){
              objeTemp.push(
                {
                  "idRol": rol.idRol ,
                  "descripcion": rol.descripcion,
                  "estado": rol.estado,
                  "usuarioCreacion": userName
                }
              );
            }
          })
      })

    setFormStateRol(objeTemp);
  }, [opcionesSeleccionadas]);

  
  const fetchData = async () => {
    try {
      const response = await ObtenerUsuarioPorId(userId);
      const data = await response;
      setDatosRecibidosporId(response);
      const contraseniaDecodificada = atob(data.data.contrasenia);
      setFormState({
        nombres: data.data.nombres,
        apellidos: data.data.apellidos,
        correo: data.data.correo,
        telefonoMovil: data.data.telefonoMovil,
        usuario: data.data.usuario,
        contrasenia: contraseniaDecodificada,
        idEmpresa: data.data.idEmpresa,
        identificacion: data.data.identificacion,
        tipoIdentificacion: data.data.tipoIdentificacion,
        estado: data.data.estado,
        area: data.data.area,
      });
      setTipoIdentificacionSeleccionado(data.data.tipoIdentificacion);
  
    } catch (error) {
      console.error(error);
    }
  };  

  const sendData = async () => {
    try {
      const response = await ActualizarUsuario(userId, formState);
      
      const responseRol = await ActualizarRolUsuario(userIdRol, formStateRol)
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log (formState);
  
    try {
      const response = await ActualizarUsuario(userId, formState);
      
      if (response.success === true) {
        toast.success(`${response.message}`, {
          // Configuración del toast
        });
        // Cerrar el modal después de enviar el formulario
        setTimeout(() => {
          handleRefresh();
          handleCloseModificar(false)
        }, 1500);
      } else {
        // Manejo de errores de respuesta
        let errorMessage = 'Error al crear el usuario';
        if (response.code === 400) {
          errorMessage = response.message;
          setCamposIncompletos(errorMessage);
        } else if (response.code === 500) {
          errorMessage = response.message;
        } else if (response.code === 401) {
          errorMessage = response.message;
        } else {
          errorMessage = 'Ha ocurrido un error inesperado';
        }
        setError(errorMessage);
        toast.error(errorMessage, {
          // Configuración del toast
        });
      }
    
      // Actualizar el rol existente
      

      let objSendI = [];
      formStateRolBase.forEach(element => {
        let validate=false;
        formStateRol.forEach(el => {
          if (element.idRol === el.idRol) { 
                 

            validate=true
          }   
        });
        if (validate === false) console.log('inactiva:', element.idRol)
        if (!validate) element.estado = 'I';
        if (!validate) objSendI.push(element);
      });



      let objSend = [];

      if (objSendI.length !== 0) {
        objSend = formStateRol;
        objSendI.forEach((data) =>{
          objSend.push(data);
        })
        
      }else{
        objSend = formStateRol
      }


      const responseActualizarRol = await ActualizarRolUsuario(userId, objSend);

    } catch (error) {
      console.error(error);
      setError('Error al enviar el formulario');
      toast.error('Ha ocurrido un error inesperado, contacta al soporte técnico para obtener ayuda', {
        // Configuración del toast para el error capturado
      });
    }
  };  
  
  const consultarRol = async () => {
    try {
      const response = await ConsultarRolUsuario(userId);
      
      const roles = response.data.listRoles;
      setOpcionesSeleccionadas(roles.map((rol) => ({ 
        value: rol.nombre, 
        label: rol.nombre,
        idEmpresa: rol.nombre,
        idUsuario: rol.nombre,
        usuario: rol.nombre
      })));

      const objeTemp = [];


      roles.forEach((rol)=>{
          objeTemp.push(
            {
              "idRol": rol.idRol ,
              "descripcion": rol.descripcion,
              "estado": rol.estado,
              "usuarioCreacion": userName
            }
          );

      })
      setFormStateRolBase(objeTemp)

    } catch (error) {
      console.error('Error al consultar los roles:', error);
      // Manejar el error de consulta de roles
    }
  };

  const rolesGenerales = async () => {
    try {
      const response = await ConsultarRoles();
      
      const roles = response.data.listRoles;
    
      setConsultaRol(roles);
    } catch (error) {
      console.error('Error al consultar los roles:', error);
    }
  };

  const opcionesRol = consultaRol
  .filter((rol) => rol.estado === "A")
  .sort((a, b) => a.nombre.localeCompare(b.nombre))
  .map((rol) => ({ value: rol.nombre, label: rol.nombre }));
  
  const handleOptionChange = (selectedOptions) => {
    setOpcionesSeleccionadas(selectedOptions);

  };
  
  const handleOptionDelete = (removedOption) => {
    const updatedOptions = opcionesSeleccionadas.filter(option => option !== removedOption);
    setOpcionesSeleccionadas(updatedOptions);
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
    };
  
  return (
    <>
      <ToastContainer />
      <Container >
        <Row className="justify-content-center">
          <Col>
            < PersonIcon  style={{ width: 50, height: 50 }}/>
            <h2>Editar Usuario</h2>
            < Form>
            
              <Form.Group  className='formuser' controlId="firstName">
              <Form.Label>Nombres <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={formState.nombres}
                onChange={handleChange}
                required
              />
              </Form.Group>

              <Form.Group className='formuser' controlId="lastName">
                    <Form.Label>Apellidos  <span className="required-asterisk">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidos"
                      value={formState.apellidos}
                      onChange={handleChange}
                      
                    />
              </Form.Group>
              
              <Form.Group className='formuser' controlId="email">
                <Form.Label>Correo Electronico  <span className="required-asterisk">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={formState.correo}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className='formuser' controlId="phone">
                <Form.Label>Telefono  <span className="required-asterisk">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="telefonoMovil"
                  value={formState.telefonoMovil}
                  onChange={handleChange}
                  
                />
              </Form.Group>

              <Form.Group className='formuser' controlId="user">
                <Form.Label>Usuario  <span className="required-asterisk">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  value={formState.usuario}
                  onChange={handleChange}
                  
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
                />
              </Form.Group>

              <Form.Group className='formuser' controlId="company">
                <Form.Label>Empresa  <span className="required-asterisk">*</span></Form.Label>
                <Form.Control
                  as="select" // cambia el tipo de input a select
                  name="idEmpresa"
                  value={formState.idEmpresa}
                  defaultValue={formState.idEmpresa[0]}
                  onChange={handleChange}
                  required
                >
                  {Empresas.map((empresa) => (
                    <option key={empresa.nombre} value={empresa.id}>{empresa.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>


              <Form.Group className='formuser' controlId="area">
                <Form.Label>
                  Area <span className="required-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="area"
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
                  onChange={handleChange}
                  required
                  
                >
                  <option value="">Selecciona un tipo de identificación</option>
                  <option value="CED" selected={formState.tipoIdentificacion === "CED"}>Cedula de Ciudadania</option>
                  {/* Agrega más opciones aquí */}
                </Form.Control>
              </Form.Group>

              <Form.Group className='formuser' controlId="identification">
                <Form.Label>Identificacion</Form.Label>
                <Form.Control

                  type="text"
                  name="identificacion"
                  value={formState.identificacion}
                  onChange={handleChange}
                  required
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
                  required
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="formuser" controlId="rol">
                <Form.Label>Rol <span className="required-asterisk">*</span></Form.Label>
                  <Select
                    options={opcionesRol}
                    isMulti
                    value={opcionesSeleccionadas}
                    onChange={handleOptionChange}
                    components={{
                      MultiValueRemove: ({ innerProps, data }) => (
                        <span id='rolSpan'
                          {...innerProps}
                          onClick={() => handleOptionDelete(data)}
                          onKeyPress={() => {}}
                          role="button"
                          tabIndex={0}
                        >
                          &times;
                        </span>
                      )
                    }}
                  />
              </Form.Group>
              <br/> 
              
              <Row className="justify-content-center">
                <Col md={4}>
                  <Button

                    variant="primary"
                    onClick={handleSubmit }
                    className="btnblock"
                  >
                    Modificar usuario
                  </Button>
                </Col>
              </Row>
            </Form>
            
          </Col>
        </Row>
      </Container>
    </>
    
  );
};

export default ModificarUser;
