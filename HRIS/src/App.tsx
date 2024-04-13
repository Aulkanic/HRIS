import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouterUrl } from './routes';
import { Private, Public } from './layout';
import './App.css'
import { Error, Home, Login } from './pages';

function App() {
  const router = createBrowserRouter([
    {
      path: RouterUrl.Login,
      element: <Public />,
      errorElement: <Error />,
      children:[
        {
          path: RouterUrl.Login,
          element:<Login />
        },
      ]
    },
    {
      path: RouterUrl.Login,
      element: <Private />,
      errorElement: <Error />,
      children:[
        {path:RouterUrl.Home,element:<Home/>},
      ]
    },
  ])
  return (
    <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
  )
}

export default App
