import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/Header.module.css";

interface Props {
  handleMenuShow: Function;
}

export default function Header({ handleMenuShow }: Props) {
  const [title, setTitle] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("edit-product")) {
      setTitle("Rediģēt preci");
    } else if (pathname.includes("add-product")) {
      setTitle("Pievienot preci");
    } else {
      setTitle("Iepirkuma saraksts");
    }
  }, [pathname]);

  return (
    <header className={styles.container}>
      <h1>{title}</h1>
      <div onClick={() => handleMenuShow()} className={styles["menu-icon"]}>
        <span className="material-icons">menu</span>
      </div>
    </header>
  );
}
