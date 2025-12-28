import { _getUsers } from "../../data/data";
import { User } from "../../state-tree/model";
import { UsersState } from "../../state-tree/state-tree";
import { _getQuestions } from "../../data/data";
import { Question } from "../../state-tree/model";
import { QuestionsState } from "../../state-tree/state-tree";
// A mock function to mimic making an async request for data
export const fetchAuthedUser = (name: string | null = null, durationMinutes: number = 5): Promise<{ data: { name: string | null, expiresAt: number | null } }> =>
  new Promise<{ data: { name: string | null, expiresAt: number | null } }>(resolve =>
    setTimeout(() => {
      localStorage.setItem('authedUser', name ?? '');
      resolve({ data: { name, expiresAt: Date.now() + durationMinutes * 60 * 1000 } })
    }, 500),
  )

export const getUsers: () => Promise<UsersState> = async () => {
  const entities: { [userId: string]: User; } = await _getUsers() as { [userId: string]: User; };
  return { entities, status: "idle" }
};

export const getQuestions: () => Promise<QuestionsState> = async () => {
  const entities: { [questionId: string]: Question; } = await _getQuestions() as { [questionId: string]: Question; };
  return { entities, status: "idle" }
};