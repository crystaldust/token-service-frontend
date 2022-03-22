import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

class AccountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(event, newValue) {
    this.setState({ value: newValue });
    // console.log("value change", newValue);
    // if (typeof newValue === "string") {
    //   this.setState({ value: { title: newValue } });
    // } else if (newValue && newValue.inputValue) {
    //   // Create a new value from the user input
    //   this.setState({ value: { title: newValue.inputValue } });
    // } else {
    //   this.setState({ value: newValue });
    // }
  }

  filterOptions(options, params) {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== "" && !isExisting) {
      filtered.push(`${inputValue}`);
      // filtered.push({
      //   inputValue,
      //   title: `Add "${inputValue}"`,
      // });
    }

    return filtered;
  }

  render() {
    return (
      <Autocomplete
        options={this.props.accounts}
        value={this.state.value}
        onChange={this.onValueChange}
        filterOptions={this.filterOptions}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Accounts" />}
        renderOption={(props, option) => (
          <li {...props}>
            {typeof option === "string" ? option : option.inputValue}
          </li>
        )}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
      />
    );
  }
}

export default AccountInput;
