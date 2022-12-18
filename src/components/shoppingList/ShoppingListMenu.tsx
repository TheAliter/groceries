import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbDeleteShoppingList } from "../../database/deleteShoppingList";
import { useScreenSizeType } from "../../hooks/useScreenSizeType";
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
  const screenType = useScreenSizeType();

  function handleShowShopListCode(newState: boolean) {
    setShowShopListCode(newState);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shopListContext!.accessKey);
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
    localStorage.setItem("access_key", "");
    if (confirmationModalTitle.includes("izdzēst")) {
      dbDeleteShoppingList(shopListContext!.id);
    }
    navigate("/");
  }

  const menuBlock = (
    <div className={styles["menu-container"]}>
      <button onClick={() => handleShowShopListCode(true)}>
        Parādīt saraksta kodu
      </button>
      <button onClick={handleLeave}>Iziet no saraksta</button>
      <button onClick={handleShowDeleteConfirmation} className="accent">
        Izdzēst sarakstu
      </button>
      <button onClick={handleCloseMenu} className={styles["close-menu"]}>
        Aizvērt
      </button>
    </div>
  );

  return (
    <>
      {screenType === "Desktop" ? (
        menuBlock
      ) : !showShopListCode && !showDeleteOrLeaveConfirmation ? (
        <Modal handleBackgroundClick={handleCloseMenu}>{menuBlock}</Modal>
      ) : null}

      {showShopListCode && (
        <Modal handleBackgroundClick={() => handleShowShopListCode(false)}>
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
              <button
                onClick={() => handleShowShopListCode(false)}
                className="accent"
              >
                Aizvērt
              </button>
              <button onClick={handleCopy}>Nokopēt</button>
            </div>
          </div>
        </Modal>
      )}

      {showDeleteOrLeaveConfirmation && (
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
