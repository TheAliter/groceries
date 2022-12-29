import styles from "./styles/ConfirmationModal.module.css";
import { Modal } from "./_components";

export enum ConfirmationModalType {
  DELETE_SHOPPING_LIST,
  LEAVE_SHOPPING_LIST,
}

interface Props {
  type?: ConfirmationModalType;
  text: string;
  handleBgClick?: () => void;
  handleCancel: () => void;
  handleConfirmation: () => void;
}

export default function ConfirmationModal({
  type,
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
