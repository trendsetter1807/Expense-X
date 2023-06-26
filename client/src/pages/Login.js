import React from 'react'
import {Form,Input,message} from 'antd'
import {Link,useNavigate} from "react-router-dom"
import axios from 'axios'
import Spinner from '../components/Layout/Spinner'
import { useState } from 'react'


const Login = () => {
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const submitHandler=async(values)=>{
        try {
            setLoading(true);
           const {data}= await axios.post('/users/login',values);
           setLoading(false);
           message.success("Login Succesful");
           localStorage.setItem('user', JSON.stringify({...data.user,password:''}));
           navigate('/');
        } catch (error) {
            setLoading(false);
            message.error("Invalid username or password");
        }
    }
  return (
    <>
        <div className="resgister-page">
        {loading && <Spinner/>}
        <Form layout="vertical" onFinish={submitHandler}>
            <h1>Login Form</h1>
                <Form.Item label="Email" name="email">
                    <Input type="email"/>
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type="password"/> 
                </Form.Item>

                <div className="d-flex justify-content-between">
            <Link to="/register">Not a user Click to register</Link>
            <button className="btn btn-primary">Login</button>
          </div>
        </Form>
        
      </div>
    </>
  )
}

export default Login
