import { useContext, useEffect, useState } from "react";
import {AuthContext } from '../context/authContext'

import { useMutation, useQuery } from "@apollo/react-hooks";

import { TextField, Button, Container, Stack, Alert,
            Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Tab,
            Modal, TablePagination, Tooltip
    } from "@mui/material";

import {Edit, Delete } from '@mui/icons-material';
import PasswordIcon from '@mui/icons-material/Password';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate, useParams } from "react-router-dom";

import { GET_ALL_USER, GET_ALL_POINT_SALE, GET_ALL_TYPE_ROL} from "../gql/query";
import { CREATE_USER, UPDATE_USER, DELETE_USER, UPDATE_PASSWORD, 
        CREATE_POINT_SALE_USER, CREATE_ROL_USER } from '../gql/mutation'
import MyTitle from "../components/title";
import MultipleSelectChip from "../components/selectMultiple";
import SimpleSnackbar from "../components/snackbars";

import '../css/styles.css';

/* CONSULTAS DE GRAPHQL */

function User(props){

    const context = useContext(AuthContext)
    let navigate = useNavigate();

    const [ errors, setErrors] = useState([]);
    const [ title, setTitle ] = useState("Usuarios")
    const [ productData, setProductData ] = useState([]);
    const [ typeProductData, setTypeProductData ] = useState([]);
    const [ pointSaleData, setPointSaleData ] = useState([]);
    const [ typeRolData, setTypeRolData ] = useState([]);
    const [ modalCreate, setModalCreate ] = useState(false);
    const [ modalEdit, setModalEdit ] = useState(false);
    const [ modalDelete, setModalDelete ] = useState(false);
    const [ modalUpdatePassword, setModalUpdatePassword ] = useState(false);
    const [ modalPointSale, setModalPointSale ] = useState(false);
    const [ modalTypeRol, setModalTypeRol ] = useState(false);

    const [ pointSaleSelected, setPointSaleSelected ] = useState([]);
    const [ typeRolSelected, setTypeRolSelected ] = useState([]);



    const [ productoSeleccionado, setProductoSeleccionado ] = useState({
        nombre: '',
        descripcion: ''
    })

    const [filtro, setFiltro] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [isChecked, setIsChecked] = useState(false);
    const [ tipoSeleccionado, setTipoSeleccionado ] = useState(null);

    const [ mostrarSnackBar, setMostrarSnackBar ] = useState({
        mensaje: " -- inicio ===",
        esError: false,
        mostrar: false
    });
    
    const closeSnackBars = () => {
        setMostrarSnackBar({
            mensaje: "",
            esError: true,
            mostrar: false
        });
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setProductoSeleccionado(prevState=>({
            ...prevState,
            [name]: value
        }))
    }
    //---------------------------------------------
    const {loadingPointSale, errorPointSale, dataPointSale} = useQuery(GET_ALL_POINT_SALE,{
        onCompleted: (queryData) =>{
            const productArray = queryData.getAllPointSale;
            setPointSaleData(productArray);
        }
    });
    
    const {loading, error, data} = useQuery(GET_ALL_USER,{
        onCompleted: (queryData) =>{
            const productArray = queryData.getAllUsers;
            setTypeProductData(productArray);
        }
    });

    const {loadingTypeRol, errorTypeRol, dataTypeRol} = useQuery(GET_ALL_TYPE_ROL,{
        onCompleted: (queryData) =>{
            const productArray = queryData.getAllTypeRol;
            setTypeRolData(productArray);
        }
    });

    //Mutaciones ------------------------------------------------------------------------
    const funCreateTypeProducto = () => {
        const { contrasena, correo, nombre } = productoSeleccionado;

        if(nombre === "" || nombre === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre del usuario.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(correo === "" || correo === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre de la cuenta.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(contrasena === "" || contrasena === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese una contraseña.",
                esError: true,
                mostrar: true
            });    
            return;
        }
        createTypeProducto();
    };

    const [createTypeProducto, { createLoading }] = useMutation(CREATE_USER,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {nombre: productoSeleccionado.nombre, 
                    contrasena: productoSeleccionado.contrasena,
                    correo: productoSeleccionado.correo,
                    rol: 0    
                } ,
        onCompleted: (data) => {
            setTypeProductData(typeProductData.concat(data.createUser));
            setMostrarSnackBar({
                mensaje: "Registro creado con exito.",
                esError: false,
                mostrar: true
            });
            openCloseModalCreate();
        }
    });

    const funEditTypeProducto = () => {
        const { contrasena, correo, nombre } = productoSeleccionado;

        if(nombre === "" || nombre === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre del usuario.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(correo === "" || correo === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre de la cuenta.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        editTypeProducto()
    };     

    const [editTypeProducto, { editLoading }] = useMutation(UPDATE_USER,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {codigo: productoSeleccionado.codigo,
                    nombre: productoSeleccionado.nombre, 
                    contrasena: productoSeleccionado.contrasena,
                    correo: productoSeleccionado.correo,
                    rol: 0  } ,
        onCompleted: (data) => {
            var newData = [...typeProductData];
            var editado = data.updateUser;
                    newData.map(array => { 
                        
                        if( array.codigo !== editado.codigo ){
                            return array;
                        }
                    })
                    var indiceAEliminar = newData.findIndex((valor) => valor.codigo === editado.codigo);
                    const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];
                    setTypeProductData(nuevoArray.concat(editado));
                    setMostrarSnackBar({
                        mensaje: "Registro actualizado con exito.",
                        esError: false,
                        mostrar: true
                    });
                //setProductData(nuevoArray);
                openCloseModalEdit();
        }
    });


    const funDeleteTypeProducto = () => deleteTypeProducto();

    const [deleteTypeProducto, { deleteLoading }] = useMutation(DELETE_USER,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {codigo: productoSeleccionado.codigo} ,
        onCompleted: (data) => {
                var newData = [...typeProductData];
                var editado = data.deleteUser;
                    newData.map(array => { 
                        
                        if( array.codigo !== editado.codigo ){
                            return array;
                        }
                    })
                    var indiceAEliminar = newData.findIndex((valor) => valor.codigo === editado.codigo);
                    const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];

                    setTypeProductData(nuevoArray.concat(editado));
                    setMostrarSnackBar({
                        mensaje: "Registro eliminado con exito.",
                        esError: false,
                        mostrar: true
                    });
                openCloseModalDelete();
        }
    });

    const funUpdatePasswordUser = () => {
        const { contrasena, valcontrasena, nombre } = productoSeleccionado;

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

    const [ updatePasswordUser, { updatePasswordLoading }] = useMutation(UPDATE_PASSWORD,{
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables:{codigo: productoSeleccionado.codigo,
                    contrasena: productoSeleccionado.contrasena,
                    valcontrasena: productoSeleccionado.valcontrasena},
        onCompleted: (data) => {
            var newData = [...typeProductData];
            var editado = data.updatePasswordUser;
                    newData.map(array => { 
                        
                        if( array.codigo !== editado.codigo ){
                            return array;
                        }
                    })
                    var indiceAEliminar = newData.findIndex((valor) => valor.codigo === editado.codigo);
                    const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];
                    setTypeProductData(nuevoArray.concat(editado));
                    setMostrarSnackBar({
                        mensaje: "Registro actualizado con exito.",
                        esError: false,
                        mostrar: true
                    });
                openCloseModalUpdatePassword();
            
        }
    });

    const funCreatePointSaleUser = () => createPointSaleUser();

    const [ createPointSaleUser, { createPointSaleUserLoading } ] = useMutation(CREATE_POINT_SALE_USER, {
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables: {
            codigo: productoSeleccionado.codigo,
            puntos_venta: pointSaleSelected
        },
        onCompleted: (data) => {
            var resultado = data.createPointSaleUser;
            var usuario = [{
                codigo: productoSeleccionado.codigo,
                nombre: productoSeleccionado.nombre,
                correo: productoSeleccionado.correo,
                activo: productoSeleccionado.activo,
                punto_venta: resultado
            }]
            var newData = [...typeProductData]
            
            newData.map(array => { 
                if( array.codigo !== productoSeleccionado.codigo ){
                    return array;
                }
            })
            
            var indiceAEliminar = newData.findIndex((valor) => valor.codigo === productoSeleccionado.codigo)
            const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];
            setTypeProductData(nuevoArray.concat(usuario));
            setMostrarSnackBar({
                mensaje: "Registro creado con exito.",
                esError: false,
                mostrar: true
            });
            openCloseModalPointSale();
        }
    })

    const funCreateTypeRolUser = () => createRolUser();

    const [ createRolUser, { createRolUserLoading } ] = useMutation(CREATE_ROL_USER, {
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables: {
            codigo: productoSeleccionado.codigo,
            roles: typeRolSelected
        },
        onCompleted: (data) => {
            var resultado = data.createRolUser;
        
            var usuario = [{
                codigo: productoSeleccionado.codigo,
                nombre: productoSeleccionado.nombre,
                correo: productoSeleccionado.correo,
                activo: productoSeleccionado.activo,
                punto_venta: productoSeleccionado.punto_venta,
                roles: resultado
            }]
            var newData = [...typeProductData]
            
            newData.map(array => { 
                if( array.codigo !== productoSeleccionado.codigo ){
                    return array;
                }
            })
            
            var indiceAEliminar = newData.findIndex((valor) => valor.codigo === productoSeleccionado.codigo)
            const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];
            setTypeProductData(nuevoArray.concat(usuario));
            setMostrarSnackBar({
                mensaje: "Rol asignado con exito.",
                esError: false,
                mostrar: true
            });
            openCloseModalTypeRol();
        }
    })

    if (loading) return null;
    if (error) {
        let isArray = Array.isArray(error);
        if(!isArray){
            navigate('/');
            return;
        }
        setErrors(error);
    }

    //Modales--------------------------------------------------------------------------
    const openCloseModalCreate=()=>{
        setErrors([]);
        setModalCreate(!modalCreate);
    }

    const openCloseModalEdit=()=>{
        setErrors([]);
        setModalEdit(!modalEdit);
    }

    const openCloseModalDelete=()=>{
        setErrors([]);
        setModalDelete(!modalDelete);
    }

    const openCloseModalUpdatePassword=()=>{
        setErrors([]);
        setModalUpdatePassword(!modalUpdatePassword);
    }

    const openCloseModalPointSale=()=>{
        setErrors([]);
        setModalPointSale(!modalPointSale);
    }

    const openCloseModalTypeRol=()=>{
        setErrors([]);
        setModalTypeRol(!modalTypeRol);
    }

    const seleccionarProducto=(producto, caso)=>{
        // let tipo = typeProductData.find((valor)=> valor.codigo === producto.tipo_producto);
       
        // setTipoSeleccionado(tipo);

        setProductoSeleccionado(producto);
        if (caso == 'Editar') {
            setModalEdit(true)
        } else if (caso == 'Eliminar'){
            setModalDelete(true)
        } else if (caso == 'Password'){
            setModalUpdatePassword(true);
        } else if (caso == 'acceso_puntoventa'){
            setModalPointSale(true);
        } else if (caso == 'acceso_rol'){
            setModalTypeRol(true);
        }
    }

    //--------------------------------------------------------
    const defaultProps = {
        options: typeProductData,
        getOptionLabel: (option) => option.nombre,
    };
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const bodyCreate=(
        <div className="modal">
            <h3>Crear {title}</h3>
            <TextField name="nombre" className="inputMaterial" label="Nombre" onChange={handleChange}/> <br/>
            <br/>
            <TextField name="correo" className="inputMaterial" label="cuenta" onChange={handleChange}/> <br/>
            <br/>
            <TextField name="contrasena" className="inputMaterial" label="contraseña" onChange={handleChange}/> <br/>
            <br/>
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="error" onClick={openCloseModalCreate}>Cerrar</Button>
                <Button variant="contained" onClick={funCreateTypeProducto} color="primary">Crear</Button>
            </Stack>
                {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
            </div>
        </div>
    )

    const bodyEdit=(
        <div className="modal">
            <h3>Editar {title}</h3>
            <TextField name="nombre" className="inputMaterial" label="Nombre" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.nombre}/> <br/>
            <br/>
            <TextField name="correo" className="inputMaterial" label="Cuenta" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.correo}/> <br/>
            <br/>
            <br/>
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={openCloseModalEdit} color="error">Cerrar</Button>
                <Button variant="contained" onClick={funEditTypeProducto} color="primary">Editar</Button>
            </Stack>
                {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
            </div>
        </div>
    )

    const bodyUpdatePassword=(
        <div className="modal">
            <h3>Actualizar contraseña de {productoSeleccionado.nombre}</h3>
            <TextField required type="password" name="contrasena" className="inputMaterial" label="Ingrese contraseña" onChange={handleChange}/> <br/>
            <br/>
            <TextField required type="password" name="valcontrasena" className="inputMaterial" label="Ingrese de nuevo su contraseña" onChange={handleChange}/> <br/>
            <br/>
            
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={openCloseModalUpdatePassword} variant="contained" color="error">Cerrar</Button>
                <Button onClick={funUpdatePasswordUser} variant="contained" color="primary">Actualizar</Button>
            </Stack>
                
                
                {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
            </div>
        </div>
    )
    
    const bodyDelete=(
        <div className="modal">
            <h3>Eliminar {title}</h3>
            <p>Está seguro de Eliminar este usuario {productoSeleccionado && productoSeleccionado.nombre}?</p>
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={openCloseModalDelete} color="error">No</Button>
                <Button variant="contained" onClick={funDeleteTypeProducto} color="warning">Sí</Button>
            </Stack>
            {errors?.map(function(error){
            return(
                <Alert severity="error">
                    {error}
                </Alert>
            )
            })}
            </div>
        </div>
        
    )

    const handlePointSaleChange = (nuevoValor) => {
            setPointSaleSelected(nuevoValor);
    };
    
    const handleTypeRolChange = (nuevoValor) => {
        setTypeRolSelected(nuevoValor);
    };

    const bodyPointSale=(
        <div className="modal">
            <h3>Agregar accesos a {productoSeleccionado.nombre}</h3>
            <Alert severity="info">En esta ventana agrega los puntos de venta a los que tendra acceso el usuario.</Alert>
            <br/>
            <MultipleSelectChip datos={pointSaleData} onChange={handlePointSaleChange} seleccionados={productoSeleccionado.punto_venta}></MultipleSelectChip>
            <br/>
            {/* <misPuntosVentaPorUsuario codigo={productoSeleccionado.codigo}></misPuntosVentaPorUsuario> */}
            <br/>
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={openCloseModalPointSale} variant="contained" color="error">Cerrar</Button>
                <Button onClick={funCreatePointSaleUser} variant="contained" color="primary">Agregar</Button>
            </Stack>

            {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
            </div>
        </div>
    )

    const bodyTypeRol=(
        <div className="modal">
            <h3>Agregar roles a {productoSeleccionado.nombre}</h3>
            <Alert severity="info">En esta ventana agrega los roles al usuario. Esto indicara que acciones podra realizar el usuario.</Alert>
            <br/>
            <MultipleSelectChip datos={typeRolData} onChange={handleTypeRolChange} seleccionados={productoSeleccionado.roles}></MultipleSelectChip>
            <br/>
            {/* <misPuntosVentaPorUsuario codigo={productoSeleccionado.codigo}></misPuntosVentaPorUsuario> */}
            <br/>
            <div align="right">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={openCloseModalTypeRol} variant="contained" color="error">Cerrar</Button>
                <Button onClick={funCreateTypeRolUser} variant="contained" color="primary">Agregar</Button>
            </Stack>

            {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
            </div>
        </div>
    )
    /**FUNCION DE LA TABLA-------------------------------------------------------------- */
   
    // Función para manejar cambios en el campo de búsqueda
    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };
    
    // Filtrar los datos basados en el filtro de búsqueda
    const datosFiltrados = typeProductData.filter((dato) =>
        dato.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    /**mis BOTONES -------------------------------------------------------------------- */
    const miBoton = (
        <Button  variant="contained" color="success" onClick={openCloseModalCreate}>Nuevo</Button>
      );
    
    const miFiltro = (
        <TextField label="Buscar por nombre" value={filtro} onChange={handleFiltroChange} />
    );

      return (
    <>
        {errors?.map(function(error){
            return(
            <Alert severity="error"> {error} </Alert>
            )
        })}
        <div>
        <Container spacing={4} maxWidth="md">
        {mostrarSnackBar.mostrar && (
            <SimpleSnackbar onClose={closeSnackBars} objeto={mostrarSnackBar} />
        )}
        <MyTitle titulo={title} boton={miBoton} buscar={miFiltro}   ></MyTitle> 
            <br/>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Codigo</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosFiltrados
                        .sort((x, y) => x.codigo - y.codigo)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(console=>(
                            <TableRow key={console.codigo}>
                                <TableCell>{console.codigo}</TableCell>

                                <TableCell>{console.nombre}</TableCell>
                                <TableCell>{console.correo}</TableCell>
                                <TableCell>{console.activo == true ? "Activo" : "Inactivo"}</TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Edit className="{styles.iconos}" onClick={() => seleccionarProducto(console, 'Editar')} />
                                    </Tooltip>
                                    &nbsp;&nbsp;&nbsp;
                                    <Tooltip title="Eliminar">
                                        <Delete className="{styles.iconos}" onClick={() => seleccionarProducto(console, 'Eliminar')} />   
                                    </Tooltip>
                                    &nbsp;&nbsp;&nbsp;
                                    <Tooltip title="Cambiar contraseña">
                                        <PasswordIcon className="{styles.iconos}" onClick={() => seleccionarProducto(console, 'Password')}/>     
                                    </Tooltip>
                                    &nbsp;&nbsp;&nbsp;
                                    <Tooltip title="Agregar acceso a punto de venta">
                                        <StorefrontIcon className="{styles.iconos}" onClick={() => seleccionarProducto(console, 'acceso_puntoventa')}/>     
                                    </Tooltip>
                                    &nbsp;&nbsp;&nbsp;
                                    <Tooltip title="Agregar roles">
                                        <SupervisorAccountIcon className="{styles.iconos}" onClick={() => seleccionarProducto(console, 'acceso_rol')}/>
                                    </Tooltip>
                                </TableCell>
                            
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={datosFiltrados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Container>
        
            <Modal
                open={modalCreate}
                onClose={openCloseModalCreate}>
                {bodyCreate}
            </Modal>

            <Modal
                open={modalEdit}
                onClose={openCloseModalEdit}>
                {bodyEdit}
            </Modal>
    
            <Modal
                open={modalDelete}
                onClose={openCloseModalDelete}>
                {bodyDelete}
            </Modal>
            
            <Modal
                open={modalUpdatePassword}
                onClose={openCloseModalUpdatePassword}>
                {bodyUpdatePassword}
            </Modal>
            <Modal
                open={modalPointSale}
                onClose={openCloseModalPointSale}>
                {bodyPointSale}
            </Modal>

            <Modal
                open={modalTypeRol}
                onClose={openCloseModalTypeRol}>
                {bodyTypeRol}
            </Modal>

        </div>
    </>
    )

}

export default User;