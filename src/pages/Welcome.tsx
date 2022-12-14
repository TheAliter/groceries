import styles from "./styles/Welcome.module.css";
import { useNavigate } from "react-router-dom";
import { createShoppingList } from "../database/createShoppingList";
import { useContext, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import Loader from "../components/Loader";

export default function Welcome() {
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    setIsLoading(true);
    const { id, isSuccess } = await createShoppingList();
    setIsLoading(false);

    if (isSuccess) {
      globalContext?.updateUseShoppingListGuard(false);
      navigate(`/shopping-list/${id}`);
    }
  }

  function handleJoin() {
    navigate("/join-shopping-list");
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/apple.svg" alt="take apple logo" />
      </div>
      <h2>Sveiki, ko vēlies darīt?</h2>

      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.actions}>
          <button onClick={handleCreate}>Izveidot iepirkumu sarakstu</button>
          <button onClick={handleJoin}>Apskatīt iepirkuma sarakstu</button>
        </div>
      )}
    </div>
  );
}
