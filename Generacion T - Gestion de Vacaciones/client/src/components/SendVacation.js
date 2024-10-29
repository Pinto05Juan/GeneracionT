import React, { useEffect } from 'react'
import Navbar from './Nav'
import ReactDatePicker from './DatePicker'
import { useNavigate } from 'react-router-dom';



export default function SendVacation(props) {
  const {setUser} = props;
  const navigate = useNavigate();
  const user = props.user ?? JSON.parse(localStorage.getItem('user'));
  useEffect(()=> {
    if (user === null) 
      return navigate("/");

    if (!props.user) 
      setUser(user);
  });

  return (
    <div>
    <Navbar user = {props.user}></Navbar>
    <ReactDatePicker user = {props.user}></ReactDatePicker>
    </div>
  )
}
