import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
function MyTitle(props) {
    const { titulo, boton, buscar } = props;

  return (
    <div>
        <br/>
      <Grid container  
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
          {titulo}
          </Typography>
        </Grid>
        <Grid item xs={2} container
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center">
            {boton ? boton : ""}
        </Grid>
        <Grid item xs={4}
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center">
          
          {buscar ? buscar : ""}
        </Grid>
      </Grid>
      <hr style={{border: "1px dashed grey", height: 0, width: "80%"}} />
    </div>
  );
}

export default MyTitle;
