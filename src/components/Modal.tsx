import { ReactElement } from "react";
import styles from "./styles/Modal.module.css";

interface Props {
  children: ReactElement;
  handleBackgroundClick: () => void;
}

export default function Modal({ children, handleBackgroundClick }: Props) {
  function handleClick(e: React.SyntheticEvent) {
    const el = e.target as HTMLElement;
    if (el.id === "modal") {
      handleBackgroundClick();
    }
  }

  return (
    <div onClick={handleClick} id="modal" className={styles.container}>
      {children}
    </div>
  );
}
