import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import RutaProtegida from './layouts/RutaProtegida'

import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import NuevoPassword from './paginas/NuevoPassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import Proyectos from './paginas/Proyectos'
import Proyecto from './paginas/Proyecto'
import NuevoProyecto from './paginas/NuevoProyecto'

import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectosProvider'
import EditarProyecto from './paginas/EditarProyecto'
import NuevoColaborador from './paginas/NuevoColaborador'


function App() {
  return (
    // AuthProvider es la etiqueta que importo para usar useContext
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} /> {/* por defecto al iniciar carga Login x el 'index' */}
              <Route path='registrar' element={<Registrar />} />
              <Route path='olvide-password' element={<OlvidePassword />} />
              <Route path='olvide-password/:token' element={<NuevoPassword />} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
            </Route>

            {/* Rutas protegidas */}
            <Route path='/proyectos' element={<RutaProtegida />}>
              <Route index element={<Proyectos />} />
              <Route path='crear-proyecto' element={<NuevoProyecto />} />
              <Route path='/proyectos/nuevo-colaborador/:id' element={<NuevoColaborador />} />
              <Route path=':id' element={<Proyecto />} />
              <Route path='editar/:id' element={<EditarProyecto />} />
            </Route>
          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
