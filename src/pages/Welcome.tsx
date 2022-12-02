import React from "react";

import styles from "./styles/Welcome.module.css";

const Welcome = () => {
  return (
    <div className={styles.welcomeContainer}>
      <h2>Sveiki, ko vēlies darīt?</h2>
      <div className="intention-container">
        <button>Izveidot iepirkumu sarakstu</button>
        <button>Apskatīt iepirkuma sarakstu</button>
      </div>
    </div>
  );
};

export default Welcome;
