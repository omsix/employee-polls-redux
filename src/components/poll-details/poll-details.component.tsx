import { useState } from "react";
import styles from "./poll-details.module.css";
import { Card, CardActionArea, CardContent, Avatar, Collapse } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { Poll } from "../../state-tree/model";
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { IconButton, IconButtonProps } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export interface PollDetailsComponentProps {
  poll: Poll;

}

export const PollDetailsComponent: React.FunctionComponent<PollDetailsComponentProps> = ({ poll }) => {
  const [expand, setExpand] = useState(poll.expand);
  const users = useAppSelector((state) => state.users);
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const user = users[poll.question.author];
  const authedUser = useAppSelector((state) => state.authedUser);

  return (
    <Card className={styles["poll-details-component"]}>
      <CardActionArea onClick={toggleExpand}>
        {expand && (<CardHeader
          avatar={
            <Avatar className={styles["poll-details-avatar-img"]} src={user.avatarURL} aria-label={user.name} >
              {user.name.charAt(0)}
            </Avatar>
          }
          title={` By ${user.name}`}
          subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
        />)}
        {!expand && (<CardHeader
          avatar={
            <Avatar aria-label={user.name} className={styles["poll-details-avatar-letter"]}>
              {user.name.charAt(0)}
            </Avatar>
          }
          title={poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}
          subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
        />)}
      </CardActionArea>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <CardContent>
          {!poll.answered && <FormControl>
            <FormLabel id="content-radio-buttons-group-label">Would You Rather</FormLabel>
            <RadioGroup
              aria-labelledby="content-radio-buttons-group-label"
              defaultValue={poll.question.optionOne.text}
              name="radio-buttons-group"
            >
              <FormControlLabel value={poll.question.optionOne.text} control={<Radio />} label={`${poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}?`} />
              <FormControlLabel value={poll.question.optionTwo.text} control={<Radio />} label={`${poll.question.optionTwo.text.charAt(0).toUpperCase() + poll.question.optionTwo.text.slice(1)}?`} />
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
    </Card>)
};