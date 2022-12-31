import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/App.css";
import { Loader } from "./components/_components";

const Welcome = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.Welcome }))
);
const JoinForm = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.JoinForm }))
);
const ShoppingListContainer = lazy(() =>
  import("./pages/_pages").then((module) => ({
    default: module.ShoppingListContainer,
  }))
);
const Products = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.Products }))
);
const AddProduct = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.AddProduct }))
);
const EditProduct = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.EditProduct }))
);
const Samples = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.Samples }))
);
const AddSample = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.AddSample }))
);
const EditSample = lazy(() =>
  import("./pages/_pages").then((module) => ({ default: module.EditSample }))
);

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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/join-shopping-list" element={<JoinForm />}></Route>
            {shoppingListRoutes}
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
