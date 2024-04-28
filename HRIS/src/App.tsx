import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouterUrl } from './routes';
import { Private, Public } from './layout';
import './App.css'
import { AddGuestForm, AddReservationForm, ClientPage, DepartmentPage, Error, Home, Login, ReservationPage, RoomPage, SettingPage, TransactionPage } from './pages';

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
        {path:RouterUrl.AddGuest,element:<AddGuestForm/>},
        {path:RouterUrl.AddReservation,element:<AddReservationForm/>},
        {path:RouterUrl.Client,element:<ClientPage/>},
        {path:RouterUrl.Department,element:<DepartmentPage/>},
        {path:RouterUrl.Reservation,element:<ReservationPage/>},
        {path:RouterUrl.Room,element:<RoomPage/>},
        {path:RouterUrl.Transaction,element:<TransactionPage/>},
        {path:RouterUrl.Setting,element:<SettingPage/>},
      ]
    },
  ])
  return (
    <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
  )
}

export default App
