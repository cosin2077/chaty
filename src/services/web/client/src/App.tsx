import { useState } from "react";
import "./App.css";
import Title from "./components/Title";
import History from "./components/History";
import Interaction from "./components/Interaction";

function App() {
  const [history, setHistory] = useState<any[]>([]);
  return (
    <div className="App">
      <Title />
      <History history={history} />
      <Interaction history={history} setHistory={setHistory}/>
    </div>
  );
}

export default App;
