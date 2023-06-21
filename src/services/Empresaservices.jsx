import React, { useState } from "react";

const ConsultarEmpresas = async () => {
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
      const response = await fetch('http://desa.goitsa.me:8988/goit-security-api/v2/empresa/consultarEmpresas', requestOptions);
      const data = await response.json();
     
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export { ConsultarEmpresas };