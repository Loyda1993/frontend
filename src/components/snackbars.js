import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

export default function SimpleSnackbar(props) {
    const { objeto, onClose } = props;
    const { mensaje, esError, mostrar} = objeto;
    const [open, setOpen] = React.useState(mostrar);

  React.useEffect(() =>{
    if(mostrar === true){
        setOpen(true);
    }
    if(mostrar === false){
        setOpen(false);
    }
  },[])

  return (
    <div>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            autoHideDuration={5000}
        >
        <Alert 
            onClick={onClose}
            severity={esError == true ? "error" : "success"}
            sx={{ width: '100%' }}>
            {mensaje}
        </Alert>
      </Snackbar>
    </div>
  );
}