import React, { useEffect, useLayoutEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../context";
import Web3 from "web3";
import style from "./style.module.css";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

// TODO: clear consoles and comments

const web3 = new Web3(window.ethereum);

export const Inputs = () => {
  const value = useContext(Context);

  // const [balance, setBalance] = useState("");

  const [toAddress, setToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorReceipt, setErrorReceipt] = useState(false);

  // Fetch address and balance using async/await
  const getAddresAndBalance = async () => {
    if (window.ethereum) {
      try {
        const balanceWei = await web3.eth.getBalance(value.address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        // setBalance(balanceEth);

        return { balance: balanceEth };
      } catch (error) {
        console.error("Error fetching address and balance:", error);
        setErrorReceipt("Error fetching address and balance");
      }
    }
  };

  const sendTokens = async () => {
    try {
      setIsSending(true);

      const amountWei = web3.utils.toWei(sendAmount, "ether");

      const gasLimit = await web3.eth.estimateGas({
        to: value.address,
      });

      const sendForm = {
        from: value.address,
        to: toAddress,
        value: amountWei,
        gas: web3.utils.fromWei(gasLimit, "wei"),
      };

      const receipt = await web3.eth.sendTransaction(sendForm);

      console.log("Transaction receipt:", receipt);
      setIsSending(false);
    } catch (error) {
      console.error("Error sending tokens:", error);
      setErrorReceipt("Error sending tokens, try later");
      setIsSending(false);
    }
  };

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValidationError("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [validationError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorReceipt("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorReceipt]);

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
      {validationError && <Alert severity="warning">{validationError}</Alert>}
      {errorReceipt && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorReceipt}
        </Alert>
      )}
    </>
  );
};
