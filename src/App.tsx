import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalProvider } from "./contexts/GlobalContext";

import "./assets/styles/App.css";

import Welcome from "./pages/Welcome";
import ShoppingList from "./pages/ShoppingList";
import JoinForm from "./pages/JoinForm";
import { ShoppingListProvider } from "./contexts/ShoppingListContext";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Samples from "./pages/Samples";
import AddSample from "./pages/AddSample";
import EditSample from "./pages/EditSample";

function App() {
  return (
    <div className="App">
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/join-shopping-list" element={<JoinForm />}></Route>
            <Route
              path="/shopping-list/:accessKey/*"
              element={
                <ShoppingListProvider>
                  <ShoppingList />
                </ShoppingListProvider>
              }
            >
              <Route path="" element={<Products />}></Route>
              <Route path="add-product" element={<AddProduct />}></Route>
              <Route path="edit-product/:uid" element={<EditProduct />}></Route>
              <Route path="samples" element={<Samples />}></Route>
              <Route path="add-sample" element={<AddSample />}></Route>
              <Route path="edit-sample/:uid" element={<EditSample />}></Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </div>
  );
}

export default App;
