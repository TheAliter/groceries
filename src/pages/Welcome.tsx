import styles from "./styles/Welcome.module.css";
import { useNavigate } from "react-router-dom";
import { dbCreateShoppingList } from "../database/createShoppingList";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import Loader from "../components/Loader";

export default function Welcome() {
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setError] = useState("");

  async function handleCreate() {
    setIsLoading(true);
    const { accessKey, isSuccess } = await dbCreateShoppingList();
    setIsLoading(false);

    if (isSuccess) {
      localStorage.setItem("access_key", accessKey);
      globalContext?.updateUseShoppingListGuard(false);
      navigate(`/shopping-list/${accessKey}`);
    } else {
      setError("Neizdevās izveidot iepirkumu sarakstu");
    }
  }

  function handleJoin() {
    navigate("/join-shopping-list");
  }

  useEffect(() => {
    const accessKey = localStorage.getItem("access_key");
    if (accessKey && accessKey.length > 0) {
      navigate(`/shopping-list/${accessKey}`);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/apple.svg" alt="take apple logo" />
      </div>
      <h2>Sveiki, ko vēlies darīt?</h2>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.actions}>
            <button onClick={handleCreate}>Izveidot iepirkumu sarakstu</button>
            <button onClick={handleJoin}>Apskatīt iepirkuma sarakstu</button>
          </div>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
        </>
      )}
    </div>
  );
}
