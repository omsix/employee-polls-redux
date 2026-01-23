import { screen, fireEvent } from "@testing-library/react";
import { DashboardComponent } from "./dashboard.component";
import { renderWithProviders } from "../../utils/test-utils";

describe("DashboardComponent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("matches snapshot when user omarcisse is logged in", async () => {
    localStorage.clear();
    localStorage.setItem("authedUser", "omarcisse");

    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {
          xj352vofupe1dqz9emx13r: "optionOne",
          vthrdm985a262al8qx3do: "optionTwo",
          "6ni6ok3ym7mf1p33lnez": "optionOne",
        },
        questions: ["6ni6ok3ym7mf1p33lnez", "xj352vofupe1dqz9emx13r"],
      },
      sarahedo: {
        id: "sarahedo",
        name: "Sarah Edo",
        avatarURL: "/avatars/sarah.png",
        answers: {
          "8xf0y6ziyjabvozdd253nd": "optionOne",
          "6ni6ok3ym7mf1p33lnez": "optionOne",
          am8ehyc8byjqgar0jgpub9: "optionTwo",
          loxhs1bqm25b708cmbf3g: "optionTwo",
        },
        questions: ["8xf0y6ziyjabvozdd253nd", "am8ehyc8byjqgar0jgpub9"],
      },
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: {
          vthrdm985a262al8qx3do: "optionOne",
          xj352vofupe1dqz9emx13r: "optionTwo",
        },
        questions: ["loxhs1bqm25b708cmbf3g", "vthrdm985a262al8qx3do"],
      },
      zoshikanlu: {
        id: "zoshikanlu",
        name: "Zenobia Oshikanlu",
        avatarURL: "/avatars/john.png",
        answers: {
          xj352vofupe1dqz9emx13r: "optionOne",
        },
        questions: [],
      },
    };

    const questions = {
      "8xf0y6ziyjabvozdd253nd": {
        id: "8xf0y6ziyjabvozdd253nd",
        author: "sarahedo",
        timestamp: 1467166872634,
        optionOne: {
          votes: ["sarahedo"],
          text: "Build our new application with Javascript",
        },
        optionTwo: {
          votes: [],
          text: "Build our new application with Typescript",
        },
      },
      "6ni6ok3ym7mf1p33lnez": {
        id: "6ni6ok3ym7mf1p33lnez",
        author: "omarcisse",
        timestamp: 1468479767190,
        optionOne: {
          votes: [],
          text: "hire more frontend developers",
        },
        optionTwo: {
          votes: ["omarcisse", "sarahedo"],
          text: "hire more backend developers",
        },
      },
      am8ehyc8byjqgar0jgpub9: {
        id: "am8ehyc8byjqgar0jgpub9",
        author: "sarahedo",
        timestamp: 1488579767190,
        optionOne: {
          votes: [],
          text: "conduct a release retrospective 1 week after a release",
        },
        optionTwo: {
          votes: ["sarahedo"],
          text: "conduct release retrospectives quarterly",
        },
      },
      loxhs1bqm25b708cmbf3g: {
        id: "loxhs1bqm25b708cmbf3g",
        author: "tylermcginnis",
        timestamp: 1482579767190,
        optionOne: {
          votes: [],
          text: "have code reviews conducted by peers",
        },
        optionTwo: {
          votes: ["sarahedo"],
          text: "have code reviews conducted by managers",
        },
      },
      vthrdm985a262al8qx3do: {
        id: "vthrdm985a262al8qx3do",
        author: "tylermcginnis",
        timestamp: 1489579767190,
        optionOne: {
          votes: ["tylermcginnis"],
          text: "take a course on ReactJS",
        },
        optionTwo: {
          votes: ["omarcisse"],
          text: "take a course on unit testing with Jest",
        },
      },
      xj352vofupe1dqz9emx13r: {
        id: "xj352vofupe1dqz9emx13r",
        author: "omarcisse",
        timestamp: 1493579767190,
        optionOne: {
          votes: ["omarcisse", "zoshikanlu"],
          text: "deploy to production once every two weeks",
        },
        optionTwo: {
          votes: ["tylermcginnis"],
          text: "deploy to production once every month",
        },
      },
    };

    const { asFragment } = renderWithProviders(<DashboardComponent />, {
      preloadedState: {
        authedUser: {
          name: "omarcisse",
          expiresAt: Date.now() + 60_000,
          status: "idle",
        },
        users: { entities: users, status: "idle" },
        questions: { entities: questions, status: "idle" },
      },
    });

    await screen.findByText("Pending");
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays loading state while polls are being fetched", () => {
    renderWithProviders(<DashboardComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: {}, status: "loading" },
        questions: { entities: {}, status: "loading" },
      },
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays no polls message when there are no questions", async () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<DashboardComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
        questions: { entities: {}, status: "idle" },
      },
    });

    await screen.findByText("No pending polls");
    expect(screen.getByText("No pending polls")).toBeInTheDocument();
  });

  it("switches between pending and completed tabs", async () => {
    localStorage.setItem("authedUser", "omarcisse");

    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: { xj352vofupe1dqz9emx13r: "optionOne" },
        questions: [],
      },
    };

    const questions = {
      xj352vofupe1dqz9emx13r: {
        id: "xj352vofupe1dqz9emx13r",
        author: "omarcisse",
        timestamp: 1493579767190,
        optionOne: {
          votes: ["omarcisse"],
          text: "deploy to production once every two weeks",
        },
        optionTwo: {
          votes: [],
          text: "deploy to production once every month",
        },
      },
    };

    renderWithProviders(<DashboardComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
        questions: { entities: questions, status: "idle" },
      },
    });

    const pendingTab = screen.getByRole("tab", { name: /pending/i });
    const completedTab = screen.getByRole("tab", { name: /completed/i });

    expect(pendingTab).toHaveAttribute("aria-selected", "true");
    expect(completedTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(completedTab);

    await screen.findByText(/deploy to production once every two weeks/i);
    expect(completedTab).toHaveAttribute("aria-selected", "true");
  });
});