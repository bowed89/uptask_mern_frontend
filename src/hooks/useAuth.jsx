import {useContext} from 'react'
import AuthContext from '../context/AuthProvider'

const useAuth = () => {
    // su funcion es extraer todos los states, funciones, valores, etc..
    // del AuthProvider.jsx
    return useContext(AuthContext)
}

export default useAuth