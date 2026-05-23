import {RouterProvider} from 'react-router'
import { routes } from './app.routes'
import {useSelector} from 'react-redux'
import { useEffect } from 'react'
import { useAuth } from '../features/auth/hook/useAuth'

function App() {
  const {handleGetMe} = useAuth()

  
  useEffect(()=>{
    handleGetMe()
  },[])
  
  
  const {user} = useSelector((state)=>state.auth)
  console.log('Current user:', user)

  return (
    <RouterProvider router={routes} />
  )
}

export default App
