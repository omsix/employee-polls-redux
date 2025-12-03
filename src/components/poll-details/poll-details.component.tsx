import { useState } from "react";
import styles from "./poll-details.module.css";
import { Card, CardActionArea, CardContent, CardActions, Avatar, Collapse } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { Poll } from "../../state-tree/model";
import CardHeader from '@mui/material/CardHeader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  return (
    <Card className={styles["poll-details-component"]}>
      <CardActionArea onClick={toggleExpand}>
        {expand && (<CardHeader
          avatar={
            <Avatar className={styles["poll-details-avatar"]} src={user.avatarURL} aria-label={user.name} >
              {user.name.charAt(0)}
            </Avatar>
          }
          title={` By ${user.name}`}
          subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
        />)}
        {!expand && (<CardHeader
          avatar={
            <Avatar aria-label={user.name} sx={{ width: '50px !important', height: '50px !important', color: 'white', bgcolor: 'primary.main' }}>
              {user.name.charAt(0)}
            </Avatar>
          }
          title={poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}
          subheader={`Asked On ${new Date(poll.question.timestamp).toLocaleDateString()}`}
        />)}
      </CardActionArea>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <CardContent>
          <FormControl>
            <FormLabel id="content-radio-buttons-group-label">Would You Rather</FormLabel>
            <RadioGroup
              aria-labelledby="content-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel value="optionOne" control={<Radio />} label={`${poll.question.optionOne.text.charAt(0).toUpperCase() + poll.question.optionOne.text.slice(1)}?`} />
              <FormControlLabel value="optionTwo" control={<Radio />} label={`${poll.question.optionTwo.text.charAt(0).toUpperCase() + poll.question.optionTwo.text.slice(1)}?`} />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Collapse>
    </Card>)
};