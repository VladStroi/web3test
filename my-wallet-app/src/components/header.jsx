import React from "react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context";

import Web3 from "web3";

import style from "./style.module.css";
import { LogoHeader } from "./logo";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const web3 = new Web3(window.ethereum);

export const Header = () => {
  const value = useContext(Context);

  const [balance, setBalance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [checkWallet, setCheckWallet] = useState(false);

  // connecting the wallet from the browser using a button
  const addMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        value.setAddress(accounts[0]);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("Please install MetaMask");
      window.innerWidth <= 1280
        ? setCheckWallet("The site does not support phones and tablets")
        : setCheckWallet("Please install MetaMask");
    }
  };

  // if the wallet is connected to the site, add it automatically
  useEffect(() => {
    getConnectedWallet();
  }, []);

  const getConnectedWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          value.setAddress(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(parseFloat(balanceEth).toFixed(4).slice(0, -1));
        } else {
          console.log("Connect to MetaMask using the Connect button");
          setCheckWallet("Connect to MetaMask using the [Connect button]");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("Please install MetaMask");
      window.innerWidth <= 1280
        ? setCheckWallet("The site does not support phones and tablets")
        : setCheckWallet("Please install MetaMask");
    }
  };

// Manage notifications
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCheckWallet(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [checkWallet]);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [value.address]);


  return (
    <header className={style.header}>
      <LogoHeader />
      <Box>
        <Button onClick={addMetaMask} variant="outlined" color="inherit">
          {value.address
            ? `Address: ${value.address.substring(
                0,
                4
              )}...${value.address.substring(38)}`
            : "Connect Wallet"}
        </Button>
        {value.address && <div>Balance: {balance} ETH</div>}
        {isVisible && value.address && (
          <Alert severity="success">the wallet is connected</Alert>
        )}
        {checkWallet && <Alert severity="warning">{checkWallet}</Alert>}
      </Box>
    </header>
  );
};
