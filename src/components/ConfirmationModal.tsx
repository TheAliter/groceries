import Modal from "./Modal";
import styles from "./styles/ConfirmationModal.module.css";

interface Props {
  text: string;
  handleBgClick?: () => void;
  handleCancel: () => void;
  handleConfirmation: () => void;
}

export default function ConfirmationModal({
  text,
  handleBgClick,
  handleCancel,
  handleConfirmation,
}: Props) {
  return (
    <Modal handleBackgroundClick={handleBgClick}>
      <div className={styles.container}>
        <p>{text}</p>
        <div className={styles.actions}>
          <button onClick={handleCancel} className="accent">
            Atcelt
          </button>
          <button onClick={handleConfirmation}>Apstiprināt</button>
        </div>
      </div>
    </Modal>
  );
}
