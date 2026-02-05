import { useParams, Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useBuildPollsQuery } from "../../utils/polls/pollsAPI";
import { Question, User } from "../../state-tree/model";
import { PollDetailsComponent } from "./poll-details.component";

export const PollDetailsPageComponent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const users: { [key: string]: User } = useAppSelector((state) => state.users.entities);
  const questions: { [key: string]: Question } = useAppSelector((state) => state.questions.entities);

  const { data: polls, isLoading } = useBuildPollsQuery({ questions, users });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!id || !polls?.entities[id]) {
    return <Navigate to="/404" />;
  }

  const poll = polls.entities[id];

  return <PollDetailsComponent poll={poll} />;
};
