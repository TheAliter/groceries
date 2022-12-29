import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/App.css";
import {
  AddProduct,
  AddSample,
  EditProduct,
  EditSample,
  JoinForm,
  Products,
  Samples,
  ShoppingListContainer,
  Welcome,
} from "./pages/_pages";

function App() {
  const shoppingListRoutes = (
    <Route
      path="/shopping-list/:accessKey/*"
      element={<ShoppingListContainer />}
    >
      <Route path="" element={<Products />}></Route>
      <Route path="add-product" element={<AddProduct />}></Route>
      <Route path="edit-product/:uid" element={<EditProduct />}></Route>
      <Route path="samples" element={<Samples />}></Route>
      <Route path="add-sample" element={<AddSample />}></Route>
      <Route path="edit-sample/:uid" element={<EditSample />}></Route>
    </Route>
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/join-shopping-list" element={<JoinForm />}></Route>
          {shoppingListRoutes}
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
