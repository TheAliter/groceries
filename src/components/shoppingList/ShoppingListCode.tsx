import styles from "./styles/ShoppingListCode.module.css";

interface Props {
  id: string;
  handleClose: () => void;
}

export default function ShoppingListCode({ id, handleClose }: Props) {
  function handleCopy() {
    navigator.clipboard.writeText(id);
  }

  return (
    <div className={styles.container}>
      <p>Iepirkuma saraksta kods:</p>
      <input type="text" readOnly value={id}></input>
      <div className={styles.actions}>
        <button onClick={handleClose} className="accent">
          Aizvērt
        </button>
        <button onClick={handleCopy}>Nokopēt</button>
      </div>
    </div>
  );
}
