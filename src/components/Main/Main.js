import { useState } from 'react';
import Select from 'react-select';
import { Typography, TextField, Button } from '@material-ui/core';
import * as S from './Main.css';
import NumberFormat from 'react-number-format';
import GollyTable from '../GollyTable';
import { toast } from 'react-toastify';

export const stateOptions = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
];

const Main = () => {
  const [state, setState] = useState({ value: 2, label: '2' });
  const [lut, setLut] = useState('');
  const [lutToUse, setLutToUse] = useState('');
  const [cells, setCells] = useState(3);
  const [showTable, setShowTable] = useState(false);

  const handleStateChange = (event) => {
    setState(event);
    setLut('');
    setShowTable(false);
  };

  const handleLutChange = (event) => {
    setLut(event.formattedValue);
  };

  const handleCellsChange = (event) => {
    setCells(event.formattedValue);
    setShowTable(false);
  };

  const onSubmit = () => {
    if (lutLength === lut.length) {
      const notAllowedNumber = lut
        .split('')
        .some((digit) => Number(digit) >= state.value);
      if (notAllowedNumber) {
        window.alert(
          `Numbers from 0 to ${
            state.value - 1
          } are allowed in LUT. Please fix it.`,
        );
      } else if (cells > 30 || cells < 3) {
        window.alert(
          'Number of cells must be placed between 3 and 30. Please fix it.',
        );
      } else {
        setLutToUse(lut);
        setShowTable(true);
      }
    } else {
      window.alert(
        `Length of LUT is incorrect (${lut.length}/${lutLength}). Please correct that`,
      );
    }
  };

  const lutLength = state.value * state.value * state.value;

  return (
    <S.Container>
      <S.SelectsContainer>
        <Typography variant="h6">Number of states</Typography>
        <S.SelectContainer>
          <Select
            name="states"
            placeholder="States"
            options={stateOptions}
            onChange={handleStateChange}
            value={state}
          />
        </S.SelectContainer>
        <Typography variant="h6">LUT</Typography>
        <NumberFormat
          name="lut"
          value={lut}
          onValueChange={handleLutChange}
          onBlur={() =>
            showTable &&
            toast.info('Remember to click Submit button to apply changes')
          }
          variant="outlined"
          style={{ textTransform: 'capitalize', width: '100%' }}
          size="small"
          margin="dense"
          fullWidth
          helperText={`${lut.length}/${lutLength}`}
          autoComplete="off"
          customInput={TextField}
          allowNegative={false}
          decimalScale={0}
          allowLeadingZeros={true}
        />
        <Typography variant="h6">Number of cells(3-30)</Typography>
        <NumberFormat
          name="cells"
          value={cells}
          onValueChange={handleCellsChange}
          variant="outlined"
          style={{ textTransform: 'capitalize', width: '100%' }}
          size="small"
          margin="dense"
          fullWidth
          autoComplete="off"
          customInput={TextField}
          allowNegative={false}
          decimalScale={0}
        />
        <Button onClick={onSubmit} variant="contained">
          Submit
        </Button>
      </S.SelectsContainer>
      {showTable ? (
        <GollyTable
          lut={lutToUse}
          nr_states={state.value}
          nr_cells={cells}
          showTable={showTable}
        />
      ) : (
        <></>
      )}
    </S.Container>
  );
};

export default Main;