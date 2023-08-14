import React from "react";
import { useState, useContext } from "react";
import { Context } from "../context";

import { HistoryAccordion } from "./history";
import Button from "@mui/material/Button";

const transactions = JSON.parse(localStorage.getItem("transactionHistory"));

export const HistoryTransactions = () => {
  const value = useContext(Context);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
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
      {showHistory &&
        transactions.map((transaction) => <HistoryAccordion key={transaction.date} transaction={transaction} />)}
    </>
  );
};
