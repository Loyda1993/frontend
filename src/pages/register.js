import { useContext, useState } from "react";
import {AuthContext } from '../context/authContext'

import { useForm } from "../utility/hooks";

import { useMutation } from "@apollo/react-hooks";

import { TextField, Button, Container, Stack, Alert} from "@mui/material"

import { gql } from 'graphql-tag'
import { useNavigate } from "react-router-dom";

const REGISTER_USER = gql`
    mutation Mutation($registerInput: RegisterInput){
        registerUser(
            registerInput: $registerInput
        ){
            email
            username
            token
        }
    }
`

function Register(props){

    const context = useContext(AuthContext)
    let navigate = useNavigate();
    const [ errors, setErrors] = useState([]);

    function registerUserCallback(){
        console.log('Callback Hit');
        registerUser();
    }

    const { onChange, onSubmit, values } = useForm(registerUserCallback, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [ registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { registerUser: userData}}){
            context.login(userData);
            navigate('/');
        },
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: { registerInput: values }
    });

    return (
        <Container spacing={2} maxWidth="sm">
            <h3>Registro</h3>
            <p>Registro de Usuario</p>
            <Stack spacing={2} padding={2}>
                <TextField 
                    label="Username"
                    name="Username"
                    onChange={onChange}
                />
                <TextField 
                    label="Email"
                    name="Email"
                    onChange={onChange}
                />
                <TextField 
                    label="Password"
                    name="Password"
                    onChange={onChange}
                />
                <TextField 
                    label="Confirm Password"
                    name="ConfirmPassword"
                    onChange={onChange}
                />
            </Stack>
            {errors.map(function(error){
                return(
                    <Alert severity="error">
                        {error.message}
                    </Alert>
                )
            })}
            <Button variant="contained" color="success" onClick={onSubmit}>Registrar</Button>
        </Container>
    )

}

export default Register;