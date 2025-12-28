import { User, Question, Poll } from "./model";

//AuthedUser
export type AuthedUserState = {
    name: string | null;
    expiresAt: number | null; // timestamp en ms
    status: "idle" | "loading" | "failed";
};

//Users
export type UsersState = {
    entities: { [userId: string]: User; };
    status: "idle" | "loading" | "failed";
};

//Questions
export type QuestionsState = {
    entities: { [questionId: string]: Question; };
    status: "idle" | "loading" | "failed";
};

//Polls
export type PollsState = {
    entities: { [questionId: string]: Poll; };
    status: "idle" | "loading" | "failed";
};