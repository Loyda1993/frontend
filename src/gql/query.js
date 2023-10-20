import { gql } from 'graphql-tag';

export const GET_ALL_PRODUCT = gql`
    query AllProduct{
        getAllProduct{ codigo nombre descripcion activo tipo_producto}
    }
`
export const GET_ALL_TYPE_PRODUCT = gql`
    query AllTypeProduct{
        getAllTypeProduct{ codigo nombre descripcion activo orden es_producto}
    }
`
export const GET_PRODUCT_BYID = gql`
    query Product ($codigo: Int!) {  
        getProductById(codigo: $codigo){ codigo nombre descripcion activo tipo_producto}
    }
`

export const GET_ALL_POINT_SALE = gql`
query AllPointSale{
    getAllPointSale{ codigo nombre descripcion activo
        productos{codigo_punto_venta codigo nombre descripcion precio}}
}
`
export const GET_ALL_USER = gql`
query AllUser{
    getAllUsers{
        codigo
        nombre
        correo
        activo
        punto_venta{
            codigo
            nombre
            descripcion
            activo
        }
        roles{
            codigo
            nombre
            activo
        }
    }
}
`

export const GET_ALL_TYPE_ROL =gql`
query PointSaleForUser {
	getAllTypeRol{
		codigo
		nombre
		activo
	}
}`