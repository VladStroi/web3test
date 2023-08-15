import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { Context } from "../context";

import { HistoryAccordion } from "./history";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const [...transactions] = JSON.parse(localStorage.getItem("transactionHistory")) || [];

export const HistoryTransactions = () => {

  const value = useContext(Context);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {value.address && (
        <Button
          onClick={() => {
            !showHistory ? setShowHistory(true) : setShowHistory(false);
          }}
          sx={{ margin: "5vh 0" }}
          variant="outlined"
          color="inherit"
        >
          {!showHistory ? "Show history" : "Hide history"}
        </Button>
      )}
      {showHistory && transactions.length > 0 &&
        transactions.map((transaction) => (
          <HistoryAccordion key={transaction.date} transaction={transaction} />
        ))}
        {showHistory && transactions.length === 0 && "No transaction history found. Make the first transaction and reload the page."}
      {value.address && showHistory && transactions.length > 0 && (
        <Button
          onClick={() => {
            localStorage.removeItem("transactionHistory");
          }}
          sx={{ margin: "5vh 0" }}
          variant="outlined"
          color="inherit"
        >
          Clear transaction history
        </Button>
      )}
    </Box>
  );
};
