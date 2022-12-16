import { ReactElement } from "react";
import styles from "./styles/Layouts.module.css";

interface ShoppingListLayout {
  mainContent: ReactElement;
  actions: ReactElement;
  menu: ReactElement;
}

export function ShoppingListLayout({
  mainContent,
  actions,
  menu,
}: ShoppingListLayout) {
  return (
    <div className={styles["shopping-list-base"]}>
      <div className={styles.left}>{mainContent}</div>
      <div className={styles.right}>
        <h1 className={styles['actions-title']}>Darbības</h1>
        <div className={styles["actions-block"]}>
          <div className={styles['main-actions']}>{actions}</div>
          <div className={styles.spacer}></div>
          {menu}
        </div>
      </div>
    </div>
  );
}
