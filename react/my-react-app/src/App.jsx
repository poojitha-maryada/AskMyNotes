import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Welcome to React");

  return (
    <div className="container">
      <h1>Language Switcher</h1>

      <button onClick={() => setMessage("Welcome to React")}>
        English
      </button>

      <button onClick={() => setMessage("రియాక్ట్‌కు స్వాగతం")}>
        Telugu
      </button>

      <h2>{message}</h2>
    </div>
  );
}

export default App;