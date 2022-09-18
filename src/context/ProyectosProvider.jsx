import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Colaborador from '../components/Colaborador';
import clienteAxios from '../config/clienteAxios';
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios.get('/proyectos', config)
                setProyectos(data);


            } catch (error) {
                console.log(error);
            }
        }

        obtenerProyectos()

    }, [auth])

    const obtenerTodosProyectos = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.get('/proyectos', config)
            setProyectos(data)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)

    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 5000)
    }

    const submitProvider = async proyecto => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        }
        else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            // Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState =>
                proyectoState._id === data._id ? data : proyectoState)

            setProyectos(proyectosActualizados);

            // Mostrar alerta
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            // Obtengo los proyectos q tengo y agrego a ese listado el nuevo proyecto
            // que agregue y asi evito llamar otra consulta a la BD
            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyectoPorId = async id => {

        setCargando(true)

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data);
            setAlerta({})

        } catch (error) {
            navigate('/proyectos')

            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 2000);

        } finally {
            setCargando(false)
        }

        setCargando(false)
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            // Sincronizar los proyectos
            const proyectosEliminados = proyectos.filter(proyectoEliminado =>
                proyectoEliminado._id !== id)

            setProyectos(proyectosEliminados);

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }


    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET
            socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error);
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas`, tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            // Socket IO
            socket.emit('nueva tarea', data)

        } catch (error) {
            console.log(error);
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setModalEliminarTarea(false)

            //SOCKET
            socket.emit('eliminar tarea', tarea)

            setTarea({})

            setTimeout(() => {
                setAlerta({})
            }, 3000)


        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {
        setCargando(true)

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)

            setColaborador(data)
            setAlerta({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 2000);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        console.log(colaborador);
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        console.log(colaborador);
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,
                { id: colaborador._id }, config)

            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(p => p._id !== colaborador._id)

            setProyecto(proyectoActualizado)


            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 2000);

        } catch (error) {
            console.log(error);
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            // SOCKET 
            socket.emit('cambiar estado', data)

            setTarea({})
            setAlerta({})

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // Socket IO
    const submitTareasProyecto = (tarea) => {
        //Agregar tarea al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(p => p._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        //Agregar tarea al state
        const edicionProyecto = { ...proyecto }
        const actualizarTareas = edicionProyecto.tareas.map(h => h._id === tarea._id ? tarea : h)
        edicionProyecto.tareas = actualizarTareas
        setProyecto(edicionProyecto)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(p => p._id === tarea._id ? tarea : p)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }


    return (
        <ProyectosContext.Provider
            value={{
                obtenerTodosProyectos,
                proyectos,
                mostrarAlerta,
                alerta,
                submitProvider,
                obtenerProyectoPorId,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >{children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext