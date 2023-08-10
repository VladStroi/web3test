import "./App.css";

import { useState } from "react";
import { Context } from "./context";

import { Header } from "./components/header";
import { Inputs } from "./components/inputs";

function App() {
  
  const [address, setAddress] = useState(null);

  return (
    <Context.Provider
      value={{
        address, setAddress
      }}
    >
      <>
        <Header />
        <Inputs />
        {/* <button>
      <a href="https://github.com/VladStroi/web3test">https://github.com/VladStroi/web3test</a>
    </button> */}
      </>
    </Context.Provider>
  );
}

export default App;
