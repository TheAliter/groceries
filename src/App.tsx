import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./assets/styles/App.css";

import Welcome from "./pages/Welcome";
import ShoppingList from "./pages/ShoppingList";

// TODO: handle manual navigation to wrong shopping list 

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/shopping-list/:id" element={<ShoppingList />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
