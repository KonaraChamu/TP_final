import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Page from './components/Pages/Page.jsx';
import AuthForm from './components/AuthForm.jsx';
import PaymentSuccess from './components/Pages/PaymentSuccess.jsx';
import Unauthorised from './components/Pages/Unauthorized.jsx';
import Missing from './components/Missing.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Payment from './components/Payment.jsx';
import Menu from './components/Pages/Menu.jsx';
import Orders from './components/Pages/Orders.jsx';
import Root from './components/Pages/Root.jsx';

const router = createBrowserRouter([
  { path: '/', exact: true, element: <Navigate to="/page/orders" /> },
  {
    path: '/*',
    element: <Root />,
    children: [
      {
        path: 'auth',
        element: <AuthForm />,
      },
      {
        path: 'page',
        element: <Page />,
        children: [
          {
            path: '',
            element: <RequireAuth allowedRoles={['CLIENT', 'CHEF']} />,
            children: [
              {
                path: 'orders',
                element: <Orders />,
              },
            ],
          },
          {
            path: '',
            element: <RequireAuth allowedRoles={['CLIENT']} />,
            children: [
              {
                path: 'menu',
                element: <Menu />,
              },
              {
                path: 'payment',
                element: <Payment />,
              },
              {
                path: 'payment-success',
                element: <PaymentSuccess />,
              },
            ],
          },
        ],
      },
      {
        path: 'unauthorized',
        element: <Unauthorised />,
      },
      {
        path: '*',
        element: <Missing />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ChakraProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
