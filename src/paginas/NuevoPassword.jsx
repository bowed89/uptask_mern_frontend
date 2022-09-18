import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import clienteAxios from "../config/clienteAxios"

import Alerta from '../components/Alerta'

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)

  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})

  const params = useParams()
  const { token } = params

  useEffect(() => {
    // Comprobar que el token recibido para cambiar el email es valido
    const comprobarToken = async () => {
      try {
        await clienteAxios.get(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })

      }
    }
    comprobarToken()

  }, [])

  const handleSubmit = async e => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: 'El password debe ser mínimo de 6 carácteres',
        error: true
      })
      return
    }
    // Cambiar Password
    try {
      const url = `/usuarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, { password })
      setAlerta({
        msg: data.msg,
        error: false
      })

      setPasswordModificado(true)

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl text-center capitalize">
        Reestablece tu password y no pierdas acceso a tus {''} <span className="text-slate-700">proyectos</span>
      </h1>

      {Object.keys(alerta).length > 0 && <Alerta alerta={alerta} />}

      {tokenValido && (

        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="Guardar nuevo Password"
            className="bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded
             hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'
        >Inicia Sesión</Link>
      )}

    </>
  )
}

export default NuevoPassword