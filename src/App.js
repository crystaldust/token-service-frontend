import React from "react";
import { createRef } from "react";
import AccountInput from "./components/AccountInput";
import TokenInput from "./components/TokenInput";
import { Button, Grid } from "@mui/material";
import { Stack } from "@mui/material";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      accounts: [],
    };
    this.submitTokens = this.submitTokens.bind(this);
    this.tokenInputComponent = createRef();
  }

  componentDidMount() {
    // TODO Replace with relative path
    fetch("http://192.168.8.20:8000/tokens/list")
      .then((res) => res.json())
      .then((tokenList) => {
        this.setState({ data: tokenList });
        let accounts = new Set();
        tokenList.forEach((token) => {
          accounts.add(token.account);
        });
        this.setState({ accounts: Array.from(accounts) });
      });
  }

  submitTokens() {
    const tokens = this.tokenInputComponent.current.state.tokens;
    let payload = [];
    tokens.forEach((token) => {
      payload.push({
        account: "juzhen",
        token,
        limit: 5000,
        status: "available",
      });
    });
    fetch("http://192.168.8.20:8000/tokens/upload", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status >= 300) {
          // TODO Add Alter to show the error info
          console.log("Failed", res.text());
        }
        console.log(res);
        return res.text();
      })
      .then((resText) => {
        console.log(resText);
      });
  }

  render() {
    return (
      <Stack spacing={2}>
        <h1>Token management</h1>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Grid item xs={12}>
                <AccountInput accounts={this.state.accounts} />
              </Grid>
              <Grid item xs={12}>
                <TokenInput ref={this.tokenInputComponent} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={this.submitTokens}>
                  Submit
                </Button>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Stack>
    );
  }
}

export default App;
