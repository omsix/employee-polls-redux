import styles from "./new-poll.module.css";

export interface NewPollComponentProps {}

export const NewPollComponent: React.FunctionComponent<NewPollComponentProps> = () => {
  return <div className={styles["new-poll-component"]}></div>;
};
