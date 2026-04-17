import { ReactElement } from "react";
import styles from "./styles/ShoppingListLayout.module.css";

interface ShoppingListLayout {
  mainContent: ReactElement;
  actions?: ReactElement | null;
  menu?: ReactElement;
}

export default function ShoppingListLayout({
  mainContent,
  actions,
  menu,
}: ShoppingListLayout) {
  const hasActionsColumn = actions != null;

  return (
    <div
      className={
        styles["shopping-list-base"] +
        (hasActionsColumn ? "" : ` ${styles["shopping-list-base-single"]}`)
      }
    >
      {/* MAIN CONTENT / LEFT SIDE */}
      <div className={styles.left}>{mainContent}</div>

      {/* ACTIONS / RIGHT SIDE */}
      {hasActionsColumn ? (
        <div className={styles.right}>
          <h1 className={styles["actions-title"]}>Darbības</h1>

          <div className={styles["actions-block"]}>
            {/* MAIN ACTIONS BUTTONS */}
            <div className={styles["main-actions"]}>{actions}</div>

            {/* MENU */}
            {menu !== undefined ? (
              <>
                <div className={styles.spacer}></div>
                {menu}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
