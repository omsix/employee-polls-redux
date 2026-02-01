import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import { LeaderBoardComponent } from "./leader-board.component";

describe("LeaderBoardComponent", () => {
  it("displays no users message when there are no users", () => {
    renderWithProviders(<LeaderBoardComponent />, {
      preloadedState: {
        users: { entities: {}, status: "idle" },
      },
    });

    expect(screen.getByText("No users to display")).toBeInTheDocument();
  });

  it("displays users sorted by score in descending order", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: { q1: "optionOne", q2: "optionTwo" },
        questions: ["q3", "q4"],
      },
      sarahedo: {
        id: "sarahedo",
        name: "Sarah Edo",
        avatarURL: "/avatars/sarah.png",
        answers: { q1: "optionOne" },
        questions: ["q5"],
      },
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: { q1: "optionOne", q2: "optionTwo", q3: "optionOne" },
        questions: ["q6", "q7", "q8"],
      },
    };

    renderWithProviders(<LeaderBoardComponent />, {
      preloadedState: {
        users: { entities: users, status: "idle" },
      },
    });

    const entries = screen.getAllByText(/Questions asked:/);
    expect(entries).toHaveLength(3);

    const userNames = screen.getAllByRole("heading", { level: 6 });
    expect(userNames[0]).toHaveTextContent("Tyler McGinnis");
    expect(userNames[2]).toHaveTextContent("Omar Cisse");
    expect(userNames[4]).toHaveTextContent("Sarah Edo");
  });

  it("displays correct score calculations for each user", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: { q1: "optionOne", q2: "optionTwo" },
        questions: ["q3"],
      },
    };

    renderWithProviders(<LeaderBoardComponent />, {
      preloadedState: {
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText("Questions asked: 1")).toBeInTheDocument();
    expect(screen.getByText("Questions answered: 2")).toBeInTheDocument();
    const scoreElements = screen.getAllByRole("heading", { level: 6 });
    const scoreElement = scoreElements.find((el) => el.textContent === "3");
    expect(scoreElement).toBeInTheDocument();
  });

  it("renders avatars for all users", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
      sarahedo: {
        id: "sarahedo",
        name: "Sarah Edo",
        avatarURL: "/avatars/sarah.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<LeaderBoardComponent />, {
      preloadedState: {
        users: { entities: users, status: "idle" },
      },
    });

    const avatars = screen.getAllByRole("img");
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute("alt", "Omar Cisse");
    expect(avatars[1]).toHaveAttribute("alt", "Sarah Edo");
  });
});