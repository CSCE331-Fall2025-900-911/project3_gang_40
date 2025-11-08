import { useState } from 'react'
import './App.css'
import CashierView from "./views/CashierView";
import MenuBoard from "./views/MenuBoard.jsx";

function App() {
  const [view, setView] = useState("menu");

  return (
    <div style={{ paddingBottom: "60px" }}>
      {view === "menu" && <MenuBoard />}
      {view === "cashier" && <CashierView />}
      <div className="bottom-nav">
        <button onClick={() => setView("menu")}>Menu Board</button>
        <button onClick={() => setView("cashier")}>Cashier View</button>
      </div>
    </div>
  )
}

export default App
