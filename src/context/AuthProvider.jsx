import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'

import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    // usamos este state para verificar si ya termino de cargar el useEffect
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setCargando(false)
                return
            }
            // Usamos para los middlewares de las rutas del backend que tenga token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                navigate('/proyectos')

            } catch (error) {
                setAuth({})
            }

            setCargando(false)

        }
        autenticarUsuario()

    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }


    return (
        // Acá se coloca todas las funciones, states, etc, que quiero
        // compartir con los otros componentes de la app
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>

    )
}

export {
    AuthProvider,
}

export default AuthContext;