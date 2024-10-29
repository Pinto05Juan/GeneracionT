import {useState} from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './routes/Login';
import ComprarModulo from './components/ComprarModulo';
import EmpleadoRecursosHumanos from './routes/EmpleadoRecursosHumanos';
import FormularioEmpleado from './components/FormularioEmpleado';
import Vacation from './components/Vacation';
import Empleado from './components/Empleado';
import SendVacation from './components/SendVacation';
export default function MyRouter(props) {
    const [user, setUser] = useState(null);
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/'>
                    <Route index element={<Login user={user} setUser={setUser} />} />
                    <Route path='proyecto'>
                        <Route index element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                        {/*  */}
                        <Route path='agregarEmpleado' element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} /> 
                        <Route path='nuevo' element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                    </Route>
                    <Route path='desarrollo'>
                        {/*  */}
                        <Route index element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                    </Route>
                    <Route path='propuestas'>
                        <Route index element={<ComprarModulo modulo="Tracking Comercial" user={user} setUser={setUser} />} />
                        <Route path=":idPropuesta" element={<ComprarModulo modulo="Tracking Comercial" user={user} setUser={setUser} />} />
                        <Route path="nueva" element={<ComprarModulo modulo="Tracking Comercial" user={user} setUser={setUser} />} />
                    </Route>
                    <Route path='empleados'>
                        <Route index element={<EmpleadoRecursosHumanos user={user} setUser={setUser} />} />
                        <Route path='nuevo' element={<FormularioEmpleado user={user} setUser={setUser} />} />
                        <Route path=":idEmpleado" element={<Empleado user={user} setUser={setUser} />} />
                    </Route>
                    <Route path="tareas">
                        <Route path='nueva' element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                        <Route path=":idTarea" element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                    </Route>
                    <Route path="vacaciones">
                        <Route index element={<SendVacation user={user} setUser={setUser} />} />
                        <Route path=":idVacacion" element={<Vacation user={user} setUser={setUser} />} />
                    </Route>
                    <Route path="desvios">            
                        {/*  */}
                        <Route index element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                        <Route path="nuevo" element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                        {/*  */}
                        <Route path=":idDesvio" element={<ComprarModulo modulo="Matriz de Responsabilidades" user={user} setUser={setUser} />} />
                    </Route>
                    <Route path='clientes'>
                        <Route path='nuevo' element={<ComprarModulo modulo="Tracking Comercial" user={user} setUser={setUser} />} />
                    </Route>
                </Route>
                <Route path='/*' element={<p>Esta ruta no existe</p>} />
            </Routes>
        </BrowserRouter>
    );
}