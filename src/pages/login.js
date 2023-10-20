import { useContext, useState } from "react";
import {AuthContext } from '../context/authContext'

import { useForm } from "../utility/hooks";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { TextField, Button, Container, Stack, Alert} from "@mui/material"

import {gql}  from 'graphql-tag'
import { useNavigate } from "react-router-dom";

const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!){
	    login(email: $email, password: $password){
            codigo
            nombre
            vencimiento
            inicio
            token
	    }
    }`

function Login(props){
    const context = useContext(AuthContext)
    let navigate = useNavigate();
    const [ errors, setErrors] = useState([]);

    function loginUserCallback()
        {
            loginUser();           
        }
        
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        email: '',
        password: ''
    });


    const [loginUser, { loading }] = useMutation(LOGIN_USER,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: { email: values.email, password: values.password },
        onCompleted: (data) => {
            context.login(data.login);
            navigate('/');
        }
    });

    return (
        <Container spacing={3} maxWidth="sm" >
            <h3>Inicio de sesión</h3>
            <p>Bienvenido</p>
            <Stack spacing={2} padding={2}>
                <TextField 
                    label="Email"
                    name="email"
                    onChange={onChange}
                />
                <TextField 
                type="password"
                    label="Password"
                    name="password"
                    onChange={onChange}
                />
            </Stack>
            <Button variant="contained" color="success" onClick={onSubmit}>Inicio de sesión</Button>
            
            {errors.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
        </Container>
    )

}

export default Login;