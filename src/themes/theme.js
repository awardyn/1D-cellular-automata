import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
export default createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: '0px 5px 5px #00000033',
        border: '1px solid rgba(0,0,0, 0.08)',
        overflow: 'hidden',
      },
      elevation1: {
        boxShadow: '0px 5px 5px #00000033',
      },
    },
    MuiTable: {
      root: {
        width: 'auto',
      },
    },
    MuiTableCell: {
      root: {
        userSelect: 'none',
        textAlign: 'center',
        width: '50px',
        height: '37px',
        borderBottom: '0px',
        border: '1px solid rgba(224, 224, 224, 1)',
        margin: '0',
      },
      sizeSmall: {
        padding: '6px 16px 6px 16px',
      },
    },
  },
});
