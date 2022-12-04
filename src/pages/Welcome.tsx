import styles from "./styles/Welcome.module.css";
import { useNavigate } from "react-router-dom";
import createNewShoppingList from "../database/createNewShoppingList";
import getShoppingList from "../database/getShoppingList";

const Welcome = () => {
  const navigate = useNavigate();

  async function handleCreate() {
    // TODO: create loader and handle errors
    console.log(" create list");

    const { id, error } = await createNewShoppingList();
    console.log(id, error);

    if (!error) navigate(`/shopping-list/${id}`);
  }

  async function handleJoin() {
    const id = 5673896654;
    const { data, error } = await getShoppingList(id);

    console.log(id);
    if (data) navigate(`/shopping-list/${id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/apple.svg" alt="take apple logo" />
      </div>
      <h2>Sveiki, ko vēlies darīt?</h2>
      <div className={styles.actions}>
        <button onClick={handleCreate}>Izveidot iepirkumu sarakstu</button>
        <button onClick={handleJoin}>Apskatīt iepirkuma sarakstu</button>
      </div>
    </div>
  );
};

export default Welcome;
