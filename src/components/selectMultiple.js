import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { GET_POINT_SALE_USER } from '../gql/mutation'
import { useMutation, useQuery } from "@apollo/react-hooks";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8; 
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
    const { datos, onChange, seleccionados } = props;

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
 
  var nombres = [];

    seleccionados?.map((valor) => {
        nombres.push(valor.nombre)
    })

    React.useEffect(() => {
        setPersonName(nombres);
    },[])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        
        setPersonName(
        // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    React.useEffect(()=>{
      onChange(personName)
    })

  return (
    <div>
      <FormControl sx={{ m: 1, width: 390 }}>
        <InputLabel id="demo-multiple-chip-label">Seleccione una o varias opción</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Seleccione una o varias opción" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {datos.map((dato) => (
            <MenuItem
              key={dato.codigo}
              value={dato.nombre}
              style={getStyles(dato.nombre, personName, theme)}
            >
              {dato.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
