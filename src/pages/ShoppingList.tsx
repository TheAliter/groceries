import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/ShoppingList.module.css";

export default function ShoppingList() {
  const { id: shoppingListId } = useParams();
  const navigate = useNavigate();

  function handleExit() {
    navigate("/");
  }

  return (
    <div className={styles.container}>
      <h1>Shopping list</h1>
      <p>{shoppingListId}</p>
      <button onClick={handleExit}>Iziet no saraksta</button>
    </div>
  );
}
