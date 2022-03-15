import React from "react";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import { TextareaAutosize } from "@mui/material";

class TokenInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tokens: [],
    };

    this.onTokenInputChange = this.onTokenInputChange.bind(this);
  }

  onTokenInputChange(event) {
    let texts = event.target.value;
    try {
      let jsonObject = JSON.parse(texts);
      console.log("jsonObject:", jsonObject);
    } catch (e) {
      let lines = texts.split("\n");
      let processedLines = [];
      lines.forEach((line) => {
        const processed = line
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll("'", "")
          .replaceAll(",", "")
          .trim();
        if (processed) {
          processedLines.push(processed);
        }
      });
      this.setState({ tokens: processedLines });
    }
  }
  render() {
    return (
      <Stack>
        <TextField
          multiline
          placeholder="Token(s)"
          label="Token(s)"
          rows={10}
          onChange={this.onTokenInputChange}
        />
        <TextareaAutosize
          disabled
          placeholder="Tokens to commit"
          label="Tokens to commit"
          rows={10}
          maxRows={10}
          value={this.state.tokens.join("\n")}
        />
      </Stack>
    );
  }
}

export default TokenInput;
