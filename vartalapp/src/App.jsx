import axios from 'axios'
import { ClientRoutes } from "./Routes.jsx";
import { UserContextProvider } from './userContext.jsx';
import { ToastContainer } from 'react-toastify';

function App() {


  axios.defaults.baseURL = "http://localhost:4400"
  axios.defaults.withCredentials = true;
  return (

    <UserContextProvider>
      <ClientRoutes />
      <ToastContainer  />

    </UserContextProvider>
  )
}

export default App
