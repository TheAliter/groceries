import styles from "./styles/ShoppingListMenu.module.css";

interface Props {
  handleShowShopListCode: () => void;
  handleDeleteShopList: () => void;
  handleClose: () => void;
}

export default function ShoppingListMenu({
  handleShowShopListCode,
  handleDeleteShopList,
  handleClose,
}: Props) {
  return (
    <div className={styles.container}>
      <button onClick={handleShowShopListCode}>Parādīt saraksta kodu</button>
      <button onClick={handleDeleteShopList} className="accent">
        Izdzēst sarakstu
      </button>
      <button onClick={handleClose}>Aizvērt</button>
    </div>
  );
}
