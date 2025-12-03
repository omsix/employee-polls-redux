import { _getQuestions } from "../../data/data";
import { QuestionsState } from "../../state-tree/state-tree";

export const fetchQuestions: () => Promise<QuestionsState> = () => _getQuestions() as Promise<QuestionsState>;
