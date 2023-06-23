// Saludos
// cordiales
// nuevo
// pasante
//  IMPORTANTE:
// 1. ESTE CODIGO ES COPIA DE LA COPIA DE LA COPIA DE LA COPIA
// 2. INTENTA NO ROMPER EL CODIGO
// 3. SI TIENES PROBLEMAS, NO DESESPERES, PREGUNTAR POR JULIO Y JORGE
// 3.5 SI JORGE Y JULIO NO ESTAN ES PORQUE FUERON ASCENDIDOS A CLIENTES
// 4. SI SE ROMPE EL API ES CULPA DE BENJAMIN Y ANDRES
// 5. NO COMER EN LA OFICINA EL DESAYUNO Y CUIDADO TE DESCUENTAN
// 6. CHATGPT ES UNA MIERDA Y GOD
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CreateUser from './pages/userPages/createUser';
import RolesPage from './pages/Roles';
// ----------------------------------------------------------------------
export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/security/login" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'security/user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'createUser', element: <CreateUser /> },
        { path: 'security/rol', element: <RolesPage /> },
      ],
    },
    {
      path: 'security/login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/security/user" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
  return routes;
}