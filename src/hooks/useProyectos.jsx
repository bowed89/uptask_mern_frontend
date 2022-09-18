import { useContext } from 'react'
import ProyectosContext from '../context/ProyectosProvider'

const useProyectos = () => {

    // su funcion es extraer todos los states, funciones, valores, etc..
    // de ProyectosProvider.jsx
    return useContext(ProyectosContext)
}

export default useProyectos