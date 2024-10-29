import styled from "styled-components";
import Nav from "./Nav";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


const Main = styled.main`
    display: flex;
    justify-content: center;
    background-color:#31302F ;
    min-height: 90vh;


    form{
        padding-top: 1%;
        align-content: center;
        height: auto;
        width: 221px;
        flex-direction: column-reverse;
    }

    .secundario{
        display: block;
    
    }
    #secundario{
        margin-bottom: 15px;
    }

   label, small{
        color: white;
   }

   .especial{
    width: 100%;
   }

   button{
         height: fit-content;
         width: 100%;
         display: inline-block;
         padding: 10px 20px;
         background-color: #20C2DA;
         color: black; 
         text-align: center;
         text-decoration: none;
         border: none;
         border-radius: 10px; 
         cursor: default;
         transition: background-color 0.3s ease;
         margin-top: 10px;
     }

     button:hover {
         background-color: #26FCFF; 
     }

     p{
        color:white;
        max-width: fit-content;
        margin: 0;
        font-size: 15px;
        color: #F26767;
     }
     
     .boton{
        color: black;
        font-weight: bold;
     }


`;
export default function FormularioEmpleado(props) {
    const { setUser } = props;
    const user = props.user ?? JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [birthdate, setBirthdate] = useState("");
    const [dateHired, setDateHired] = useState("");
    const [underage, setUnderage] = useState(false);
    useEffect(() => {
        if (user === null || user.area !== "RRHH")
            return navigate("/");

        if (!props.user)
            return setUser(user);
    });

    function checkMaxLength(input) {
        if (input.length > input.maxLength) {
            input.value = input.value.slice(0, input.maxLength);
        }
    }


    function handleBirthdateChange(e) {
        setBirthdate(e.target.value);
        const millisecondsIn18Years = 18 * 365 * 24 * 60 * 60 * 1000;
        const differenceInMilliseconds = new Date() - new Date(e.target.value);
        const isUnderaged = differenceInMilliseconds < millisecondsIn18Years;
        setUnderage(isUnderaged);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const { dni, name, surname, phone, address, email, birthdate, department, dateHired, username, password } = Object.fromEntries(new FormData(event.target));
        const person = { dni, name, surname, phone, address, email, birthdate: new Date(birthdate).toISOString() }
        const machperson = { person, department, dateHired, username, password }
        const form = machperson;
        let response;
        try {
            console.log(form)
            response = await fetch(`https://backend-gen-t-gqwp-dev.fl0.io/api/empleados`, {
                method: "POST",
                body: JSON.stringify(form),
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${user.token}`
                },


            });
        } catch (error) {
            console.log('error');
            console.log(error);
            console.log(await response.text());
            return;
        }
        if (response.ok) {
            return navigate("/empleados");
        } else {
            alert("A ocurrido un error");
        }

    }

    return (
        <>
            <Nav user={user} />
            <Main>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="1">Documento:</label>
                        <input required pattern="^[0-9]*$" id="1" type="number" name='dni' min="0" maxLength="8" onInput={checkMaxLength} />
                    </div>
                    <div>
                        <label htmlFor="2">Nombre:</label>
                        <input required id="2" type="text" name='name' />
                    </div>
                    <div>
                        <label htmlFor="3">apellido:</label>
                        <input required id="3" type="text" name='surname' />
                    </div>
                    <div>
                        <label htmlFor="4">Telefono:</label><small>  (1234-5678)</small>
                        <input required pattern="[0-9]{4}-[0-9]{4}" id="4" type="tel" name='phone' />
                    </div>
                    <div>
                        <label htmlFor="5">Direccion:</label>
                        <input required id="5" type="text" name='address' />
                    </div>
                    <div>
                        <label htmlFor="6">Correo Electrónico:</label>
                        <input required id="6" type="email" name='email' />
                    </div>
                    <div>
                        <label htmlFor="7">Fecha De Nacimiento:</label>
                        <input required id="7" type="date" max={new Date((new Date().getTime() - 24 * 60 * 60 * 1000)).toISOString().split("T")[0]} name='birthdate' value={birthdate} onChange={handleBirthdateChange} />
                        {underage && <p>No se pueden contratar menores de 18 años</p>}
                    </div>
                    <div>
                        <label>Departamento:</label>
                        <select id="department" name="department">
                            <option value="RRHH">Recursos Humanos</option>
                            <option value="Tecnica">Tecnica</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Desarrollo">Desarrollo</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="8">Fecha contratado:</label>
                        <input required id="8" type="date" name='dateHired' />
                    </div>
                    <div>
                        <label htmlFor="2">Usuario:</label>
                        <input required id="2" type="text" name='username' />
                    </div>
                    <div>
                        <label htmlFor="3">Contraseña:</label>
                        <input required id="3" type="text" name='password' />
                    </div>

                    <button type="submit" disabled={underage}>Agregar</button>

                </form>


            </Main>
        </>
    );
}