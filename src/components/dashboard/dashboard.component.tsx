import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { PollDetailsComponent } from "../poll-details/poll-details.component";
import { useBuildPollsQuery } from "../../utils/polls/pollsAPI";
import { Question, User, Poll } from "../../state-tree/model";
import { useAppSelector } from "../../app/hooks";

export interface DashboardComponentProps { }

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const DashboardComponent: React.FunctionComponent<DashboardComponentProps> = () => {
  const location = useLocation();
  const state = location.state as { activeTab?: 'pending' | 'answered' } | null;
  
  const [displayPendingPolls, setDisplayPendingPolls] = useState(true);

  useEffect(() => {
    // Set initial tab based on navigation state
    if (state?.activeTab === 'answered') {
      setDisplayPendingPolls(false);
    } else if (state?.activeTab === 'pending') {
      setDisplayPendingPolls(true);
    }
  }, [state]);
  const users: { [key: string]: User } = useAppSelector((state) => state.users.entities);
  const questions: { [key: string]: Question } = useAppSelector((state) => state.questions.entities);

  const { data: polls, isLoading: isLoadingPolls } = useBuildPollsQuery({ questions, users });

  let answeredPolls: Poll[] = [];
  let pendingPolls: Poll[] = [];

  const toggleDisplay = () => {
    setDisplayPendingPolls(!displayPendingPolls);
  };

  if (isLoadingPolls) {
    return <div>Loading...</div>;
  }
  if (polls) {
    answeredPolls = Object.values(polls!.entities).filter((poll) => poll.answered);
    pendingPolls = Object.values(polls!.entities).filter((poll) => !poll.answered);
  } else {
    return <div>No Polls To Display!</div>;
  }


  return <div className={styles["dashboard-component"]}>
    <Tabs value={displayPendingPolls ? 0 : 1} onChange={toggleDisplay}>
      <Tab label="Pending" />
      <Tab label="Completed" />
    </Tabs>
    <CustomTabPanel value={displayPendingPolls ? 0 : 1} index={0}>
      <div className={styles["poll-list"]}>
        {pendingPolls.length > 0 && Object.values(pendingPolls).map((poll) => (
          <PollDetailsComponent key={poll.question.id} poll={poll} />
        )) || <div>No pending polls</div>}
      </div>
    </CustomTabPanel>
    <CustomTabPanel value={displayPendingPolls ? 0 : 1} index={1}>
      <div className={styles["poll-list"]}>
        {answeredPolls.length > 0 && Object.values(answeredPolls).map((poll) => (
          <PollDetailsComponent key={poll.question.id} poll={poll} />
        )) || <div>No completed polls</div>}
      </div>
    </CustomTabPanel>
  </div>;
};