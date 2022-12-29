import styles from "./styles/Welcome.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePrimaryStore } from "../store/_store";
import { dbCreateShoppingList } from "../database/_database";
import { Loader } from "../components/_components";

export default function Welcome() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setError] = useState("");
  const primaryStore = usePrimaryStore();

  async function handleCreate() {
    setIsLoading(true);
    const { accessKey, isSuccess } = await dbCreateShoppingList();
    setIsLoading(false);

    if (isSuccess) {
      localStorage.setItem("access_key", accessKey);
      primaryStore.updateUseShoppingListGuard(false);
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
