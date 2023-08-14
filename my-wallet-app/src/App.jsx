import "./App.css";

import { useState } from "react";
import { Context } from "./context";

import { Header } from "./components/header";
import { Inputs } from "./components/inputs";
import { HistoryTransactions } from "./components/history-transactions";
import { GitLink } from "./components/git-link";

function App() {
  const [address, setAddress] = useState(null);

  return (
    <Context.Provider
      value={{
        address,
        setAddress,
      }}
    >
      <Header />
      <Inputs />
      <HistoryTransactions />
      <GitLink/>
    </Context.Provider>
  );
}

export default App;
