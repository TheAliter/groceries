import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbDeleteShoppingList } from "../../database/_database";
import { ScreenType, useScreenSizeType } from "../../hooks/_hooks";
import {
  useProductsStore,
  useSampleStore,
  useShoppingListStore,
} from "../../store/_store";
import {
  ConfirmationModal,
  ConfirmationModalType,
  Modal,
} from "../_components";
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
  const [confirmationModalType, setConfirmationModalType] =
    useState<ConfirmationModalType>();
  const navigate = useNavigate();
  const screenType = useScreenSizeType();
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();
  const shoppingListStore = useShoppingListStore();

  function handleShowShopListCode(newState: boolean) {
    setShowShopListCode(newState);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shoppingListStore.accessKey);
    setCodeCopied(true);
  }

  function handleLeave() {
    setConfirmationModalTitle("Vai tiešām vēlies iziet no saraksta?");
    setConfirmationModalType(ConfirmationModalType.LEAVE_SHOPPING_LIST);
    setShowDeleteOrLeaveConfirmation(true);
  }

  function handleShowDeleteConfirmation() {
    setConfirmationModalTitle("Vai tiešām vēlies izdzēst sarakstu?");
    setConfirmationModalType(ConfirmationModalType.DELETE_SHOPPING_LIST);
    setShowDeleteOrLeaveConfirmation(true);
  }

  function handleExitShopList() {
    productsStore.productsListListener?.unsubscribe;
    samplesStore.samplesListListener?.unsubscribe;
    shoppingListStore.resetAllData();
    localStorage.setItem("access_key", "");
    if (confirmationModalType === ConfirmationModalType.DELETE_SHOPPING_LIST) {
      dbDeleteShoppingList(shoppingListStore.id);
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
      {screenType === ScreenType.DESKTOP ? (
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
                value={shoppingListStore.accessKey}
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
          type={confirmationModalType}
          text={confirmationModalTitle}
          handleBgClick={() => setShowDeleteOrLeaveConfirmation(false)}
          handleCancel={() => setShowDeleteOrLeaveConfirmation(false)}
          handleConfirmation={handleExitShopList}
        ></ConfirmationModal>
      )}
    </>
  );
}
