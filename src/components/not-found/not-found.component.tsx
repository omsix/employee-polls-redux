import styles from "./not-found.module.css";
import { useState } from "react";

export interface NotFoundComponentProps { }

export const NotFoundComponent: React.FunctionComponent<NotFoundComponentProps> = () => {
  const [top, setTop] = useState<number>();
  const [left, setLeft] = useState<number>(0);
  return (<div className={styles.notFound}>
    <div className={styles.text}>
      <h1>404</h1>
      <h2>Uh, Ohh</h2>
      <h3>
        Sorry we cant find what you are looking for 'cuz its so dark in here
      </h3>
    </div>
    <div
      className={styles.torch}
      style={{ top: top, left: left }}
      onMouseMove={(event: React.MouseEvent) => {
        setTop(event.pageY);
        setLeft(event.pageX);
      }}
    ></div>
  </div>);
};
