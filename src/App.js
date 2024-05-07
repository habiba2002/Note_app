import React from 'react'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Protected from './Components/Protected'

export default function App() {
  var routers = createBrowserRouter(
    [
      { path: "/", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/home", element: <Protected><Home /> </Protected> },

    ]
  )

  return <>
    <RouterProvider router={routers} />
  </>
}

