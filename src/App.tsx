import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./assets/styles/App.css";

import Welcome from "./pages/Welcome";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
