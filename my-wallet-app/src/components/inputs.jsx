import React from "react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context";

import Web3 from "web3";

import style from "./style.module.css";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

// TODO:
// add add gas limit?  if so yes, so why, and how much?

const web3 = new Web3(window.ethereum);

export const Inputs = () => {
  const value = useContext(Context);

  const [toAddress, setToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [receiptError, setReceiptError] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);

  // Fetch address and balance using async/await
  const getAddresAndBalance = async () => {
    if (window.ethereum) {
      try {
        const balanceWei = await web3.eth.getBalance(value.address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        return { balance: balanceEth };
      } catch (error) {
        console.error("Error fetching address and balance:", error);
        setReceiptError("Error fetching address and balance");
      }
    }
  };

  // Sending tokens
  const sendTokens = async () => {
    try {
      setIsSending(true);

      const amountWei = web3.utils.toWei(sendAmount, "ether");

      const gasPrice = await web3.eth.getGasPrice();

      const sendForm = {
        from: value.address,
        to: toAddress,
        value: amountWei,
        gas: web3.utils.fromWei(gasPrice, "wei"),
      };

      const receipt = await web3.eth.sendTransaction(sendForm);

      console.log("Transaction receipt:", receipt);
      setReceiptSuccess("Transaction successful");
      setIsSending(false);
    } catch (error) {
      console.error("Error sending tokens:", error);
      setReceiptError("Error sending tokens, try later");
      setIsSending(false);
    }
  };

  // Data validation from input fields
  const validateAndSend = async () => {
    try {
      const { balance } = await getAddresAndBalance();

      const validAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(toAddress);
      const validAmount =
        !isNaN(sendAmount) &&
        parseFloat(sendAmount) <= parseFloat(balance) &&
        parseFloat(sendAmount) !== 0;

      if (validAddress && validAmount) {
        await sendTokens();
      } else {
        setValidationError("Invalid address or amount.");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  // Manage notifications
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValidationError("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [validationError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReceiptError("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [receiptError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReceiptSuccess("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [receiptSuccess]);

  return (
    <>
      {value.address && (
        <Box
          className={style.inputs}
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Wallet"
            variant="outlined"
            value={toAddress}
            onKeyDown={(e) => e.key === "Enter" && validateAndSend()}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            value={sendAmount}
            onKeyDown={(e) => e.key === "Enter" && validateAndSend()}
            onChange={(e) => setSendAmount(e.target.value)}
          />

          {isSending ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "flex" }}>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ margin: "8px auto" }}
                onClick={validateAndSend}
                disabled={isSending}
              >
                Sand
              </Button>
            </Box>
          )}
        </Box>
      )}
      {!value.address && (
        <Box
          className={style.inputs}
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <Skeleton variant="rounded" width={"30vw"} height={50} />
          <Skeleton variant="rounded" width={"30vw"} height={50} />
          <Skeleton variant="rounded" width={"10vw"} height={50} />
        </Box>
      )}

      {/* Information alert  */}

      {receiptSuccess && (
        <Alert severity="success" sx={{ width: "100%" }}>
          {receiptSuccess}
        </Alert>
      )}
      {validationError && (
        <Alert severity="warning" sx={{ width: "100%" }}>
          {validationError}
        </Alert>
      )}
      {receiptError && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {receiptError}
        </Alert>
      )}
    </>
  );
};
