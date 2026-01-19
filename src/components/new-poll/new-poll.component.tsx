import styles from "./new-poll.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addQuestion } from "../../utils/questions/questions";
import { addQuestionToUser } from "../../utils/login/users";

export interface NewPollComponentProps { }

export const NewPollComponent: React.FunctionComponent<NewPollComponentProps> = () => {
  const [optionOneText, setOptionOneText] = useState("");
  const [optionTwoText, setOptionTwoText] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authedUser = useAppSelector((state) => state.authedUser);

  const canSubmit = optionOneText.trim().length > 0 && optionTwoText.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authedUser.name) return;
    if (!canSubmit) return;

    const resultAction = await dispatch(
      addQuestion({
        optionOneText: optionOneText.trim(),
        optionTwoText: optionTwoText.trim(),
        author: authedUser.name,
      }),
    );

    if (addQuestion.fulfilled.match(resultAction)) {
      dispatch(addQuestionToUser({ author: authedUser.name, qid: resultAction.payload.id }));
      navigate("/");
    }
  };

  return (<> <Card className={styles["new-poll-component"]}>
    <h2>Would You Rather</h2>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Option One"
        value={optionOneText}
        onChange={(e) => setOptionOneText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Option Two"
        value={optionTwoText}
        onChange={(e) => setOptionTwoText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" disabled={!authedUser.name || !canSubmit}>
        Submit
      </Button>
    </form>
  </Card></>

  );
};
