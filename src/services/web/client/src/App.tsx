import { useState } from "react";
import "./App.css";
import Title from "./components/Title";
import History from "./components/History";
import Interaction from "./components/Interaction";
import { useUserAndHistory } from "./hooks/useUserAndHistory";

function App() {
  const { info, setter } = useUserAndHistory()
  return (
    <div className="App">
      <Title />
      <History history={info.history} />
      <Interaction history={info.history} setHistory={setter.setHistory}/>
    </div>
  );
}

export default App;
