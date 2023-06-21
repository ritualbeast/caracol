const ConsultarRoles = async (filterName='T', checkedItems='E') => {
  try {
    const tokenUsuario = localStorage.getItem('token');
   
    const canales = '5b538d10-fcb3-11ed-be56-0242ac120002';
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
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/roles/consultarRoles/${checkedItems}/${filterName}/?pagina=1&size=100`, requestOptions);
    const data = await response.json();
    
    return data; // Devolver los datos obtenidos

  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const ConsultarPermisos = async (canalxDefecto) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = '5b538d10-fcb3-11ed-be56-0242ac120002';
    const token = `Bearer ${tokenUsuario}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      canal: canales // Cambio realizado aquí
    };
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/permisos/consultarPermisosPorIdCanal/${canalxDefecto}`, requestOptions);
    const data = await response.json();
    return data; // Devolver los datos obtenidos
  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const CrearRol = async (datosRol) => {
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
      nombre: datosRol.nombre,
      descripcion: datosRol.descripcion,
      mnemonico: datosRol.mnemonico,
      estado: datosRol.estado,
      usuarioCreacion: datosRol.usuarioCreacion,
      listPermisos: datosRol.listPermisos
    };

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    };
    const response = await fetch('http://desa.goitsa.me:8988/goit-security-api/v2/roles/crearRolesPermisos', requestOptions);
    const data = await response.json();

    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ConsultarRolPorId = async (rolId) => {
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
      headers,
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/roles/consultarRolPorId/${rolId}`, requestOptions);
    const data = await response.json();
    
    return data; // Devolver los datos obtenidos

  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const ActualizarRolesConPermisos = async (rolId, userData) => {
  
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
      method: 'PUT',
      headers,
      body: JSON.stringify(userData)
    };
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/roles/actualizarRolesConPermisos/${rolId}`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const EliminarRol= async (roleId) => {
  try {
    const tokenUsuario = localStorage.getItem('token');
    const canales = '5b538d10-fcb3-11ed-be56-0242ac120002';
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
    const response = await fetch(`http://desa.goitsa.me:8988/goit-security-api/v2/roles/eliminarRol/${roleId}`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ConsultarCanal = async () => {
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
    const url = 'http://desa.goitsa.me:8988/goit-security-api/v2/canal/consultarCanales';
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  export {
    ConsultarRoles,
    ConsultarPermisos,
    CrearRol,
    ConsultarRolPorId,
    ActualizarRolesConPermisos,
    EliminarRol,
    ConsultarCanal
 }
 