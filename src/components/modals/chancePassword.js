import * as React from 'react';
import { Button, Stack, TextField } from "@mui/material";
import { UPDATE_PASSWORD } from '../../gql/mutation';
import { AuthContext } from '../../context/authContext';
import { useMutation } from '@apollo/client';
import SimpleSnackbar from '../snackbars';

function ChangePassword (props) {
    const { mostrar } = props;
    const [ datosIngresados, setDatosIngresados] = React.useState([]);
    const { user, logout} = React.useContext(AuthContext);
    const [ mostrarSnackBar, setMostrarSnackBar ] = React.useState({
        mensaje: " -- inicio ===",
        esError: false,
        mostrar: false
    });

    const handleChange = (datos) =>{
        const { name, value} = datos.target;
        setDatosIngresados(valores => ({
            ...valores,
            [name]: value
        }))
    }

    const openCloseModalUpdatePassword = () => {
        mostrar(false);
    }

    /***HACEMOS EL LLAMADO A LA MUTATION, PARA ACTUALIZAR LA CONTRASENA */
    const funUpdatePasswordUser = (parametros) => {
        const { contrasena, valcontrasena } = parametros;

        if(contrasena === "" || contrasena === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese una contraseña.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(valcontrasena === "" || valcontrasena === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese de nuevo la contraseña.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(contrasena !== valcontrasena ){
            setMostrarSnackBar({
                mensaje: "La contraseña ingresada no coincide.",
                esError: true,
                mostrar: true
            });    
            return;
        }
        updatePasswordUser()
    };

    const [ updatePasswordUser, { updatePasswordLoading }] = useMutation( UPDATE_PASSWORD,{
        onError({graphQLErrors}){
            setMostrarSnackBar({
                mensaje: "Error."+graphQLErrors,
                esError: true,
                mostrar: true
            });
        },
        variables:{codigo: user.codigo,
                    contrasena: datosIngresados.contrasena,
                    valcontrasena: datosIngresados.valcontrasena},
        onCompleted: (data) => {
            var editado = data.updatePasswordUser;
            
            if(editado.codigo){
                setMostrarSnackBar({
                    mensaje: "Registro actualizado con exito.",
                    esError: false,
                    mostrar: true
                });
            }
                openCloseModalUpdatePassword();
            
        }
    });

    if(updatePasswordLoading){
        setMostrarSnackBar({
            mensaje: "Cargando.",
            esError: false,
            mostrar: true
        });
    }

    const closeSnackBars = () => {
        setMostrarSnackBar({
            mensaje: "",
            esError: true,
            mostrar: false
        });
    }

    return (
    <div>
        {mostrarSnackBar.mostrar && (
            <SimpleSnackbar onClose={closeSnackBars} objeto={mostrarSnackBar} />
        )}
        <div className="modal">
            <h3>Actualizar contraseña.</h3>
            <TextField required type="password" name="contrasena" className="inputMaterial" label="Ingrese contraseña" onChange={handleChange}/> <br/>
            <br/>
            <TextField required type="password" name="valcontrasena" className="inputMaterial" label="Ingrese de nuevo su contraseña" onChange={handleChange}/> <br/>
            <br/>
            
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={openCloseModalUpdatePassword} variant="contained" color="error">Cerrar</Button>
                <Button onClick={() => { funUpdatePasswordUser(datosIngresados) }} variant="contained" color="primary">Actualizar</Button>
            </Stack>
            </div>
        </div>
    </div>
    )

}


    
 


export default ChangePassword;