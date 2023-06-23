import React, { useState } from "react";

const LoginToken = async (usuario, contrasenia) => {
  try {
    const base64 = {
      encode: (text) => {
        return btoa(text);
      }
    };
    
    const canales = process.env.REACT_APP_CANALES;
    const token = `Basic ${base64.encode(`${usuario}:${contrasenia}`)}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
      'Canal': canales
    };
    const requestOptions = {
      method: 'POST',
      headers
    };
    const response = await fetch(process.env.REACT_APP_API_TOKEN, requestOptions);
    const data = await response.json();
    
    // Guardar los valores en el localStorage
    if (data.success === true) { 
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('data', data.data.idUsuario);
    localStorage.setItem('nombreUsuario', data.data.nombres);
    localStorage.setItem('correoUsuario', data.data.correo);
    await ValidarToken();
    }
    return data; // Retornar los datos
    
  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función

  }
};


const ValidarToken = async () => {
  const nemonicoCanal = 'GOIT_SECURITY';
  try {
    const idUsuario = localStorage.getItem('data');
    const tokenUsuario = localStorage.getItem('token');
    const canales = process.env.REACT_APP_CANALES;
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      Canal: canales
    };
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        idUsuario,
        nemonicoCanal
      })
    };
    const response = await fetch(process.env.REACT_APP_VALIDAR_LOGIN_URL, requestOptions);
    const data = await response.json();
    localStorage.setItem('tokenValidado', data.data.token);
    localStorage.setItem('nombreUsuario', data.data.nombres);
    localStorage.setItem('correoUsuario', data.data.correo);
    console.log('data', data);
    await ConsultaUsuarios();
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};



const ConsultaUsuarios = async (filterName='T', checkedItems='E') => {
  
  try {

    const tokenUsuario = localStorage.getItem('token');
   
   
    const canales = process.env.REACT_APP_CANALES;
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      Canal: canales
    };
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const response = await fetch(`${process.env.REACT_APP_CONSULTAR_USUARIOS_URL}/${checkedItems}/${filterName}/?pagina=1&size=100`, requestOptions);

    const data = await response.json();
    return data; // Devolver los datos obtenidos

  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const CrearUsuario = async (datosUsuario) => {
  const base64 = {
    encode: (text) => {
      return btoa(text);
    }
  };
  
  const tokenUsuario = localStorage.getItem('token');
  const canales = process.env.REACT_APP_CANALES;
  const token = `Bearer ${tokenUsuario}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token,
    'Canal': canales
  };

  // Codificar la contraseña en base64
  
    
  const body = {
    "usuario": datosUsuario.usuario,
    "contrasenia": base64.encode(datosUsuario.contrasenia),
    "idEmpresa": datosUsuario.idEmpresa,
    "correo": datosUsuario.correo,
    "nombres": datosUsuario.nombres,
    "apellidos": datosUsuario.apellidos,
    "telefonoMovil": datosUsuario.telefonoMovil,
    "estado": datosUsuario.estado,
    "tipoIdentificacion": datosUsuario.tipoIdentificacion,
    "identificacion": datosUsuario.identificacion,
    "area": datosUsuario.area
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  try {
    const response = await fetch('http://desa.goitsa.me:8988/goit-security-api/v2/usuario/crearUsuario', requestOptions);
    const data = await response.json();
    return data; // Devolver los datos obtenidos
  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};



const EliminarUsuario = async (userId) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = process.env.REACT_APP_CANALES;
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      Canal: canales
    };
    const requestOptions = {
      method: 'DELETE',
      headers,
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/usuario/eliminarUsuario/${userId}`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ObtenerUsuarioPorId = async (userId) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = process.env.REACT_APP_CANALES;
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
      'Canal': canales
    };
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/usuario/obtenerUsuarioPorId/${userId}`, requestOptions);
    const data = await response.json();
    

    return data; // Devolver los datos obtenidos

  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const ActualizarUsuario = async (userId, datosUsuario, Altera) => {
  console.log(datosUsuario);
  console.log(Altera)
  const base64 = {
    encode: (text) => {
      return btoa(text);
    }
  };
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = process.env.REACT_APP_CANALES;
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
      'Canal': canales
    };
    const body = {
      "usuario": datosUsuario.usuario,
      "contrasenia": base64.encode(datosUsuario.contrasenia),
      "idEmpresa": datosUsuario.idEmpresa,
      "correo": datosUsuario.correo,
      "nombres": datosUsuario.nombres,
      "apellidos": datosUsuario.apellidos,
      "telefonoMovil": datosUsuario.telefonoMovil,
      "estado": datosUsuario.estado,
      "tipoIdentificacion": datosUsuario.tipoIdentificacion,
      "identificacion": datosUsuario.identificacion,
      "area": datosUsuario.area,
      "idUsuarioAltera": Altera
    };

    const requestOptions = {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/usuario/actualizarUsuario/${userId}`, requestOptions);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const ConsultarArea = async () => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canal = '5b538d10-fcb3-11ed-be56-0242ac120002';
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      Canal: canal
    };
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const response = await fetch('http://desa.goitsa.me:8988/goit-security-api/v2/area/consultarArea', requestOptions);
    const data = await response.json();
   
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




  export {
     LoginToken, ConsultaUsuarios, ValidarToken, CrearUsuario,
      EliminarUsuario, ObtenerUsuarioPorId, ActualizarUsuario, ConsultarArea
    
  }
  
