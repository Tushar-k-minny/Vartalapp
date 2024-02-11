import axios from 'axios'
import React from 'react'
import { useState, useContext } from 'react'
import { UserContext } from './userContext.jsx'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { toastOptions } from './utils/Toast.js'
import "react-toastify/dist/ReactToastify.css"
// import Login from './Login.jsx'
const Register = () => {
  const [values, setValues] = useState({
    "username": "",
    "email": "",
    "password": "",
    "confPassword": ""
  })

  //context 
  const { setLoginInfo } = useContext(UserContext)

  const validate = () => {
    const { password, confPassword, username, email } = values;

    if (username.length < 8 || username.length > 20) {
      toast.warning("Username should be at least 8 letters", toastOptions)
      return false
    }
    if (!(/\S+@\S+\.\S+/.test(email))) {
      toast.error("Enter a valid email", toastOptions)
      return false
    }
    if (password !== confPassword) {
      toast.error("Password and Confirm Password must be same", toastOptions)
      return false;
    }
    return true;
  }


  const handleChange = (e) => {
    return setValues({ ...values, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validate()) {
      const { data } = await axios.post('/api/auth/register', { username: values.username, password: values.password, email: values.email })

      setLoginInfo({
        username: values.username,
        id: data._id
      })

    }


  }

  const classes = {


    logo: "w-100 flex  justify-center mb-10 align-middle gap-4",
    input: ' w-72 p-2   rounded mx-auto mb-4 border-solid border-2 border-cyan-500',
    label: 'ml-4 ',
    form: ' bg-yellow-50 rounded-lg w-96 py-10 h-auto mx-auto flex flex-col gap-4 text-black ',
  }


  return (
    <div className=' bg-gradient-to-t from-zinc-500 to-slate-500  w-100 h-screen flex flex-col justify-center  align-middle text-cyan-800'>
      <form
        className={classes.form}
        onSubmit={e => submitHandler(e)}
      >
        <div className={classes.logo}>
          <img src="./vite.svg" />
          <span className='text-3xl font-bold  text-cyan-700'>Register Now!</span>
        </div>


        <input
          type="text"

          name={"username"}
          onChange={e => handleChange(e)}


          placeholder='Username'
          className={classes.input}


        ></input>



        <input
          type='email'
          placeholder='Email'
          className={classes.input}

          name={"email"}
          onChange={e => handleChange(e)}


        >
        </input>

        <input
          type="password"
          placeholder='Password'
          className={classes.input}

          name={"password"}
          onChange={e => handleChange(e)}


        ></input>
        <input
          type="password"
          placeholder='Confirm Password'
          name='confPassword'
          className={classes.input}
          onChange={e => handleChange(e)}

        ></input>
        <div
          className='flex flex-col justify-center align-middle w-100  '>

          <button className=' w-80 mb-2 mx-auto rounded-lg px-4 py-2 bg-purple-500   text-blue-50' onClick={e => submitHandler(e)}>Register </button>
          <span className='text-center text-slate-500 '>Already a User ? <Link to="/" className='pointer text-blue-400'>Login</Link></span>
        </div>
      </form>

    </div>
  )
}

export default Register