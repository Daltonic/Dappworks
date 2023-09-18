import { Outlet, Navigate } from 'react-router-dom'
import { getGlobalState, setGlobalState } from '../store'
import { useState } from 'react'
import { isUserLoggedIn } from '../services/chat'

const AuthenticatedRoutes = () => {
  const currentUser = getGlobalState('currentUser')
  const [checked, setChecked] = useState(false)

  isUserLoggedIn().then((user) => {
    setGlobalState('currentUser', JSON.parse(JSON.stringify(user)))
    setChecked(true)
  })

  return checked && !currentUser ? <Navigate to="/authenticate" /> : <Outlet />
}

export default AuthenticatedRoutes
