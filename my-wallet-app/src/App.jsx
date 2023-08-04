import "./App.css";
import { Header } from "./components/header/header";

import { Inputs } from "./components/header/form area/inputs";
import { Test } from "./components/test";

const tokens = [
  { label: "BITCOIN" },
  { label: "ETHEREUM " },
  { label: "USDT" },
];

function App() {
  return (
    <>
      <Header />
      <Inputs />
    </>
  );
}

export default App;
