import { useState, useEffect, createRef } from 'react';
import Select from 'react-select';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  TableContainer,
  Paper,
  Tooltip,
} from '@material-ui/core';
import * as S from './GollyTable.css';
import NumberFormat from 'react-number-format';
import Pdf from 'react-to-pdf';

const stateOptions = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
];

const colors = [
  'blueViolet',
  'aqua',
  'chartreuse',
  'coral',
  'darkGrey',
  'fuchsia',
  'red',
];

const ref = createRef();

const GollyTable = ({ lut, nr_states, nr_cells, showTable }) => {
  const [settingColor, setColor] = useState('blueViolet');
  const [lutConverter, setLutConverter] = useState([]);
  const [table, setTable] = useState([]);
  const [header, setHeader] = useState([]);
  const [stepsGeneration, setStepsGeneration] = useState();
  const [goClicked, setGo] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hideNumbers, setHideNumbers] = useState(false);
  const running = table.length > 0;

  const useStyles = makeStyles({
    table: {
      maxWidth: nr_cells * 50,
    },
  });

  const onCellClick = (idx) => {
    if (!running) {
      setHeader((header) =>
        header.map((el, index) => {
          if (idx === index) {
            return colors.findIndex((col) => col === settingColor);
          }
          return el;
        }),
      );
    }
  };

  const reset = () => {
    setTable([]);
    setHeader(Array.apply(null, { length: nr_cells }).map((el) => 0));
  };

  const randomHeader = () => {
    setHeader((header) =>
      header.map((el) => Math.floor(Math.random() * nr_states)),
    );
  };

  const classes = useStyles();

  useEffect(() => {
    if (timer !== 0) {
      var checker = !table.length ? header : table[table.length - 1];
      let temp = [];
      for (var i = 0; i < nr_cells; i++) {
        let first;
        let second;
        let third;
        if (i === 0) {
          first = checker[nr_cells - 1];
          second = checker[0];
          third = checker[1];
        } else if (i === nr_cells - 1) {
          first = checker[nr_cells - 2];
          second = checker[nr_cells - 1];
          third = checker[0];
        } else {
          first = checker[i - 1];
          second = checker[i];
          third = checker[i + 1];
        }
        const convertedValue = lutConverter.find(
          (el) => el[0] === first && el[1] === second && el[2] === third,
        );
        temp.push(convertedValue[3]);
      }
      setTable((table) => [...table, temp]);
    }
  }, [timer]);

  useEffect(() => {
    if (!showTable) {
      setHeader([]);
      setTable([]);
    } else {
      setHeader(Array.apply(null, { length: nr_cells }).map((el) => 0));
    }
  }, [showTable]);

  useEffect(() => {
    setTable([]);

    var number = String(lut);

    var lutAsList = number.split('');

    lutAsList = lutAsList.map((el) => Number(el));

    let one_row = Array.apply(null, { length: 3 }).map((el) => 0);

    let lutConverterTemp = [];

    for (var i = 0; i < lutAsList.length; i++) {
      lutConverterTemp.push([one_row[0], one_row[1], one_row[2], lutAsList[i]]);
      let index = 2;
      while (true) {
        one_row[index] = one_row[index] + 1;
        if (one_row[0] === nr_states) {
          break;
        }
        if (one_row[index] === nr_states) {
          one_row[index] = 0;
          index = index - 1;
        } else {
          break;
        }
      }
    }
    setLutConverter(lutConverterTemp);
  }, [lut]);

  const generateFirstTwenty = () => {
    let temp20 = [];
    for (let j = 21; j--; ) {
      var checker = !temp20.length ? header : temp20[temp20.length - 1];
      let temp = [];
      for (var i = 0; i < nr_cells; i++) {
        let first;
        let second;
        let third;
        if (i === 0) {
          first = checker[nr_cells - 1];
          second = checker[0];
          third = checker[1];
        } else if (i === nr_cells - 1) {
          first = checker[nr_cells - 2];
          second = checker[nr_cells - 1];
          third = checker[0];
        } else {
          first = checker[i - 1];
          second = checker[i];
          third = checker[i + 1];
        }
        const convertedValue = lutConverter.find(
          (el) => el[0] === first && el[1] === second && el[2] === third,
        );
        temp.push(convertedValue[3]);
      }
      temp20.push(temp);
    }
    setTable((table) => [...table, ...temp20]);
  };

  const oneStepGeneration = async () => {
    var checker = !table.length ? header : table[table.length - 1];
    let temp = [];
    for (var i = 0; i < nr_cells; i++) {
      let first;
      let second;
      let third;
      if (i === 0) {
        first = checker[nr_cells - 1];
        second = checker[0];
        third = checker[1];
      } else if (i === nr_cells - 1) {
        first = checker[nr_cells - 2];
        second = checker[nr_cells - 1];
        third = checker[0];
      } else {
        first = checker[i - 1];
        second = checker[i];
        third = checker[i + 1];
      }
      const convertedValue = lutConverter.find(
        (el) => el[0] === first && el[1] === second && el[2] === third,
      );
      temp.push(convertedValue[3]);
    }
    setTable((table) => [...table, temp]);
  };

  const clickGo = () => {
    setGo(true);
    setStepsGeneration(setInterval(() => setTimer((timer) => timer + 1), 500));
  };

  const clickStop = () => {
    setGo(false);
    clearInterval(stepsGeneration);
  };

  const changeColor = (color) => {
    setColor(color);
  };

  return (
    <S.Container>
      <S.ButtonsContainer>
        {colors.map(
          (color, idx) =>
            idx < nr_states && (
              <S.ColorsContainer
                border={
                  settingColor === color ? '#000' : 'rgba(224, 224, 224, 1)'
                }
                backgroundColor={color}
                key={`color-${idx}`}
                onClick={() => changeColor(color)}
              >
                {idx}
              </S.ColorsContainer>
            ),
        )}
      </S.ButtonsContainer>
      <S.ButtonsContainer>
        <Tooltip
          title={
            nr_cells === '16' ? (
              ''
            ) : (
              <h3 style={{ textAlign: 'center' }}>
                Only available when number of cells equal 16
              </h3>
            )
          }
        >
          <span>
            <Pdf targetRef={ref} filename="cellular-automata-1D.pdf">
              {({ toPdf }) => (
                <Button
                  disabled={goClicked || !(nr_cells === '16')}
                  onClick={toPdf}
                  variant="outlined"
                >
                  Generate Pdf
                </Button>
              )}
            </Pdf>
          </span>
        </Tooltip>

        <S.ButtonContainer>
          <Button
            onClick={reset}
            disabled={!running || goClicked}
            variant="contained"
          >
            Reset
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button
            onClick={() => setHideNumbers((hideNumbers) => !hideNumbers)}
            disabled={goClicked}
            variant="contained"
          >
            {hideNumbers ? 'Show Numbers' : 'Hide Numbers'}
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button onClick={randomHeader} disabled={running} variant="contained">
            Random Configuration
          </Button>
        </S.ButtonContainer>
      </S.ButtonsContainer>
      <S.ButtonsContainer>
        <S.ButtonContainer>
          <Button
            onClick={() => setTable([])}
            disabled={!running || goClicked}
            variant="contained"
          >
            Clear
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button variant="contained" onClick={clickStop} disabled={!goClicked}>
            Stop
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button
            onClick={oneStepGeneration}
            variant="contained"
            disabled={goClicked}
          >
            One Step
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button variant="contained" onClick={clickGo} disabled={goClicked}>
            Go
          </Button>
        </S.ButtonContainer>
        <S.ButtonContainer>
          <Button
            onClick={generateFirstTwenty}
            disabled={table.length > 0}
            variant="contained"
          >
            Generate first 21
          </Button>
        </S.ButtonContainer>
      </S.ButtonsContainer>
      <TableContainer className={classes.table} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
          ref={ref}
        >
          <TableHead>
            <TableRow>
              {header.map((cell, idx) => (
                <TableCell
                  style={{
                    backgroundColor: colors[cell],
                    height: '38px',
                    width: '49px',
                  }}
                  component="th"
                  scope="row"
                  key={`header-cell-${idx}`}
                  onClick={() => onCellClick(idx)}
                >
                  {!hideNumbers && cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.map((row, idx) => (
              <TableRow key={`row-${idx}`}>
                {row.map((rowCell, idx2) => (
                  <TableCell
                    style={{
                      backgroundColor: colors[rowCell],
                      height: '38px',
                      width: '49px',
                    }}
                    key={`row-cell-${idx2}`}
                    component="th"
                    scope="row"
                  >
                    {!hideNumbers && rowCell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </S.Container>
  );
};

export default GollyTable;
