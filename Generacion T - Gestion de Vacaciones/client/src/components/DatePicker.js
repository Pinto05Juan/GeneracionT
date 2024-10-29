import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Main = styled.main`
   display: flex;
    justify-content: center;
    background-color:#31302F ;
    min-height: 90vh;
    color: white;
    text-align: center;

    h2{
      font-size: 50px;
      margin:0;
      margin-top: 7%;
      margin-bottom: 7%;
    }

    p{
      padding: 0;
      margin: 0;
      font-weight: bold;
      
    }

    .principal{
      width: auto;
      justify-content: center;
      
    }

    .bloque{
      justify-content: center;
    }

    .datePicker{
      margin-bottom: 8%;
    }

    .boton{
         height: fit-content;
         width: 40%;
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
         font-weight: bold;
     }

     .boton:hover {
         background-color: #26FCFF; 
     }

`;

export default function ReactDatePicker({user}) {
    const navigate = useNavigate();
    
    var hoy = new Date();
    var maxDate = new Date();
    maxDate.setDate(hoy.getDate() + 45);
    const [selectedDate1, setSelectedDate1] = useState(maxDate);
    const [selectedDate2, setSelectedDate2] = useState(null);
  var maximovacaciones;

  if( new Date(new Date() - new Date(user?.fechaIngreso)).getMonth() > 6 ) {
   maximovacaciones = 14;
  }else if(new Date(new Date() - new Date(user?.fechaIngreso)).getFullYear() > 5){
    maximovacaciones = 21;
  }else if(new Date(new Date() - new Date(user?.fechaIngreso)).getFullYear() > 10){
    maximovacaciones = 28;
  } else if (new Date(new Date() - new Date(user?.fechaIngreso)).getFullYear() > 20){
    maximovacaciones = 35
  } else {
    maximovacaciones = 0;
  }
  console.log(maximovacaciones)

  const handleSubmit = async event => {
      event.preventDefault()
    const fechas = {
      from: selectedDate1.toISOString(),
      to: selectedDate2.toISOString()
    }
    console.log(fechas);
    let response
    try {

      response = await fetch(`https://backend-gen-t-gqwp-dev.fl0.io/api/empleados/${user?.FK_dniEmpleado}/vacaciones`, {
        method: "POST",
        body: JSON.stringify(fechas),
        headers:
        {
          "Content-Type": "application/json",
          Authorization: `Basic ${user?.token}`
        },

      })
    } catch (error) {
      console.log("ERROR")
      console.log(error)
    }
    if (response.ok) {
        navigate(0);
        
    } else {
        alert("Ha ocurrido un error");
    }
  }

  console.log(user);

  return (
    <Main>


      <div className='Ppincipal'>
        <div>
          <h2>Seleccione las fechas</h2>
        </div>

        <div className='bloque'>
          <p>Desde:</p>
          <div className='datePicker'>
            <DatePicker
                selected={selectedDate1}
                minDate={maxDate}
                onChange={date => setSelectedDate1(date)}
                dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className='bloque'>
          <p>Hasta (exclusivo):</p>
          <div className='datePicker'>
            <DatePicker
              selected={selectedDate2}
              onChange={date => setSelectedDate2(date)}
              minDate={selectedDate1}
              maxDate={new Date(selectedDate1?.getTime() + maximovacaciones * 24 * 60 * 60 * 1000)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div>
          <button className='boton' onClick={handleSubmit}><p>Enviar</p></button>
        </div>
      </div>

    </Main>

  );
}