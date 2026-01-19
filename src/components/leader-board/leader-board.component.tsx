import styles from "./leader-board.module.css";
import { useAppSelector } from "../../app/hooks";
import { Avatar, Card, CardContent, Typography } from "@mui/material";

export interface LeaderBoardComponentProps {}

export const LeaderBoardComponent: React.FunctionComponent<LeaderBoardComponentProps> = () => {
  const users = useAppSelector((state) => state.users.entities);

  const leaderboard = Object.values(users)
    .map((user) => {
      const asked = user.questions.length;
      const answered = Object.keys(user.answers).length;
      return {
        id: user.id,
        name: user.name,
        avatarURL: user.avatarURL,
        asked,
        answered,
        score: asked + answered,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className={styles["leader-board-component"]}>
      {leaderboard.length === 0 ? (
        <div>No users to display</div>
      ) : (
        leaderboard.map((entry) => (
          <Card key={entry.id} className={styles["leader-board-entry"]}>
            <CardContent className={styles["leader-board-entry-content"]}>
              <Avatar alt={entry.name} src={entry.avatarURL} />
              <div className={styles["leader-board-entry-text"]}>
                <Typography variant="h6">{entry.name}</Typography>
                <Typography variant="body2">Questions asked: {entry.asked}</Typography>
                <Typography variant="body2">Questions answered: {entry.answered}</Typography>
              </div>
              <div className={styles["leader-board-entry-score"]}>
                <Typography variant="h6">{entry.score}</Typography>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};