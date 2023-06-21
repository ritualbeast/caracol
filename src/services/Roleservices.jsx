import React, { useState } from "react";

const ConsultarRolUsuario = async (idRol) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = '5b538d10-fcb3-11ed-be56-0242ac120002';
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
      'Canal': canales
    };
    const requestOptions = {
      method: 'GET',
      headers
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/usuario/roles/consultarRolPorUsuario/${idRol}`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const AsignarRolUsuario = async (datosRolUsuario) => {
  try {
    const canales = '49a5f60a-9f56-4feb-bcf1-5377c6152efSA';
    const headers = {
      'Canal': canales
    };
    const body = {
        "idUsuario": datosRolUsuario.idUsuario,
        "listRoles":[
          {
              "idRol": datosRolUsuario.idRol,
              "descripcion": datosRolUsuario.descripcion,
              "estado": datosRolUsuario.estado,
              "usuarioCreacion": datosRolUsuario.usuarioCreacion
          }
        ]
    };
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(body)
    };
    const response = await fetch('http://desa.goitsa.me:8988/goit-security-api/v2/usuario/roles/asignarRolUsuario', requestOptions);
    const data = await response.json();
    

    return data; // Devolver los datos obtenidos

  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const ActualizarRolUsuario = async (userIdRol, userData) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = '5b538d10-fcb3-11ed-be56-0242ac120002';
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
      'Canal': canales
    };

    const body = {
      "listRoles":userData
    }

    const requestOptions = {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/usuario/roles/actualizarRolUsuario/${userIdRol}`, requestOptions);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  export {
    ConsultarRolUsuario, 
    AsignarRolUsuario,
    ActualizarRolUsuario
  }
  