import styles from "./leader-board.module.css";

export interface LeaderBoardComponentProps {}

export const LeaderBoardComponent: React.FunctionComponent<LeaderBoardComponentProps> = () => {
  return <div className={styles["leader-board-component"]}></div>;
};