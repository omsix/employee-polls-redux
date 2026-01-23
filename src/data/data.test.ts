import { describe, expect, it, vi } from "vitest";
import { _getQuestions, _getUsers, _saveQuestion, _saveQuestionAnswer } from "./data";

describe("_saveQuestion", () => {
  it("returns the saved question with expected fields when passed correctly formatted data", async () => {
    vi.useFakeTimers();

    const questionPromise = _saveQuestion({
      optionOneText: "write unit tests",
      optionTwoText: "write integration tests",
      author: "sarahedo",
    });

    await vi.advanceTimersByTimeAsync(1001);

    const savedQuestion = await questionPromise;

    expect(savedQuestion).toBeTruthy();
    expect(savedQuestion).toHaveProperty("id");
    expect(typeof savedQuestion.id).toBe("string");
    expect(savedQuestion.id.length).toBeGreaterThan(0);

    expect(savedQuestion).toHaveProperty("timestamp");
    expect(typeof savedQuestion.timestamp).toBe("number");

    expect(savedQuestion).toHaveProperty("author", "sarahedo");

    expect(savedQuestion).toHaveProperty("optionOne");
    expect(savedQuestion.optionOne).toEqual({
      votes: [],
      text: "write unit tests",
    });

    expect(savedQuestion).toHaveProperty("optionTwo");
    expect(savedQuestion.optionTwo).toEqual({
      votes: [],
      text: "write integration tests",
    });

    vi.useRealTimers();
  });

  it("returns an error when passed incorrectly formatted data", async () => {
    await expect(
      _saveQuestion({
        optionOneText: "",
        optionTwoText: "write integration tests",
        author: "sarahedo",
      }),
    ).rejects.toBe("Please provide optionOneText, optionTwoText, and author");
  });
});

describe("_saveQuestionAnswer", () => {
  it("returns the saved question answer and updates expected fields when passed correctly formatted data", async () => {
    vi.useFakeTimers();

    const authedUser = "zoshikanlu";
    const qid = "vthrdm985a262al8qx3do";
    const answer = "optionOne";

    const saveAnswerPromise = _saveQuestionAnswer({ authedUser, qid, answer });
    await vi.advanceTimersByTimeAsync(501);
    const saved = await saveAnswerPromise;

    expect(saved).toBeTruthy();
    expect(saved).toBe(true);

    const usersPromise = _getUsers();
    const questionsPromise = _getQuestions();
    await vi.advanceTimersByTimeAsync(1001);

    const users = (await usersPromise) as Record<string, any>;
    const questions = (await questionsPromise) as Record<string, any>;

    expect(users).toBeTruthy();
    expect(users).toHaveProperty(authedUser);
    expect(users[authedUser]).toHaveProperty("answers");
    expect(users[authedUser].answers).toHaveProperty(qid, answer);

    expect(questions).toBeTruthy();
    expect(questions).toHaveProperty(qid);
    expect(questions[qid]).toHaveProperty(answer);
    expect(questions[qid][answer]).toHaveProperty("votes");
    expect(questions[qid][answer].votes).toContain(authedUser);

    vi.useRealTimers();
  });

  it("returns an error when passed incorrectly formatted data", async () => {
    vi.useFakeTimers();

    const saveAnswerPromise = _saveQuestionAnswer({
      authedUser: "",
      qid: "vthrdm985a262al8qx3do",
      answer: "optionOne",
    });

    await expect(saveAnswerPromise).rejects.toBe(
      "Please provide authedUser, qid, and answer",
    );

    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
