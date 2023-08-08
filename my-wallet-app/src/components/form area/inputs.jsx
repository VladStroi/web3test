import React from "react";
import Web3 from "web3";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

const web3 = new Web3(window.ethereum);

export const Inputs = () => {
  const [addres, setAddres] = useState(null);
  const [balance, setBalance] = useState(null);

  const [toAddres, setToAddres] = useState(null);
  const [send, setSend] = useState(null);

  const getAddresAndBalance = async () => {
    if (window.ethereum) {
      const accounts = await web3.eth.getAccounts();
      setAddres(accounts[0]);

      const balanceWei = await web3.eth.getBalance(addres);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balanceEth);

      console.log(addres, balance);
    }
  };

  const sendTokens = () => {
    const inputWallet = document.getElementById("wallet");
    const inputAmount = document.getElementById("amount");
    const recipient = inputWallet.value.trim();

    if (window.ethereum) {
      window.ethereum
        .enable()
        .then(() => {
          const fromAddress = addres;
          const toAddress = recipient;
          const amountEth = parseFloat(inputAmount.value);
          const amountWei = web3.utils.toWei(amountEth, "ether");

          const sendForm = {
            from: fromAddress,
            to: toAddress,
            value: amountWei,
          };
          web3.eth
            .sendTransaction(sendForm)
            .then((receipt) => {
              console.log("Transaction receipt:", receipt);
            })
            .catch((error) => {
              console.error("Error sending tokens:", error);
            });
        })
        .catch((error) => {
          console.error("Wallet activation error:", error);
        });
    } else {
      console.error("MetaMask not found in browser.");
    }
  };

  const validate = async () => {
    getAddresAndBalance();

    const inputWallet = document.getElementById("wallet");
    const inputAmount = document.getElementById("amount");

    const addres = inputWallet.value.trim();
    setToAddres(addres);
    setSend(parseFloat(inputAmount.value));

    const validAddres = /^(0x)?[0-9a-fA-F]{40}$/.test(toAddres);
    const validAmount = !isNaN(send) && send <= balance && send !== 0;
    console.log(balance);
    if (validAddres && validAmount) {
      sendTokens();
    } else {
      return false;
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
      <TextField id="wallet" label="Wallet" variant="outlined" />
      <TextField id="amount" label="Amount" variant="outlined" />

      <Button
        variant="outlined"
        color="inherit"
        sx={{ margin: "8px auto" }}
        onClick={validate}
      >
        Send
      </Button>
      <p id="validationWalletMessage"></p>
      <p id="validationBalanceMessage"></p>
    </Box>
  );
};
