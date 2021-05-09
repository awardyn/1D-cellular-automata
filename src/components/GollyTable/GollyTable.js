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
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';

const ref = createRef();

const popover = {
  position: 'absolute',
  zIndex: '2',
};
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};

const GollyTable = ({ lut, nr_states, nr_cells, showTable }) => {
  const [colors, setColors] = useState([
    'blueViolet',
    'aqua',
    'chartreuse',
    'coral',
    'darkGrey',
    'fuchsia',
    'red',
    'green',
  ]);
  const [colorChanging, setColorChanging] = useState('');
  const [colorChangingIndex, setColorChangingIndex] = useState(-1);
  const [colorUpdating, setColorUpdating] = useState(false);
  const [settingColor, setColor] = useState('blueViolet');
  const [lutConverter, setLutConverter] = useState([]);
  const [table, setTable] = useState([]);
  const [header, setHeader] = useState([]);
  const [stepsGeneration, setStepsGeneration] = useState();
  const [goClicked, setGo] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hideNumbers, setHideNumbers] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const running = table.length > 0;

  const useStyles = makeStyles({
    table: {
      maxWidth: nr_cells * 50,
    },
  });

  const onCellClick = (idx) => {
    if (!running && !colorUpdating) {
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

  const generateTableToLatex = () => {
    //TODO finish it
    let tex = '  ';
    let cells = '{' + '|c'.repeat(nr_cells) + '|}\n';

    const begin =
      '\\RequirePackage{amsmath}\n\\documentclass[a4paper,11pt]{article}\n' +
      '\\usepackage[table]{xcolor}\n\\usepackage{color}\\usepackage{xstring}\n\\usepackage{graphicx}\n\n' +
      '\\begin{document}\n\n' +
      '\\newcommand{\\cC}[1]{%\n' +
      '    \\IfEqCase{#1}{%\n' +
      '      {0}{\\cellcolor[RGB]{255,255,255}{}}\n' +
      '      {1}{\\cellcolor[RGB]{221,221,221}{}}\n' +
      '      {2}{\\cellcolor[RGB]{170,170,170}{}}\n' +
      '      {3}{\\cellcolor[RGB]{119,119,119}{}}\n' +
      '      {4}{\\cellcolor[RGB]{85,85,85}{}}\n' +
      '      {5}{\\cellcolor[RGB]{51,51,51}{}}\n' +
      '      {6}{\\cellcolor[RGB]{27,27,27}{}}\n' +
      '      {7}{\\cellcolor[RGB]{0,0,0}{}}\n' +
      '   }\n' +
      '}\n\n' +
      '\\begin{table}[ht]\n' +
      '\\centering\n' +
      '\\def\\arraystretch{1}\n' +
      '\\scalebox{1}{\n' +
      '\\begin{tabular}' +
      cells;
    tex += begin;
    const firstLine = header.map((el) => `\\cC{${el}}`).join(' & ');
    tex += firstLine + '\\\\\n';
    tex += '\\hline\n';
    for (var i = 0; i < table.length; i++) {
      const line = table[i].map((el) => `\\cC{${el}}`).join(' & ');
      tex += '  ' + line + '\\\\\n';
      tex += '\\hline\n';
    }
    const end =
      '\\end{tabular}\n' +
      '}\n' +
      '\\caption{Caption of table}\n' +
      '   \\label{tab:my_label}\n' +
      '\\end{table}\n' +
      '\\end{document}\n';
    tex += end;
    const dataURI = 'data:text/plain;base64,' + encodeBase64(tex);
    saveAs(dataURI, 'lut6-to-latex.txt');
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

  const updateColor = (color, event) => {
    setColor(color.hex);
    setColorChanging(color.hex);
  };

  const handleClose = () => {
    setShowColorPicker(false);
    setColors((colors) =>
      colors.map((col, idx) => {
        if (idx === colorChangingIndex) {
          return colorChanging;
        }
        return col;
      }),
    );
  };

  return (
    <S.Container>
      <S.BorderContainer>
        <S.ButtonsContainer>
          {colors.map(
            (color, idx) =>
              idx < nr_states && (
                <S.ColorsContainer
                  border={
                    settingColor === color && !colorUpdating
                      ? '#000'
                      : 'rgba(224, 224, 224, 1)'
                  }
                  backgroundColor={color}
                  key={`color-${idx}`}
                  onClick={() => {
                    if (colorUpdating) {
                      setColorChanging(color);
                      setColorChangingIndex(idx);
                      setShowColorPicker((showColorPicker) => !showColorPicker);
                    } else {
                      changeColor(color);
                    }
                  }}
                >
                  {idx}
                </S.ColorsContainer>
              ),
          )}

          <S.ButtonContainer>
            <Button
              onClick={() =>
                setColorUpdating((colorUpdating) => !colorUpdating)
              }
              disabled={goClicked || showColorPicker}
              variant="contained"
              style={{ width: '156px' }}
            >
              {colorUpdating ? 'Save colors' : 'Update colors'}
            </Button>
          </S.ButtonContainer>
        </S.ButtonsContainer>
      </S.BorderContainer>
      {showColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={handleClose} />
          <PhotoshopPicker color={colorChanging} onChange={updateColor} />
        </div>
      ) : null}
      <S.BorderContainer>
        <S.ButtonsContainer>
          <S.ButtonContainer>
            <Button
              disabled={colorUpdating || goClicked}
              onClick={generateTableToLatex}
              variant="outlined"
            >
              Generate Latex
            </Button>
          </S.ButtonContainer>

          <S.ButtonContainer>
            <Button
              onClick={reset}
              disabled={colorUpdating || goClicked}
              variant="contained"
            >
              Reset
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              onClick={() => setHideNumbers((hideNumbers) => !hideNumbers)}
              disabled={colorUpdating || goClicked}
              variant="contained"
            >
              {hideNumbers ? 'Show Numbers' : 'Hide Numbers'}
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              onClick={randomHeader}
              disabled={colorUpdating || running}
              variant="contained"
            >
              Random Configuration
            </Button>
          </S.ButtonContainer>
        </S.ButtonsContainer>
      </S.BorderContainer>
      <S.BorderContainer>
        <S.ButtonsContainer>
          <S.ButtonContainer>
            <Button
              onClick={() => setTable([])}
              disabled={colorUpdating || !running || goClicked}
              variant="contained"
            >
              Clear
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              variant="contained"
              onClick={clickStop}
              disabled={colorUpdating || !goClicked}
            >
              Stop
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              onClick={oneStepGeneration}
              variant="contained"
              disabled={colorUpdating || goClicked}
            >
              One Step
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              variant="contained"
              onClick={clickGo}
              disabled={colorUpdating || goClicked}
            >
              Go
            </Button>
          </S.ButtonContainer>
          <S.ButtonContainer>
            <Button
              onClick={generateFirstTwenty}
              disabled={colorUpdating || table.length > 0}
              variant="contained"
            >
              Generate first 21
            </Button>
          </S.ButtonContainer>
        </S.ButtonsContainer>
      </S.BorderContainer>
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
