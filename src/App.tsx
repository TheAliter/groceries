import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalProvider } from "./contexts/GlobalContext";

import "./assets/styles/App.css";

import Welcome from "./pages/Welcome";
import ShoppingList from "./pages/ShoppingList";
import JoinForm from "./pages/JoinForm";
import { ShoppingListProvider } from "./contexts/ShoppingListContext";
import Products from "./components/shoppingList/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

function App() {

  // TODO drag and drop/reorder - how to handle order keeping between sessions?
  // TODO: create Sagataves
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
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </div>
  );
}

export default App;
