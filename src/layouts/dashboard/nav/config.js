import { useEffect, useState } from 'react';
import { ValidarToken } from '../../../services/Userservices';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const useNavConfig = () => {
  const [navConfig, setNavConfig] = useState([]);

  useEffect(() => {
    const fetchNavConfig = async () => {
      try {
        const response = await ValidarToken();
        const validarPermiso = response.data.listPermisos;
        const isValidViewUser = validarPermiso.some((permiso) => permiso.idPermiso === 10); // Inactivado
        const isValidViewRol = validarPermiso.some((permiso) => permiso.idPermiso === 11); // Activado

        const config = [
          isValidViewUser && {
            key: 'usuarios',
            title: 'Usuarios',
            path: '/security/user',
            icon: icon('ic_user'),
          },
          isValidViewRol && {
            key: 'roles',
            title: 'Roles',
            path: '/security/rol',
            icon: icon('ic_lock'),
          },
        ].filter(Boolean);

        setNavConfig(config);
      } catch (error) {
        console.error(error);
        setNavConfig([]);
      }
    };

    fetchNavConfig();
  }, []);

  return navConfig;
};

export default useNavConfig;
