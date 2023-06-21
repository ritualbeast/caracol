// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Usuarios',
    path: '/user',
    icon: icon('ic_user'),
  },
  {	
    title: 'Roles',
    path: '/role',
    icon: icon('ic_lock'),
  },

];


export default navConfig;
