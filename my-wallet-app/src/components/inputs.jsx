import React, { useEffect, useLayoutEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../context";
import Web3 from "web3";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const web3 = new Web3(window.ethereum);

export const Inputs = () => {

  const value = useContext(Context)

  const [balance, setBalance] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSending, setIsSending] = useState(false);


   // Fetch address and balance using async/await
   const getAddresAndBalance = async () => {
    if (window.ethereum) {
      try {
        const balanceWei = await web3.eth.getBalance(value.address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEth);

        return {balance: balanceEth}
      } catch (error) {
        console.error("Error fetching address and balance:", error);
      }
    }
  };

  const sendTokens = async () => {
    try {
      setIsSending(true);

      const amountWei = web3.utils.toWei(sendAmount, 'ether');
      
      // const gasLimit = await web3.eth.estimateGas({
        //   to: address,
        // });
        
        const sendForm = {
          from: value.address,
          to: toAddress,
          value: amountWei,
          gas: 50000,
        };
       
      const receipt = await web3.eth.sendTransaction(sendForm);

      console.log("Transaction receipt:", receipt);
      setIsSending(false);
    } catch (error) {
      console.error("Error sending tokens:", error);
      setIsSending(false);
    }
  };

  const validateAndSend = async () => {
    try {
      const {balance} = await getAddresAndBalance();

      console.log(balance);

      const validAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(toAddress);
      const validAmount =
        !isNaN(sendAmount) && parseFloat(sendAmount) <= parseFloat(balance) && parseFloat(sendAmount) !== 0;

      if (validAddress && validAmount) {
        await sendTokens();
      } else {
        setValidationError("Invalid address or amount.");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

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
      <TextField
        label="Wallet"
        variant="outlined"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <TextField
        label="Amount"
        variant="outlined"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
      />

      <Button
        variant="outlined"
        color="inherit"
        sx={{ margin: "8px auto" }}
        onClick={validateAndSend}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </Button>
      
      {validationError && <p>{validationError}</p>}
      <p id="validationWalletMessage"></p>
      <p id="validationBalanceMessage"></p>
    </Box>
  );
};