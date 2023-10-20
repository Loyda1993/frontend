import {AuthContext } from '../context/authContext'
import { useContext, useState } from "react";
import { Alert, Autocomplete, Button, Container, Grid, IconButton, Modal, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import * as React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { REPORT_MONTH, GET_POINT_SALE_USER } from '../gql/mutation';
import MyTitle from '../components/title';
import { Delete, Download, Edit } from '@mui/icons-material';
import SpanningTable from '../components/tableDiary';
import { useNavigate } from 'react-router-dom';
import SimpleSnackbar from '../components/snackbars';
import MyTable from '../components/tableDiary'
import '../css/styles.css';

function Report(){

    let navigate = useNavigate();
    const context = useContext(AuthContext);
    const [ errors, setErrors ] = useState([]);
    const [ pointSaleData, setPointSaleData ] = useState([]);
    const [ reportData, setReportData ] = useState([]);
    const [ productSeleccionado, setProductoSeleccionado ] = useState({
        punto_venta: 0,
        fecha_inicio: '',
        fecha_fin: ''
    });
    const [ isLoggeIn, setIsLoggeIn ] = useState(true);
    const [ mostrarSnackBar, setMostrarSnackBar ] = useState({
        mensaje: " -- inicio ===",
        esError: false,
        mostrar: false
    });
    const { user, logout} = useContext(AuthContext);
     
    const handleChange = e => {
        setReportData([]);
        const {name, value } = e.target;
        setProductoSeleccionado(prevState => ({
            ...prevState,
            [name]: value
        }))
    };

    /*****MUTATION */
    const [ getReport, { getReportLoading }] = useMutation(REPORT_MONTH,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: { 
            codigo_punto_venta: productSeleccionado.punto_venta,
            fecha_inicio:  productSeleccionado.fecha_inicio,
            fecha_fin: productSeleccionado.fecha_fin
        },
        onCompleted: (data) => {
            setErrors([])
            setReportData(data.getReportJournal);
        }
    });

    const [ selectPointSale, { selectPointSaleLoading }] = useMutation(GET_POINT_SALE_USER,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: { codigo: user?.codigo},
        onCompleted: (data) => {
            setPointSaleData(data.getPointSaleById);
            setErrors([]) 
        }
    });


    /** LLENAMOS LAS LISTA DE VALORES */
    const defaultPropsPointSale = {
        options: pointSaleData,
        getOptionLabel: (option) => option.nombre,
    };

    React.useEffect(() => {
        if(user === null) {navigate('/');}
        selectPointSale();
    }, [])
    
    const closeSnackBars = () => {
        setMostrarSnackBar({
            mensaje: "",
            esError: true,
            mostrar: false
        });
    }

    return (
    < >
    {errors?.map(function(error){
            return(
                <Alert severity="error">
                {error}
            </Alert>
        )
    })}
        <Container spacing={2} maxWidth="lg">

        {mostrarSnackBar.mostrar && (
            <SimpleSnackbar onClose={closeSnackBars} objeto={mostrarSnackBar} />
        )}
        
        { isLoggeIn === true ?
            <MyTitle titulo={'Reporte'}></MyTitle>
        : <div></div> }  
        
            <Grid container direction="row"  spacing={4} align="center" >
                { isLoggeIn === true ?
                        <Grid item xs={3}>
                            
                                <Autocomplete
                                    {...defaultPropsPointSale}
                                    id="punto_venta"
                                    name="punto_venta"
                                    clearOnEscape
                                    
                                    onChange={(event, newValue) => {
                                        setReportData([]);
                                        if(newValue !== null ){
                                            setProductoSeleccionado(prevState=>({
                                                ...prevState,
                                                "punto_venta": newValue.codigo
                                            }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Seleccione punto venta" />
                                        )}
                                        />
                            
                        </Grid>
                : <div></div> }   
                { isLoggeIn === true ?  
                        <Grid item xs={3}>
                            
                                <TextField
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    name="fecha_inicio" 
                                    label="Fecha Inicio" 
                                    onChange={handleChange}
                                /> 
                            

                        </Grid>
                : <div></div> }   
                { isLoggeIn === true ?  
                        <Grid item xs={3}>
                            
                                <TextField
                                    fullWidth
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    type="date"
                                    name="fecha_fin" 
                                    label="Fecha Finalización" 
                                    onChange={handleChange}
                                /> 
                            

                        </Grid>
                : <div></div> }
                { isLoggeIn === true ?  
                        <Grid item xs={3} >
                                <Button variant="contained" onClick={getReport} color="success">Generar</Button>
                        </Grid>
                : <div></div> }   
            </Grid>
        { isLoggeIn === true ?  
                reportData.length === 0 ? "" : <MyTable datos={reportData} finicio={productSeleccionado.fecha_inicio} ffin={productSeleccionado.fecha_fin} ></MyTable>
        : <div></div> } 
        </Container>
            
    </>
    )
    
}

export default Report;
