import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/_components";
import { dbIsValidShoppingList } from "../database/_database";
import styles from "./styles/JoinForm.module.css";

export default function JoinForm() {
  const [accessKey, setAccessKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    setIsLoading(true);
    setErrorMessage("");

    e.preventDefault();

    const isValid = await dbIsValidShoppingList(accessKey);

    if (isValid) {
      navigate("/shopping-list/" + accessKey);
      localStorage.setItem("access_key", accessKey);
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
          <input
            onChange={(e) => setAccessKey(e.target.value)}
            value={accessKey}
            type="text"
            required
          />
          <button>Apstiprināt</button>
        </form>
      )}

      {!isLoading && errorMessage && (
        <p className="error-text">{errorMessage}</p>
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
