import styles from "./not-found.module.css";
import { useState, useRef, useEffect } from "react";

export interface NotFoundComponentProps { }

export const NotFoundComponent: React.FunctionComponent<NotFoundComponentProps> = () => {
  const [top, setTop] = useState<number>();
  const [left, setLeft] = useState<number>(0);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Position torch at center of h1 on mount
    if (h1Ref.current) {
      const rect = h1Ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2 + window.scrollY;
      setLeft(centerX);
      setTop(centerY);
    }
  }, []);

  return (<div className={styles['not-found-component']} 
    onMouseMove={(event: React.MouseEvent) => {
    setTop(event.pageY);
    setLeft(event.pageX);
  }}>
    <div className={styles['text']}>
      <h1 ref={h1Ref}>404</h1>
      <h2>Uh, Ohh</h2>
      <h3>
        Sorry we cant find what you are looking for 'cuz its so dark in here
      </h3>
    </div>
    <div
      className={styles['torch']}
      style={{ top: top, left: left }}
    ></div>
  </div>);
};
