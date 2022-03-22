import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// function createData(account, token, limist, status) {
//   return { account, token, limist, status };
// }

export default class TokenTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = TokenTable.getStateFromProps(props);
  }

  static getStateFromProps(props) {
    let cols = [];
    if (props.tokens.length) {
      const firstToken = props.tokens[0];
      cols = Object.keys(firstToken);
    }
    return { cols, rows: props.tokens };
  }

  static getDerivedStateFromProps(props, state) {
    return TokenTable.getStateFromProps(props);
  }

  render() {
    console.log("render TokenTable", this.state);
    return (
      <TableContainer component={Paper} style={{ maxHeight: 550 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {this.state.cols.map((col) => (
                <TableCell>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.account}</TableCell>
                <TableCell align="left">{row.token}</TableCell>
                <TableCell align="left">{row.limit}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
