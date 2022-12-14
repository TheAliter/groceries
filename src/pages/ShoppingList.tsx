import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./styles/ShoppingList.module.css";

import { useShoppingListGuard } from "../hooks/useShoppingListGuard";
import { GlobalContext } from "../contexts/GlobalContext";
import AddProduct from "./AddProduct";
import Products from "../components/shoppingList/Products";
import Modal from "../components/Modal";
import ShoppingListMenu from "../components/shoppingList/ShoppingListMenu";
import ConfirmationModal from "../components/ConfirmationModal";
import ShoppingListCode from "../components/shoppingList/ShoppingListCode";
import { deleteShoppingList } from "../database/deleteShoppingList";
import { useShoppingListContext } from "../hooks/useShoppingListContext";
import { getShoppingListId } from "../database/getShoppingListId";
import { getProducts } from "../database/getProducts";
import Product from "../types/Product";
import Loader from "../components/Loader";

export default function ShoppingList() {
  const { accessKey } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const shopListContext = useShoppingListContext();
  const globalContext = useContext(GlobalContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showShopListCode, setShowShopListCode] = useState(false);
  const [showShopListDeleteConfirmation, setShowShopListDeleteConfirmation] =
    useState(false);

  function handleShowMenu(newState: boolean) {
    setShowMenu(newState);
  }

  function handleShowShopListCode() {
    setShowMenu(false);
    setShowShopListCode(true);
  }

  function handleShowShopListDeleteConfirmation() {
    setShowMenu(false);
    setShowShopListDeleteConfirmation(true);
  }

  function handleShoppingListDelete() {
    deleteShoppingList(accessKey ?? "");
    navigate("/");
  }

  // TODO export this to hook???
  useEffect(() => {
    shopListContext?.setAccessKey(accessKey);
    getShoppingListId(accessKey ?? "")
      .then((id) => {
        shopListContext?.setID(id);
        getProducts(id).then((products) => {
          shopListContext?.setProducts(
            products.map(
              (product) =>
                new Product(
                  product.id,
                  product.name,
                  product.amount,
                  product.units,
                  id
                )
            )
          );
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  // Redirect if shopping list id is invalid (only if navigating from url input field)
  // TODO: after creat product is build clean if statement and check if this would trigger multiple times or not
  if (globalContext?.useShoppingListGuard) {
    // TODO: check if this is working
    // useShoppingListGuard(shoppingListId ?? "0");
    // TODO: this breaks app in this setting - why?
    // globalContext.updateUseShoppingListGuard(false);
  }

  // TODO: create products
  // TODO: load shopping list
  // TODO: delete products
  // TODO: update products
  return (
    <div className={styles.container}>
      <header>
        <h1>Iepirkuma saraksts</h1>
        <div
          onClick={() => handleShowMenu(true)}
          className={styles["menu-icon"]}
        >
          <span className="material-icons">menu</span>
        </div>
      </header>
      {isLoading ? <Loader /> : <Outlet />}

      {/* MODALS for MENU options/actions */}
      {showMenu && (
        <Modal handleBackgroundClick={() => handleShowMenu(false)}>
          <ShoppingListMenu
            handleShowShopListCode={handleShowShopListCode}
            handleDeleteShopList={handleShowShopListDeleteConfirmation}
            handleClose={() => setShowMenu(false)}
          ></ShoppingListMenu>
        </Modal>
      )}
      {showShopListCode && (
        <Modal handleBackgroundClick={() => setShowShopListCode(false)}>
          <ShoppingListCode
            id={accessKey ?? ""}
            handleClose={() => setShowShopListCode(false)}
          ></ShoppingListCode>
        </Modal>
      )}
      {showShopListDeleteConfirmation && (
        <ConfirmationModal
          text="Vai tiešām vēlies izdzēst sarakstu?"
          handleBgClick={() => setShowShopListDeleteConfirmation(false)}
          handleCancel={() => setShowShopListDeleteConfirmation(false)}
          handleConfirmation={handleShoppingListDelete}
        ></ConfirmationModal>
      )}
    </div>
  );
}
