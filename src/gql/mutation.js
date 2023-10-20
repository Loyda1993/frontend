import { gql } from 'graphql-tag';

export const CREATE_PRODUCT = gql`
    mutation mutation ($nombre: String!, $descripcion: String!, $tipo_producto: Int!){
	createProduct(
		nombre:$nombre,
		descripcion:$descripcion, 
		activo:true,  
		tipo_producto:$tipo_producto
	){codigo nombre descripcion activo tipo_producto}}`

export const EDIT_PRODUCT = gql`
    mutation mutation ($codigo: Int!, $nombre: String!, $descripcion: String!, $tipo_producto: Int!){
	updateProduct(
		codigo: $codigo,
		nombre: $nombre,
		descripcion: $descripcion, 
		activo: true,  
		tipo_producto: $tipo_producto
	){codigo nombre descripcion activo tipo_producto}}`

export const DELETE_PRODUCT = gql`
    mutation mutation ($codigo: Int!){
	deleteProductById(
		codigo: $codigo
	){codigo nombre descripcion activo tipo_producto}}`


export const CREATE_TYPE_PRODUCT = gql`
    mutation mutation ($nombre: String!, $descripcion: String!){
	createTypeProduct(
		nombre:$nombre,
		descripcion:$descripcion, 
		activo:true,  
		es_producto: true
	){codigo nombre descripcion activo es_producto }}`

export const EDIT_TYPE_PRODUCT = gql`
    mutation mutation ($codigo: Int!, $nombre: String!, $descripcion: String!){
	updateTypeProduct(
		codigo: $codigo
		nombre: $nombre
		descripcion:$descripcion, 
		activo:true,  
		es_producto: true
	){codigo nombre descripcion activo es_producto }}`

export const DELETE_TYPE_PRODUCT = gql`
    mutation mutation ($codigo: Int!){
	deleteTypeProductById(codigo: $codigo){
		codigo
		nombre
		descripcion
		activo
		es_producto	 
	}}`


export const CREATE_POINT_SALE = gql`
    mutation mutation ($nombre: String!, $descripcion: String!){
	createPointSale(
		nombre:$nombre,
		descripcion:$descripcion, 
		activo:true,
		cantidad: 1
	){codigo nombre descripcion activo
		productos{codigo nombre descripcion precio}
	}}`

export const EDIT_POINT_SALE = gql`
    mutation mutation ($codigo: Int!, $nombre: String!, $descripcion: String!){
	updatePointSale(
		codigo: $codigo,
		nombre: $nombre,
		descripcion: $descripcion, 
		activo: true,  
		cantidad: 1
	){codigo nombre descripcion activo
		productos{codigo nombre descripcion precio}
	}}`

export const DELETE_POINT_SALE = gql`
    mutation mutation ($codigo: Int!){
	deletePointSaleById(
		codigo: $codigo
	){codigo nombre descripcion activo}}`

export const CREATE_POINT_PRODUCTO = gql`
	mutation mutation ($codigo_producto: Int!, $codigo_punto_venta: Int!, $precio: Float!){
		createProductPointSale(producto: $codigo_producto,
								punto_venta:$codigo_punto_venta,
								precio: $precio,
								activo: true){
			codigo producto punto_venta precio
		}
	}`
export const CREATE_USER = gql`
	mutation user(
		$nombre: String!, 
		$correo: String!,
		$contrasena: String!, 
		$rol: Int!
	){
		createUser( nombre: $nombre, 	
					correo: $correo,
					contrasena: $contrasena, 
					rol: $rol 
		){
			codigo
			nombre
			correo
			activo
		},	
	}
`

export const UPDATE_USER = gql`
	mutation user(
		$codigo: Int!,
		$nombre: String!, 
		$correo: String!,
		$rol: Int!
	){
	updateUser( codigo: $codigo 
							nombre: $nombre, 	
							correo: $correo,  
							estado: true,
						rol: $rol  
	){
		codigo
		nombre
		correo
		activo
	}
	}
`
export const DELETE_USER = gql`
	mutation user(
			$codigo: Int!
	){
		deleteUser(codigo: $codigo){
			codigo 
			nombre 
			correo 
			activo 
		}
	}
`

export const UPDATE_PASSWORD = gql`
mutation user(
		$codigo: Int!,
		$contrasena: String!,
	$valcontrasena:String!
){
	updatePasswordUser(
			codigo: $codigo, 
		contrasena: $contrasena,  
		valcontrasena: $valcontrasena)
	{
		codigo 
		nombre
		 correo
		activo
	}
}`

