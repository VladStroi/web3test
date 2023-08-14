import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

export const GitLink = () => {
  return (
    <Box
      sx={{
        typography: "body1",
        "& > :not(style) ~ :not(style)": {
          ml: 2,
        },
      }}
    >
      <Link href="https://github.com/VladStroi/web3test" target="_blank">Vladyslav Stroi github</Link>
    </Box>
  );
};
