export interface Poll {
    question: Question;
    expand: boolean;
    answered: boolean;
    optionOne: {
        voted: number;
        percentage: string;
    };
    optionTwo: {
        voted: number;
        percentage: string;
    };
};

export interface User {
    id: string;
    name: string;
    avatarURL: string;
    answers: Record<string, string>; // questionId -> selectedOption
    questions: string[]; // array of question IDs created by the user
}

export interface Question {
    id: string;
    author: string;
    timestamp: number;
    optionOne: {
        votes: string[];
        text: string;
    };
    optionTwo: {
        votes: string[];
        text: string;
    };
}
