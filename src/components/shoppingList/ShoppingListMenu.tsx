import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbDeleteShoppingList } from "../../database/deleteShoppingList";
import { useShoppingListContext } from "../../hooks/useShoppingListContext";
import ConfirmationModal from "../ConfirmationModal";
import Modal from "../Modal";
import styles from "./styles/ShoppingListMenu.module.css";

interface Props {
  handleCloseMenu: () => void;
}

export default function ShoppingListMenu({ handleCloseMenu }: Props) {
  const [showShopListCode, setShowShopListCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showDeleteOrLeaveConfirmation, setShowDeleteOrLeaveConfirmation] =
    useState(false);
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const shopListContext = useShoppingListContext();
  const navigate = useNavigate();

  function handleShowShopListCode() {
    setShowShopListCode(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shopListContext!.id.toString());
    setCodeCopied(true);
  }

  function handleLeave() {
    setConfirmationModalTitle("Vai tiešām vēlies iziet no saraksta?");
    setShowDeleteOrLeaveConfirmation(true);
  }

  function handleShowDeleteConfirmation() {
    setConfirmationModalTitle("Vai tiešām vēlies izdzēst sarakstu?");
    setShowDeleteOrLeaveConfirmation(true);
  }

  function handleExitShopList() {
    shopListContext?.shoppingListListener?.unsubscribe;
    shopListContext?.resetData();
    if (confirmationModalTitle.includes("izdzēst")) {
      dbDeleteShoppingList(shopListContext!.id);
    }
    navigate("/");
  }

  return (
    <>
      {!showDeleteOrLeaveConfirmation ? (
        <Modal handleBackgroundClick={handleCloseMenu}>
          {!showShopListCode ? (
            <div className={styles["menu-container"]}>
              <button onClick={handleShowShopListCode}>
                Parādīt saraksta kodu
              </button>
              <button onClick={handleLeave}>Iziet no saraksta</button>
              <button onClick={handleShowDeleteConfirmation} className="accent">
                Izdzēst sarakstu
              </button>
              <button onClick={handleCloseMenu}>Aizvērt</button>
            </div>
          ) : (
            <div className={styles["code-container"]}>
              <p>Iepirkuma saraksta kods:</p>
              <div className={styles["input-container"]}>
                <input
                  type="text"
                  readOnly
                  value={shopListContext?.accessKey}
                ></input>
                {codeCopied && <span className="material-icons">check</span>}
              </div>
              <div className={styles.actions}>
                <button onClick={handleCloseMenu} className="accent">
                  Aizvērt
                </button>
                <button onClick={handleCopy}>Nokopēt</button>
              </div>
            </div>
          )}
        </Modal>
      ) : (
        <ConfirmationModal
          text={confirmationModalTitle}
          handleBgClick={() => setShowDeleteOrLeaveConfirmation(false)}
          handleCancel={() => setShowDeleteOrLeaveConfirmation(false)}
          handleConfirmation={handleExitShopList}
        ></ConfirmationModal>
      )}
    </>
  );
}