export const CREATE_POINT_SALE_USER = gql`
mutation user(
		$codigo: Int!,
		$puntos_venta: [String!]!
){
	createPointSaleUser(
		codigo: $codigo, 
		puntos_venta:$puntos_venta
	){
		codigo 
		nombre
		descripcion
		activo
		cantidad}
}`

export const CREATE_ROL_USER = gql`
mutation user(
		$codigo: Int!,
		$roles: [String!]!
){
	createRolUser(codigo: $codigo, roles: $roles){codigo
	 nombre
		activo
	}
}`

export const GET_POINT_SALE_USER = gql`
mutation PointSaleForUser ($codigo: Int!){	
	getPointSaleById(codigo: $codigo){
		codigo
		nombre
		activo
		cantidad		 
		descripcion
		 productos{
			 codigo_punto_venta
			 codigo
			nombre
			 descripcion
			 precio
			 activo
			 tipo_producto
		}
	}
}`

export const CREATE_JOURNAL = gql`
mutation mutation ($codigo:Int!) {
	createJournal(codigo_punto_venta:$codigo){
		codigo_dia
		 codigo_punto_venta
		 fecha
		 abierto
	}
}`

export const CREATE_JOURNAL_DETAIL = gql`
mutation mutation (
		$codigo_dia:Int! 
		$codigo_producto: Int! 
		$cantidad: Int! 
		$cantidad_personas: Int! 
		$descripcion: String!) 
{
	createJournalDetail(
			codigo_dia: $codigo_dia, 
			codigo_producto: $codigo_producto, 
			cantidad:$cantidad, 
			cantidad_personas: $cantidad_personas, 
			descripcion: $descripcion
	){
		codigo
		codigo_dia
		codigo_producto
		cantidad
		cantidad_personas
		descripcion
	}
}`

export const GET_JOURNAL_DETAIL_FOR_DAY = gql`
mutation Mutation($codigo: Int!){
	getJournalDetailForDay(codigo: $codigo){
		codigo_detalle
		codigo_producto
		nombre_producto
		cantidad
		descripcion
		precio
		tipo_producto
	}
}`

export const EDIT_JOURNAL_DETAIL = gql`
mutation mutation (
		$codigo_detalle: Int!, 
		$codigo_dia:Int!,
		$cantidad: Int!, 
		$descripcion: String!
	) {
		editJournalDetail(
				codigo_detalle: $codigo_detalle  
				codigo_dia: $codigo_dia
				cantidad: $cantidad 
				descripcion: $descripcion
		){
			codigo
			codigo_dia
			codigo_producto
			cantidad
			cantidad_personas
			descripcion
   		}
	}
`

export const DELETE_JOURNAL_DETAIL = gql`
mutation mutation (
		$codigo_detalle: Int!, 
		$codigo_dia:Int!) {
	deleteJournalDetail(
		codigo_detalle: $codigo_detalle  
		codigo_dia: $codigo_dia 
	) 
	{
		codigo
		codigo_dia
		codigo_producto
		cantidad
		cantidad_personas
		descripcion
	}
}
`

export const REPORT_MONTH = gql`
mutation Mutation (
		$codigo_punto_venta: Int! 
		$fecha_inicio: String! 
		$fecha_fin: String!
	) {
	getReportJournal(
		codigo_punto_venta: $codigo_punto_venta
		fecha_inicio: $fecha_inicio
		fecha_fin: $fecha_fin
	){
		codigo
		nombre
		descripcion
		activo
		cantidad
		fecha
		fondo {
			fon_codigo
			fon_nombre
			fon_porcentaje
			fon_es_fondo
		}
		tipo_producto{
			codigo
			nombre
			descripcion
			es_producto
			es_costo
			orden
			productos{
				codigo_producto
				nombre_producto
				precio
				cantidad
				total
		}
	}
}
}`

export const DELETE_PRODUCT_POINT_SALE = gql`
mutation mutation ($codigo: Int!) {
	deleteProductPointSaleById(codigo: $codigo){
		  codigo 
		  producto
		   punto_venta
		   precio
		   activo
	  }
  }
`

export const UPDATE_PRODUCT_POINT_SALE = gql`
mutation mutation (
	$codigo: Int!, 
	$producto: Int!, 
	$punto_venta: Int!
	$precio: Float!
) {
	updateProductPointSale( 
		codigo: $codigo
		producto: $producto
		punto_venta: $punto_venta
		precio: $precio
		activo: true
	){
		codigo
		producto
		punto_venta
		precio
		activo
	}
}
`