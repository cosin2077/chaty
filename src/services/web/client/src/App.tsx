import { useState } from "react";
import "./App.css";
import Title from "./components/Title";
import History from "./components/History";
import Interaction from "./components/Interaction";

let onlyUser = Math.random().toString(16)
function App() {
  const [history, setHistory] = useState<any[]>([]);
  return (
    <div className="App">
      <Title />
      <History history={history} />
      <Interaction onlyUser={onlyUser} history={history} setHistory={setHistory}/>
    </div>
  );
}

export default App;
