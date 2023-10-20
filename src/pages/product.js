import { useContext, useState } from "react";
import {AuthContext } from '../context/authContext'
import { useMutation, useQuery } from "@apollo/react-hooks";

import { TextField, Button, Container, Stack, Alert,
            Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Tab,
            Modal, Autocomplete,TablePagination
    } from "@mui/material";

import {Edit, Delete, CheckBox } from '@mui/icons-material';

import { useNavigate } from "react-router-dom";

import { CREATE_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT } from "../gql/mutation";
import { GET_ALL_PRODUCT, GET_ALL_TYPE_PRODUCT, GET_PRODUCT_BYID } from "../gql/query";

import MyTitle from "../components/title";
import SimpleSnackbar from "../components/snackbars";

import '../css/styles.css';


function Product(props){

    const context = useContext(AuthContext)

    let navigate = useNavigate();
    const [ errors, setErrors] = useState([]);
    const [ title, setTitle ] = useState("Producto")
    const [ productData, setProductData ] = useState([]);
    const [ typeProductData, setTypeProductData ] = useState([]);
    const [ modalCreate, setModalCreate ] = useState(false);
    const [ modalEdit, setModalEdit ] = useState(false);
    const [ modalDelete, setModalDelete ] = useState(false);
    const [ productoSeleccionado, setProductoSeleccionado ] = useState({
        nombre: '',
        descripcion: '',
        tipo_producto: null
    })
    const [ tipoSeleccionado, setTipoSeleccionado ] = useState(null);

    const [filtro, setFiltro] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChange = e => {
        const { name, value } = e.target;
        setProductoSeleccionado(prevState=>({
            ...prevState,
            [name]: value
        }))
    }

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
    
    //---------------------------------------------
    const {loading, error, data} = useQuery(GET_ALL_PRODUCT,{
        onCompleted: (queryData) =>{
            const productArray = queryData.getAllProduct;
            setProductData(productArray);
        }
    });

    const {typeLoading, typeError, typeData} = useQuery(GET_ALL_TYPE_PRODUCT,{
        onCompleted: (queryData) =>{
            const productArray = queryData.getAllTypeProduct;
            setTypeProductData(productArray);
        }
    });
    //Mutaciones ------------------------------------------------------------------------
    function funCreateProducto()
    {
        const {nombre, descripcion, tipo_producto} = productoSeleccionado;    

        if(nombre === "" || nombre === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre del producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(descripcion === "" || descripcion === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese la descripcion del producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(tipo_producto === "" || tipo_producto === undefined){
            setMostrarSnackBar({
                mensaje: "Seleccione el tipo de producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }


        createProducto();           
    }

    const [createProducto, { createLoading }] = useMutation(CREATE_PRODUCT,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {nombre: productoSeleccionado.nombre, 
                    descripcion: productoSeleccionado.descripcion, 
                    tipo_producto: productoSeleccionado.tipo_producto} ,
        onCompleted: (data) => {
            setProductData(productData.concat(data.createProduct));
            setMostrarSnackBar({
                mensaje: "Registro creado con exito.",
                esError: false,
                mostrar: true
            });
            openCloseModalCreate();
        }
    });

    function funEditProducto()
    {
        const {nombre, descripcion, tipo_producto} = productoSeleccionado;    

        if(nombre === "" || nombre === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese el nombre del producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(descripcion === "" || descripcion === undefined){
            setMostrarSnackBar({
                mensaje: "Ingrese la descripcion del producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }

        if(tipo_producto === "" || tipo_producto === undefined){
            setMostrarSnackBar({
                mensaje: "Seleccione el tipo de producto.",
                esError: true,
                mostrar: true
            });    
            return;
        }
        editProducto();           
    }

    const [editProducto, { editLoading }] = useMutation(EDIT_PRODUCT,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {codigo: productoSeleccionado.codigo,
                    nombre: productoSeleccionado.nombre, 
                    descripcion: productoSeleccionado.descripcion, 
                    tipo_producto: productoSeleccionado.tipo_producto} ,
        onCompleted: (data) => {
                var newData = [...productData];
                var editado = data.updateProduct;
                    newData.map(array => { 
                        
                        if( array.codigo !== editado.codigo ){
                            return array;
                        }
                    })
                    var indiceAEliminar = newData.findIndex((valor) => valor.codigo === editado.codigo);
                    const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];
                    setProductData(nuevoArray.concat(editado));
                    setMostrarSnackBar({
                        mensaje: "Registro actualizado con exito.",
                        esError: false,
                        mostrar: true
                    });
                openCloseModalEdit();
        }
    });


    function funDeleteProducto()
    {
        deleteProducto();           
    }

    const [deleteProducto, { deleteLoading }] = useMutation(DELETE_PRODUCT,{
        onError({ graphQLErrors }){
            setErrors(graphQLErrors);
        },
        variables: {codigo: productoSeleccionado.codigo} ,
        onCompleted: (data) => {

                var newData = [...productData];
                var editado = data.deleteProductById;
                    newData.map(array => { 
                        
                        if( array.codigo !== editado.codigo ){
                            return array;
                        }
                    })
                    var indiceAEliminar = newData.findIndex((valor) => valor.codigo === editado.codigo);
                    const nuevoArray = [...newData.slice(0, indiceAEliminar), ...newData.slice(indiceAEliminar + 1)];

                    setMostrarSnackBar({
                        mensaje: "Registro eliminado con exito.",
                        esError: false,
                        mostrar: true
                    });
                    
                    setProductData(nuevoArray);
                openCloseModalDelete();
        }
    });

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
        setTipoSeleccionado(null);
        setModalEdit(!modalEdit);
    }

    const openCloseModalDelete=()=>{
        setErrors([]);
        setTipoSeleccionado(null);
        setModalDelete(!modalDelete);
    }

    const seleccionarProducto=(producto, caso)=>{
        setErrors([]);
        let tipo = typeProductData.find((valor)=> valor.codigo === producto.tipo_producto);
       
        setTipoSeleccionado(tipo);
        setProductoSeleccionado(producto);
        if (caso == 'Editar') {
            setModalEdit(true)
        }  else{
            setModalDelete(true)
        }
    }

    //--------------------------------------------------------
    const defaultProps = {
        options: typeProductData,
        getOptionLabel: (option) => option.nombre,
    };

    const bodyCreate=(
        <div className="modal">
            <h3>Crear {title}</h3>
            <TextField name="nombre" className="inputMaterial" label="Nombre" onChange={handleChange}/> <br/>
            <br/>
            <TextField name="descripcion" className="inputMaterial" label="Descripcion" onChange={handleChange}/> <br/>
            <br/>
            <Autocomplete
                {...defaultProps}
                id="tipo_producto"
                name="tipo_producto"
                clearOnEscape
                value={tipoSeleccionado}
                //onChange={handleChange}
                onChange={(event, newValue) => {
                    if(newValue !== null){
                        setTipoSeleccionado(newValue);
                        setProductoSeleccionado(prevState=>({
                            ...prevState,
                            "tipo_producto": newValue.codigo
                        }));
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Tipo de producto" />
                )}
            />

            <br/>
            <br/>
            <div align="right">
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="contained" onClick={openCloseModalCreate} color="error">Cerrar</Button>
                    <Button variant="contained" onClick={funCreateProducto} color="primary">Crear</Button>
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
            <TextField name="descripcion" className="inputMaterial" label="Descripcion" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.descripcion}/> <br/>
            <br/>
            <Autocomplete
                {...defaultProps}
                id="tipo_producto"
                name="tipo_producto"
                clearOnEscape
                value={tipoSeleccionado}
                onChange={(event, newValue) => {
                    if(newValue !== null){
                        setTipoSeleccionado(newValue);
                        setProductoSeleccionado(prevState=>({
                            ...prevState,
                            "tipo_producto": newValue.codigo
                        }));
                    }
                }}
                isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                renderInput={(params) => (
                    <TextField {...params} label="Tipo de producto" />
                )}
            />

            <br/>
            <br/>
            <div align="right">
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="contained" onClick={openCloseModalEdit} color="error">Cerrar</Button>
                    <Button variant="contained" onClick={funEditProducto} color="primary">Editar</Button>
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
            <p>Está seguro de Eliminar este {title} " {productoSeleccionado && productoSeleccionado.nombre} "?</p>
            <div align="right">
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="contained" onClick={openCloseModalDelete}>No</Button>
                    <Button variant="contained" onClick={funDeleteProducto} color="primary">Sí</Button>
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
    const datosFiltrados = productData.filter((dato) =>
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
        <Button variant="contained" color="success" onClick={openCloseModalCreate}>Nuevo</Button>
      );

    const miFiltro = (
        <TextField label="Buscar por nombre" value={filtro} onChange={handleFiltroChange} />
    );
    return (
    <>
        {errors?.map(function(error){
                return(
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            })}
        <div>
        <Container spacing={4} maxWidth="md">
        {mostrarSnackBar.mostrar && (
            <SimpleSnackbar onClose={closeSnackBars} objeto={mostrarSnackBar} />
        )}
        <MyTitle titulo={title} boton={miBoton} buscar={miFiltro}></MyTitle>
            <br/>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
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
                                <TableCell>{console.nombre}</TableCell>
                                <TableCell>{console.descripcion}</TableCell>
                                <TableCell>{console.activo == true ? "Activo" : "Inactivo"}</TableCell>
                                <TableCell>
                                    <Edit className="iconos" onClick={() => seleccionarProducto(console, 'Editar')} />
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete className="iconos" onClick={() => seleccionarProducto(console, 'Eliminar')} />        
                                </TableCell>
                            
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={productData.length}
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

        </div>
    </>
    )

}

export default Product;