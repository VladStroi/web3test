import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const Inputs = () => {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="wallet" label="Wallet" variant="outlined" />
      <TextField id="Amount" label="Amount" variant="outlined" />

      <Button
        variant="outlined"
        color="inherit"
        sx={{ margin: "8px auto" }}
      >
        Send
      </Button>
    </Box>
  );
};
