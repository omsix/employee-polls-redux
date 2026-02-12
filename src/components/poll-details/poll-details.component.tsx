import { useState } from "react";
import styles from "./poll-details.module.css";
import { Card, CardActionArea, CardContent, Avatar, Collapse, CardActions, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Poll } from "../../state-tree/model";
import CardHeader from '@mui/material/CardHeader';
import { IconButton } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { addAnswerToQuestion } from "../../utils/questions/questions";
import { addAnswerToUser } from "../../utils/login/users";
import { useSetExpandedMutation } from "../../utils/polls/pollsAPI";
import { useNavigate, useLocation } from 'react-router-dom';

export interface PollDetailsComponentProps {
  poll: Poll;

}

export const PollDetailsComponent: React.FunctionComponent<PollDetailsComponentProps> = ({ poll }) => {
  const [open, setOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'optionOne' | 'optionTwo' | undefined>(poll.selectedAnswer);

  const users = useAppSelector((state) => state.users);
  const [triggerSetExpanded] = useSetExpandedMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();

  // Check if we're on the question details page
  const isOnDetailsPage = location.pathname.startsWith('/questions/');
  const toggleExpand = () => {
    triggerSetExpanded({ pollId: poll.question.id, expanded: !poll.expand });
  };
  const user = users.entities[poll.question.author];
  const authedUser = useAppSelector((state) => state.authedUser);

  // Handle case where poll author doesn't exist
  if (!user) {
    return <Card className={styles["poll-details-component"]}>
      <CardContent>Error: Poll author not found</CardContent>
    </Card>;
  }

  function handleClose(): void {
    setOpen(false);
  }

  function handleVote(): void {
    if (!selectedAnswer) {
      return;
    }
    const mutatedQuestions = addAnswerToQuestion({ authedUser: authedUser.name!, qid: poll.question.id, answer: selectedAnswer });
    console.log('mutatedQuestions:', mutatedQuestions);
    dispatch(mutatedQuestions);

    const mutatedUsers = addAnswerToUser({ authedUser: authedUser.name!, qid: poll.question.id, answer: selectedAnswer });
    console.log('mutatedUsers:', mutatedUsers);
    dispatch(mutatedUsers);
    setOpen(false);
  }

  function selectAnswer(value: 'optionOne' | 'optionTwo') {
    setSelectedAnswer(value);
  }

  const handleActiveSession = () => {
    sessionStorage.setItem('spa_navigation_active', 'true');
  };

  const handleInactiveSession = () => {
    sessionStorage.setItem('spa_navigation_active', 'false');
  };
  const handleCardHeaderAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleActiveSession();
    if (isOnDetailsPage) {
      // On details page - navigate to home with appropriate tab
      handleNavigateToHome();
    } else {
      // On dashboard - navigate to details page
      handleNavigateToDetails();
    }
    handleInactiveSession();
  };

  const handleNavigateToHome = () => {
    const activeTab = poll.answered ? 'answered' : 'pending';
    navigate('/', { state: { activeTab } });
  };

  const handleNavigateToDetails = () => {
    navigate(`/questions/${poll.question.id}`);
  };

  return (
    <>
      <Card className={styles["poll-details-component"]}>
        <CardActionArea onClick={toggleExpand}>
          {poll.expand && (<CardHeader
            avatar={
              <Avatar className={styles["poll-details-avatar-img"]} src={user.avatarURL} aria-label={user.name} >
                {user.name.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton onClick={handleCardHeaderAction} aria-label={isOnDetailsPage ? "back to dashboard" : "view details"}>
                {isOnDetailsPage ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
              </IconButton>
            }
            title={` By ${user.name}`}
            subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
          />)}
          {!poll.expand && (<CardHeader
            avatar={
              <Avatar aria-label={user.name} className={styles["poll-details-avatar-letter"]}>
                {user.name.charAt(0)}
              </Avatar>
            }
            title={poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}
            subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
          />)}
        </CardActionArea>
        <Collapse in={poll.expand} timeout="auto" unmountOnExit>
          <CardContent>
            {!poll.answered && <FormControl>
              <FormLabel id="content-radio-buttons-group-label">Would You Rather</FormLabel>
              <RadioGroup
                aria-labelledby="content-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(e) => {
                  selectAnswer(e.target.value as 'optionOne' | 'optionTwo');
                }}
              >
                <FormControlLabel value={"optionOne"} control={<Radio />} label={`${poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}?`} />
                <FormControlLabel value={"optionTwo"} control={<Radio />} label={`${poll.question.optionTwo.text.charAt(0).toUpperCase() + poll.question.optionTwo.text.slice(1)}?`} />
              </RadioGroup>
            </FormControl>}
            {poll.answered && (
              <div>
                <p>You voted for:</p>
                <ol>
                  {["optionOne", "optionTwo"].map((optKey) => {
                    const option = poll.question[optKey as "optionOne" | "optionTwo"];
                    const isChosen = option.votes.includes(authedUser.name!);
                    const percentage = poll[optKey as "optionOne" | "optionTwo"].percentage;
                    const text =
                      option.text.charAt(0).toUpperCase() + option.text.slice(1);

                    return (
                      <li key={optKey}>
                        {isChosen ? (
                          <h3>
                            <u>{text}</u> <i>[{option.votes.length} votes ({percentage})]</i>
                          </h3>
                        ) : (
                          <>
                            {text} <i>[{option.votes.length} votes ({percentage})]</i>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

          </CardContent>
        </Collapse>
        {!poll.answered && poll.expand && <CardActions>
          <IconButton onClick={() => setOpen(!open)} disabled={!selectedAnswer}>
            <HowToVoteIcon /> Vote
          </IconButton>
        </CardActions>}
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Vote Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Is this your final vote for this poll?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => { handleVote() }}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={() => { setOpen(false) }}>
            <CancelIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>)
};