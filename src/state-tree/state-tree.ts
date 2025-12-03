import { User, Question } from "./model";

//AuthedUser
export type AuthedUserState = {
    name: string | null;
    expiresAt: number | null; // timestamp en ms
    status: "idle" | "loading" | "failed";
};

//Users
export type UsersState = {
    [userId: string]: User;
};

//Questions
export type QuestionsState = {
    [questionId: string]: Question;
};
