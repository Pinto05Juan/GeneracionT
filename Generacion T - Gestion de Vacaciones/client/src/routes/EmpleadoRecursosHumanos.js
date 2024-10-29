import styled from "styled-components";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useEffect, useState } from "react";
import VacationCard from "../components/VacationCard";



const Main = styled.main`
     padding-top: 4vh;
     display: flex;
     justify-content: space-around;
     width: 100%;
     height: 100%;
     background-color:#31302F ;

     div.employees, div.vacations {
         display: flex;
         flex-direction: column;
         color: #008dbb;
         width: 15vw;
         height: fit-content;
         margin-left: 10%;
         background-color: #31302F;
         border:1px solid black;
         overflow: auto;
         text-align: center;
     }

     div.vacations{
         color: white;
     }

     a{
         text-decoration: none;
         color: inherit;
     }

     button{
         height: fit-content;
         width: 100%;
         background-color: white;
         display: inline-block;
         padding: 10px 20px;
         background-color: white;
         color: black; 
         text-align: center;
         text-decoration: none;
         border: none;
         border-radius: 4px; 
         cursor: default;
         transition: background-color 0.3s ease;
     }

     button:hover {
         background-color: lightgray; 
     }

     .boton { //Para hacer que el <Link> sea como los botones
         width: 100%;
         display: inline-block;
         padding: 10px 20px;
         background-color: white; 
         color: black; 
         text-align: center;
         text-decoration: none;
         border: none;
         border-radius: 4px; 
         cursor: default;
         transition: background-color 0.3s ease; 
     }

     .boton:hover { // el hover del <Link>
     background-color: lightgray; 
     }

     `;


export default function EmpleadoRecursosHumanos(props) {
    const { setUser } = props;
    const user = props.user ?? JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [employees, setEmployees] = useState(null);
    const [vacationRequests, setVacationRequests] = useState(null);

    useEffect(() => {
        if (user === null)
            return navigate("/");

        if (user.area !== "RRHH")
            return navigate("/");

        if (!props.user)
            setUser(user);

        async function fetchData() {

            const fetchemployee = await fetch(`https://backend-gen-t-gqwp-dev.fl0.io/api/empleados`, { headers: { Authorization: `Basic ${user.token}` }, method: "GET" });
            const fetchvacation = await fetch(`https://backend-gen-t-gqwp-dev.fl0.io/api/vacaciones`, { headers: { Authorization: `Basic ${user.token}` }, method: "GET" });

            console.log(fetchvacation.status)
            const employeedata = await fetchemployee.json();
            const vacationdata = await fetchvacation.json();

            setEmployees(employeedata);
            setVacationRequests(vacationdata);
            console.log(employeedata)
            console.log(vacationdata)
        }
        fetchData();
    }, []);

    return (
        <>
            <Nav user={user} />
            <Main>
                <div className="employees">
                    <Link className="boton" to="./nuevo">Agregar empleado</Link>
                    {employees === null ? <p>cargando</p> :
                        (employees.length === 0 ? <p>no hay nadie</p> :
                            employees.map(employee =>
                                <div className="nombres">
                                    <h1>{employee.nombre}</h1>
                                    <button onClick={() => navigate(`/empleados/${employee.FK_dniEmpleado}`, { state: { empleado: employee, vacaciones: vacationRequests.filter((vacacion) => vacacion.FK_empleado === employee.FK_dniEmpleado) } })}>Ver Empleado</button>
                                </div>))}
                </div>
                <div className="vacations">
                    {vacationRequests === null ? <p>cargando</p> :
                        (vacationRequests.length === 0 ? <p>no hay vacaciones</p> :
                            vacationRequests.filter(vacation => vacation.estado === "En observacion").map(vacation => <VacationCard vacation={vacation} />))}
                </div>
            </Main>
        </>
    );
}
