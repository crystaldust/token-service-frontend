import React from "react";
import { createRef } from "react";
import AccountInput from "./components/AccountInput";
import TokenInput from "./components/TokenInput";
import TokenTable from "./components/TokenTable";
import { Alert, Box, Button, Collapse, Grid, IconButton } from "@mui/material";
import { Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { saveAs } from "file-saver";

const TOKEN_REG = /ghp_[0-9A-Za-z]{36}/;

let URL_BASE = "";
if (process.env.NODE_ENV === "development") {
  URL_BASE = process.env.REACT_APP_DEBUG_URL_BASE;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      accounts: [],
      alertOpen: false,
      alertText: "",
      alertSeverity: "info",
      alertVariant: "outlined",
      loading: true,
      loadingText: "Loading Tokens",
    };
    this.submitTokens = this.submitTokens.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.exportTokens = this.exportTokens.bind(this);
    this.tokenInputComponent = createRef();
    this.accountInputComponent = React.createRef();
  }

  setAlert(alertOpen, alertText, alertSeverity, alertVariant) {
    this.setState({
      alertOpen,
      alertText,
      alertSeverity,
      alertVariant,
    });
  }

  componentDidMount() {
    // TODO Replace with relative path
    fetch(`${URL_BASE}/tokens/list`)
      .then((res) => res.json())
      .then((tokenList) => {
        let accounts = new Set();
        tokenList.forEach((token) => {
          accounts.add(token.account);
        });
        this.setState({
          accounts: Array.from(accounts),
          data: tokenList,
          loading: false,
        });
      });
  }

  exportTokens() {
    let tokens = [];
    this.state.data.forEach((item) => {
      if (item.status === "available") {
        tokens.push(item.token);
      }
    });
    let tokensBlob = new Blob([JSON.stringify(tokens, null, 4)], {
      type: "text/json;charset=utf-8",
    });
    saveAs(tokensBlob, "tokens.json");
  }

  submitTokens() {
    const tokens = this.tokenInputComponent.current.state.tokens;
    let payload = [];
    if (!this.accountInputComponent.current.state.value) {
      this.setAlert(true, "account is empty", "error", "filled");
      return;
    }
    if (tokens.length === 0) {
      this.setAlert(true, "tokens is empty", "error", "filled");
      return;
    }

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (!TOKEN_REG.exec(token)) {
        this.setAlert(true, `Invalid token: ${token}`, "error", "filled");
        return;
      }
    }
    tokens.forEach((token) => {
      payload.push({
        account: this.accountInputComponent.current.state.value.trim(),
        token,
        limit: 5000,
        status: "available",
      });
    });
    this.setState({ loading: true, loadingText: "Uploading Tokens" });
    fetch(`${URL_BASE}/tokens/upload`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((resJson) => {
        let alertText = `${resJson.num_inserted} tokens inserted`;
        let alertVariant = "outlined";
        let alertSeverity = "info";
        if (resJson.duplicated.length > 0) {
          alertText += "\n" + resJson.duplicated.join(",") + " duplicated";
          alertVariant = "filled";
          alertSeverity = "error";
        }
        this.setAlert(true, alertText, alertSeverity, alertVariant);
        this.setState({ loading: false });

        const account = this.accountInputComponent.current.state.value.trim();
        if (resJson.num_inserted) {
          let _tokens = this.state.data.concat();
          resJson.inserted.forEach((token) => {
            _tokens.push({
              token,
              account,
              limit: 5000,
              status: "available",
            });
          });

          let _accounts = new Set(this.state.accounts);
          _accounts.add(account);
          this.setState({ accounts: Array.from(_accounts), data: _tokens });
        }
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
                <AccountInput
                  ref={this.accountInputComponent}
                  accounts={this.state.accounts}
                />
              </Grid>
              <Grid item xs={12}>
                <TokenInput ref={this.tokenInputComponent} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={this.submitTokens}>
                  Submit
                </Button>
                <Box sx={{ width: "100%" }}>
                  <Collapse in={this.state.alertOpen}>
                    <Alert
                      variant={this.state.alertVariant}
                      severity={this.state.alertSeverity}
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            this.setState({ alertOpen: false });
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    >
                      {this.state.alertText}
                    </Alert>
                  </Collapse>
                </Box>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={5}>
            <TokenTable tokens={this.state.data} />
            <LoadingButton
              size="small"
              color="secondary"
              onClick={this.exportTokens}
              loading={this.state.loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              {this.state.loading
                ? this.state.loadingText
                : "Export Valid Tokens"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Stack>
    );
  }
}

export default App;
