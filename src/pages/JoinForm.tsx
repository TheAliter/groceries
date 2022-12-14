import { dbIsValidShoppingList } from "../database/isValidShoppingList";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles/JoinForm.module.css";
import Loader from "../components/Loader";

export default function JoinForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputValue = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    setIsLoading(true);
    setErrorMessage("");

    const id = inputValue.current?.value ?? "";
    e.preventDefault();

    const isValid = await dbIsValidShoppingList(id);

    if (isValid) {
      navigate("/shopping-list/" + id);
    } else {
      setIsLoading(false);
      setErrorMessage("Nepareizs piekļuves kods");
    }
  }

  return (
    <div className={styles.container}>
      <h3>Ievadi piekļuves kodu</h3>

      {isLoading ? (
        <Loader />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input ref={inputValue} type="text" placeholder="0123456789" />
          <button>Apstiprināt</button>
        </form>
      )}

      {!isLoading && errorMessage && (
        <p className={styles.error}>{errorMessage}</p>
      )}

      {!isLoading && (
        <button
          onClick={() => navigate(-1)}
          className={`${styles.back} accent`}
        >
          Atpakaļ
        </button>
      )}
    </div>
  );
}
