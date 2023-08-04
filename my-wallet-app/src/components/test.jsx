import React from "react";

export const Test = () => {
// Перевірка, чи MetaMask доступний у браузері
if (typeof window.ethereum !== 'undefined') {
    const ethereum = window.ethereum;
  
    // Отримання дозволу на доступ до гаманця
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        const account = accounts[0]; // Вибираємо перший гаманець
  
        // Отримання балансу в гаманці (у вигляді Wei)
        ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
          .then(weiBalance => {
            const etherBalance = parseFloat(weiBalance) / 10**18; // Перетворення з Wei в Ether
            console.log(`Баланс гаманця: ${etherBalance} ETH`);
          })
          .catch(error => {
            console.error('Помилка отримання балансу:', error);
          });
      })
      .catch(error => {
        console.error('Помилка отримання доступу до гаманця:', error);
      });
  } else {
    console.error('MetaMask не знайдений у браузері');
  }
};
