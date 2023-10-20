import { Button } from "@mui/material"
import { Download } from '@mui/icons-material';
import React, {useRef} from 'react';
import {useDownloadExcel} from "react-export-table-to-excel";

function ccyFormat(num) {
  return `Q. ${num.toFixed(2)}`;
}

export default function SpanningTable(props) {
  const { datos, ffin, finicio } = props;
  const [ tipo, setTipo ] = React.useState([]);
  const [ fondo, setFondo ] = React.useState([]);
  const [ producto, setProducto ] = React.useState([]);
  const [ conteo, setConteo ] = React.useState(0);
  const [ nombreComunidad, setNombreComunidad ] = React.useState("");
  const [ mes, setMes ] = React.useState({});
  const [ totalIngresos, setTotalIngresos ] = React.useState(0);
  const [ totalCostos, setTotalCostos ] = React.useState(0);
  const [ totalGastos, setTotalGastos ] = React.useState(0);
  const [ totalGastosMantenimiento, setTotalGastosMantenimiento] = React.useState(0);
  const [ totalFondos, setTotalFondos] = React.useState(0);
  
  const [ gananciaNeta, setGananciaNeta ] = React.useState(0);

  const funTotales = (tipo_producto, fondos) => {
    //total de ingresos
    let vtotalIngresos = 0, 
        vtotalGastos = 0, 
        vtotalCostos = 0, 
        vtotalFondos = 0, 
        vtotalGastoMantenimiento = 0,
        vTotalGananciasNeta = 0;

    const sumaTotal = tipo_producto.forEach(element => {
      //Gasto
      if(element.es_costo === false && element.es_producto === false){
        
        vtotalGastos += element.productos.reduce((total, producto) => 
          total + producto.total,0
        );
      }
      
      if(element.es_costo === true && element.es_producto === false){
        vtotalCostos += element.productos.reduce((total, producto) => 
          total + producto.total,0
        );
      }
      if(element.es_costo === false && element.es_producto === true){
        vtotalIngresos += element.productos.reduce((total, producto) => 
          total + producto.total,0
        );
      } 
      
    });

     //total de gatos
     const sumaGastos = fondos.forEach( valor => {
      if(valor.fon_es_fondo === false){
        vtotalGastoMantenimiento += (valor.fon_porcentaje * vtotalIngresos)/100
      }
    })

    vTotalGananciasNeta = ((vtotalIngresos - vtotalCostos)-(vtotalGastos+vtotalGastoMantenimiento));

    //total de fondos
    const sumaFondos = fondos.forEach( valor => {
      if(valor.fon_es_fondo === true){
        vtotalFondos += (vTotalGananciasNeta * valor.fon_porcentaje)/100
      }
    });

    setTotalFondos(vtotalFondos);
    setGananciaNeta(vTotalGananciasNeta) 
    setTotalGastosMantenimiento(vtotalGastoMantenimiento);
    setTotalIngresos(vtotalIngresos);
    setTotalCostos(vtotalCostos);
    setTotalGastos(vtotalGastos);
  }

  function formatearFecha(fechaOriginal) {
    // Obtiene el día, mes y año
    const dia = fechaOriginal.substring(8, 10);
    const mes = fechaOriginal.substring(5, 7);
    const anio = fechaOriginal.substring(0, 4);

    // Formatea el mes y el día con ceros a la izquierda si es necesario
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
  
    // Formatea la fecha en el formato deseado
    const fechaFormateada = `${mesFormateado}/${diaFormateado}/${anio}`;
  
    return fechaFormateada;
  }  

  const funFecha = (finicio, ffin) =>{
     
    const fechaInicioFormateada = formatearFecha(finicio);
    const fechaFinFormateada = formatearFecha(ffin);
    
    let fecha_inicio = new Date(fechaInicioFormateada);
    let fecha_fin = new Date(fechaFinFormateada);

    const arrMes = [
      'Enero', 'Febrero', 'Marzo','Abril', 'Mayo',
      'Junio', 'Julio', 'Agosto','Septiembre','Octubre',
      'Noviembre', 'Diciembre'
    ]

    if(fecha_fin.getMonth() === fecha_inicio.getMonth())
    {
      setMes({
        mes: "mes",
        nombre: arrMes[fecha_inicio.getMonth()]
      })
    }

    if(fecha_fin.getMonth() !== fecha_inicio.getMonth())
    {
      setMes({
        mes: "meses",
        nombre: arrMes[fecha_inicio.getMonth()] +" - "+ arrMes[fecha_fin.getMonth()]
      })
    }
  }

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Reporte ${nombreComunidad}` ,
    sheet: "Reporte"
  })

  React.useEffect(() => {
    setTipo(datos[0].tipo_producto);
    setFondo(datos[0].fondo);
    setNombreComunidad(datos[0].nombre);
    funTotales(datos[0].tipo_producto, datos[0].fondo);
    funFecha(finicio, ffin);
  },[])

  return (
      <div>
        <div>
          <br/>
          <Button variant="contained" onClick={onDownload} color="info"> <Download className='iconos'/>Descargar</Button>
        </div>
      <table ref={tableRef}
      style={{
              "border-collapse": "collapse", 
              "margin": "25px 50px 50px 50px",
              "box-shadow": "0 0 20px rgba(0, 0, 0, 0.15)"
            }} 
      border="1px" aria-label="spanning table" width="90%">
        <thead>
          <tr>
            <th colSpan={4}>Reporte Mensual</th>
          </tr>
          <tr>
            <th align='right' colSpan={2}>Comunidad:</th>
            <th colSpan={2}>{nombreComunidad}</th>
          </tr>
          <tr>
            <th align='right' colSpan={2}>{mes.mes}:</th>
            <th colSpan={2}>{mes.nombre}</th>
          </tr>
          <tr>
            <th colSpan={4}><br/></th>
          </tr>
          <tr>
            <th>Cantidad de personas</th>
            <th>Cantidad</th>
            <th>Descripcion</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {tipo
        .sort((x, y) => x.orden - y.orden)
        .map((row, index, arr ) => ( 
            <React.Fragment key={row.codigo}>
              <tr>
                  <td></td>
                  <td></td>
                  <th align='center'>{row.nombre}</th>
                  <td></td>
              </tr>
              {row.productos.map((product, pindex) => (
                <tr>
                  <td align='center'>{1}</td>
                  <td align='center'>{product.cantidad}</td>
                  <td>{product.nombre_producto}</td>
                  <td align='right'>{ccyFormat(product.total)}</td>
                </tr>
              ) )}

              {row.orden === 7 ? 
              <tr>
                  <td></td>
                  <td></td>
                  <th align='center'>Total de ingresos</th>
                  <td align='right'>{ccyFormat(totalIngresos? totalIngresos : 0)}</td>
              </tr>
              :<></>}

              {row.es_costo === true && row.es_producto === false ?
              <tr>
                <td align='center'>{}</td>
                <td align='center'>{}</td>
                <th align='left'>Ganancia bruta</th>
                <td align='right'>{ccyFormat(totalIngresos - totalCostos)}</td>
              </tr>
                :
                <></>
              }

              {row.es_costo === false && row.es_producto === false ?
                fondo.map((fondos) => (
                  !fondos.fon_es_fondo ?
                  <tr>
                    <td align='center'>{}</td>
                    <td align='center'>{}</td>
                    <td>{fondos.fon_nombre}</td>
                    <td align='right'>{ccyFormat((totalIngresos*fondos.fon_porcentaje)/100)}</td>
                  </tr>
                  : 
                  <></>
                ))
              :
              <></>
              }

            </React.Fragment>
        ))}

        <tr>
          <td align='center'>{}</td>
          <td align='center'>{}</td>
          <th align='center'>Total Gastos</th>
          <td align='right'>{ccyFormat(totalGastos + totalGastosMantenimiento)}</td>
        </tr>

        <tr>
          <td align='center'>{}</td>
          <td align='center'>{}</td>
          <th align='left'>Ganancia Neta</th>
          <td align='right'>{ccyFormat(gananciaNeta)}</td>
        </tr>
        {
          fondo.map((fondos) => (
            fondos.fon_es_fondo ?
            <tr>
              <td align='center'>{}</td>
              <td align='center'>{}</td>
              <td>{fondos.fon_nombre}</td>
              <td align='right'>{ccyFormat( (gananciaNeta * fondos.fon_porcentaje)/100 )}</td>
            </tr>
            : 
            <></>
          ))
        }
        <tr>
          <td align='center'>{}</td>
          <td align='center'>{}</td>
          <th align='left'>Fondo de reinversión</th>
          <td align='right'>{ccyFormat(gananciaNeta - totalFondos)}</td>
        </tr>
        </tbody>
      </table>
    </div>
    // <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 700 }} aria-label="spanning table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell align="center" colSpan={4}>
    //           Reporte Mensual 
    //         </TableCell>
    //       </TableRow>
    //       <TableRow>
    //         <TableCell align="center" colSpan={2}>
    //           Comunidad:
    //         </TableCell>
    //         <TableCell align="center" colSpan={2}>
    //           Nombre del punto de venta
    //         </TableCell>
    //       </TableRow>
    //       <TableRow>
    //         <TableCell align="center" colSpan={2}>
    //           Mes de: 
    //         </TableCell>
    //         <TableCell align="center" colSpan={2}>
    //             NOmbre del mes
    //         </TableCell>
    //       </TableRow>
    //       <TableRow>
    //         <TableCell align="center">Personas</TableCell>
    //         <TableCell align="center">Cantidad</TableCell>
    //         <TableCell align="center">Descripcion</TableCell>
    //         <TableCell align="center">Total</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
          
    //       {tipo.map((row) => (
    //         <TableRow key={row.codigo}>
    //           <TableCell align="center">{}</TableCell>
    //           <TableCell align="center">{}</TableCell>
    //           <TableCell align="left">{row.nombre}</TableCell>
    //           <TableCell align="center">{}</TableCell>
    //         </TableRow> 
    //       ))}
          
    //       <TableRow key={1}>
    //           <TableCell>{"Columna 1" }</TableCell>
    //             <TableCell>{"Columna 2" }</TableCell>
    //             <TableCell>{"Columna 2" }</TableCell>
    //             <TableCell>{"Columna 2" }</TableCell>
    //         </TableRow>
          


    //       <TableRow>
    //         <TableCell rowSpan={3} />
    //         <TableCell colSpan={2}>Subtotal</TableCell>
    //         <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
    //       </TableRow>
    //       <TableRow>
    //         <TableCell>Tax</TableCell>
    //         <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
    //         <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
    //       </TableRow>
    //       <TableRow>
    //         <TableCell colSpan={2}>Total</TableCell>
    //         <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
    //       </TableRow>
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
}