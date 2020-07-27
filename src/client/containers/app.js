import React from 'react'
import { useSelector } from 'react-redux'


const App = () => {
  const message = useSelector(state => state.message) 
  return (
  <span>{message}</span>
  )
}
export default(App)


