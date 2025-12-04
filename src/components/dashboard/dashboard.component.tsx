import { Counter } from "../counter/Counter";
import { Quotes } from "../quotes/Quotes";
import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { PollDetailsComponent } from "../poll-details/poll-details.component";
import { fetchQuestions } from "./pollsAPI";
import { receiveQuestions } from "../../utils/questions/questions";
import { useAppDispatch } from "../../app/hooks";
import { useAppSelector } from "../../app/hooks";
import { QuestionsState } from "../../state-tree/state-tree";
import { Poll } from "../../state-tree/model";
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
  const [displayPendingPolls, setDisplayPendingPolls] = useState(true);
  const [answeredPolls, setAnsweredPolls] = useState<Poll[]>([]);
  const [pendingPolls, setPendingPolls] = useState<Poll[]>([]);
  const [questions, setQuestions] = useState<QuestionsState>({});
  const toggleDisplay = () => {
    setDisplayPendingPolls(!displayPendingPolls);
  };
  const dispatch = useAppDispatch();
  const authedUser = useAppSelector((state) => state.authedUser);
  const users = useAppSelector((state) => state.users);

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestions();
      dispatch(receiveQuestions(questions));
      setQuestions(questions);
    };
    loadQuestions();
  }, [])

  useEffect(() => {
    setAnsweredPolls(Object.values(questions).filter((question) => {
      return question.optionOne.votes.includes(authedUser.name!) || question.optionTwo.votes.includes(authedUser.name!);
    }).map((question) => {
      const totalUsers = Object.values(users).length;
      const optionOneVotes = question.optionOne.votes.length;
      const optionTwoVotes = question.optionTwo.votes.length;
      return {
        question,
        expand: false,
        answered: true,
        optionOne: {
          voted: optionOneVotes,
          percentage: `${Math.round((optionOneVotes / totalUsers) * 100)}%`
        },
        optionTwo: {
          voted: optionTwoVotes,
          percentage: `${Math.round((optionTwoVotes / totalUsers) * 100)}%`
        }
      }
    }).sort((a, b) => b.question.timestamp - a.question.timestamp));
    setPendingPolls(Object.values(questions).filter((question) => {
      return !question.optionOne.votes.includes(authedUser.name!) && !question.optionTwo.votes.includes(authedUser.name!);
    }).map((question) => {
       const totalUsers = Object.values(users).length;
      const optionOneVotes = question.optionOne.votes.length;
      const optionTwoVotes = question.optionTwo.votes.length;
      return {
        question,
        expand: false,
        answered: false,
        optionOne: {
          voted: optionOneVotes,
          percentage: `${Math.round((optionOneVotes / totalUsers) * 100)}%`
        },
        optionTwo: {
          voted: optionTwoVotes,
          percentage: `${Math.round((optionTwoVotes / totalUsers) * 100)}%`
        }
      }
    }).sort((a, b) => b.question.timestamp - a.question.timestamp));
  }, [questions])

  return <div className={styles["dashboard-component"]}>
    <Tabs value={displayPendingPolls ? 0 : 1} onChange={toggleDisplay}>
      <Tab label="Pending" />
      <Tab label="Completed" />
    </Tabs>
    <CustomTabPanel value={displayPendingPolls ? 0 : 1} index={0}>
      <div className={styles["poll-list"]}>
        {pendingPolls.map((poll) => (
          <PollDetailsComponent key={poll.question.id} poll={poll} />
        ))}
      </div>
    </CustomTabPanel>
    <CustomTabPanel value={displayPendingPolls ? 0 : 1} index={1}>
      <div className={styles["poll-list"]}>
        {answeredPolls.map((poll) => (
          <PollDetailsComponent key={poll.question.id} poll={poll} />
        ))}
      </div>
    </CustomTabPanel>
    <div className={styles["dashboard-counter"]}><Counter /></div>
    <div className={styles["dashboard-quotes"]}><Quotes /></div>
  </div>;
};