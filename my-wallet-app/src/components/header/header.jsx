import React from "react";

import { useState, useEffect } from "react";

import style from "./style.module.css";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { cyan } from "@mui/material/colors";

const color = cyan[500];

export const Header = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [balance, setBalance] = useState(0);

  // alert about the wallet connected
  useEffect(() => {
    setIsVisible(true);

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [walletAddress]);

  // connecting the wallet from the browser
  const addMetaMask = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        getBalance()
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("Please install MetaMask");
    }
  };

  // get a connected wallet

  useEffect(() => {
    getConnectedWallet();
   
  });

  const getConnectedWallet = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("Please install MetaMask");
    }
      getBalance()
  };

  
  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      
       await window.ethereum
        .request({
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        })
        .then((weiBalance) => {
          const etherBalance = parseFloat(weiBalance) / 10 ** 18; 
          console.log(`Баланс гаманця: ${etherBalance} ETH`);
          setBalance(etherBalance.toFixed(3))
        })
        .catch((error) => {
          console.error("Помилка отримання балансу:", error);
        });
    }
  };


  return (
    <header className={style.header}>
      <div>
        <a href="https://dexola.com/">
          <img
            width="50"
            height="50"
            src="https://media.licdn.com/dms/image/D4D0BAQH2PiQtMDW1ug/company-logo_200_200/0/1685445231070?e=2147483647&v=beta&t=WJ-betqzKYTuOOs_V4J8h57LFLeCCM6U6U7XnVoCvbw"
            class="custom-logo"
            alt="Dexola"
            decoding="async"
          />
        </a>
      </div>
      <div>
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
      </div>
    </header>
  );
};
