import React from "react";
import Web3 from "web3";

import { useState, useEffect } from "react";

import style from "./style.module.css";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { LogoHeader } from "./logo";
import { Box } from "@mui/material";

const web3 = new Web3(window.ethereum);

export const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  // alert about the wallet connected
  useEffect(() => {
    setIsVisible(true);

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [walletAddress]);

  // connecting the wallet from the browser using a button
  const addMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        // getBalanceAddres()
        console.log(walletAddress, balance);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("Please install MetaMask");
    }
  };

  // if the wallet is connected to the site, add it automatically
  useEffect(() => {
    getConnectedWallet();
  });

  const getConnectedWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
           setWalletAddress(accounts[0]);
          const balanceWei = await web3.eth.getBalance(walletAddress);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(parseFloat(balanceEth).toFixed(4).slice(0, -1));
          // getBalanceAddres()
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("Please install MetaMask");
    }
  };

  // get the balance of the connected wallet
  // const getBalanceAddres = async () => {
  //   const balanceWei = await web3.eth.getBalance(walletAddress);
  //   const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
  //   setBalance(parseFloat(balanceEth).toFixed(4).slice(0, -1));
  // }

  return (
    <header className={style.header}>
      <LogoHeader />
      <Box>
        <Button onClick={addMetaMask} variant="outlined" color="inherit">
          {walletAddress
            ? `Address: ${walletAddress.substring(
                0,
                4
              )}...${walletAddress.substring(38)}`
            : "Connect Wallet"}
        </Button>
        {walletAddress && <div>Balance: {balance} ETH</div>}
        {isVisible && walletAddress && (
          <Alert severity="success">the wallet is connected</Alert>
        )}
      </Box>
    </header>
  );
};
