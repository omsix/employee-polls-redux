import styles from "./poll-details.module.css";

export interface PollDetailsComponentProps {}

export const PollDetailsComponent: React.FunctionComponent<PollDetailsComponentProps> = () => {
  return <div className={styles["poll-details-component"]}></div>;
};