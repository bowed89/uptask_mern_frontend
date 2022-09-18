import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  const params = useParams(); //obtenemos el token de la url
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios.get(url)

        setAlerta({
          msg: data.msg,
          error: false
        })

        setCuentaConfirmada(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    return () => { confirmarCuenta() } // solo para que renderice una vez y no dos veces

  }, [])


  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl text-center capitalize">
        Confirma tu cuenta y comienza a crear tus {''} <span className="text-slate-700">proyectos</span>
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 bg-white">
        {Object.keys(alerta).length > 0 && <Alerta alerta={alerta} />}
        {cuentaConfirmada && (
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to='/'
          >Inicia Sesión</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta