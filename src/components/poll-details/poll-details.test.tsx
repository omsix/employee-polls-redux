import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import { PollDetailsComponent } from "./poll-details.component";
import { Poll } from "../../state-tree/model";

describe("PollDetailsComponent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("matches snapshot when omarcisse views tylermcginnis question vthrdm985a262al8qx3do", () => {
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
      sarahedo: {
        id: "sarahedo",
        name: "Sarah Edo",
        avatarURL: "/avatars/sarah.png",
        answers: {},
        questions: [],
      },
      zoshikanlu: {
        id: "zoshikanlu",
        name: "Zenobia Oshikanlu",
        avatarURL: "/avatars/john.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
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
      expand: true,
      answered: true,
      selectedAnswer: "optionTwo",
      optionOne: {
        voted: 1,
        percentage: "25%",
      },
      optionTwo: {
        voted: 1,
        percentage: "25%",
      },
    };

    const { asFragment } = renderWithProviders(
      <PollDetailsComponent poll={poll} />,
      {
        preloadedState: {
          authedUser: {
            name: "omarcisse",
            expiresAt: Date.now() + 60_000,
            status: "idle",
          },
          users: { entities: users, status: "idle" },
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("displays unanswered poll with radio buttons when poll is not answered", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
        id: "vthrdm985a262al8qx3do",
        author: "tylermcginnis",
        timestamp: 1489579767190,
        optionOne: {
          votes: [],
          text: "take a course on ReactJS",
        },
        optionTwo: {
          votes: [],
          text: "take a course on unit testing with Jest",
        },
      },
      expand: true,
      answered: false,
      selectedAnswer: undefined,
      optionOne: { voted: 0, percentage: "0%" },
      optionTwo: { voted: 0, percentage: "0%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText(/Would You Rather/i)).toBeInTheDocument();
    expect(screen.getByText(/take a course on ReactJS/i)).toBeInTheDocument();
    expect(screen.getByText(/take a course on unit testing with Jest/i)).toBeInTheDocument();
  });

  it("displays answered poll with vote results when poll is answered", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: { vthrdm985a262al8qx3do: "optionTwo" },
        questions: [],
      },
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: { vthrdm985a262al8qx3do: "optionOne" },
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
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
      expand: true,
      answered: true,
      selectedAnswer: "optionTwo",
      optionOne: { voted: 1, percentage: "50%" },
      optionTwo: { voted: 1, percentage: "50%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getAllByText(/You voted for:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1 votes \(50%\)/i).length).toBeGreaterThan(0);
  });

  it("shows Vote button for unanswered poll when expanded", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
        id: "test-question",
        author: "omarcisse",
        timestamp: 1489579767190,
        optionOne: { votes: [], text: "option one" },
        optionTwo: { votes: [], text: "option two" },
      },
      expand: true,
      answered: false,
      selectedAnswer: undefined,
      optionOne: { voted: 0, percentage: "0%" },
      optionTwo: { voted: 0, percentage: "0%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText(/Vote/i)).toBeInTheDocument();
  });

  it("opens vote confirmation dialog when Vote button is clicked", async () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
        id: "test-question",
        author: "omarcisse",
        timestamp: 1489579767190,
        optionOne: { votes: [], text: "option one" },
        optionTwo: { votes: [], text: "option two" },
      },
      expand: true,
      answered: false,
      selectedAnswer: undefined,
      optionOne: { voted: 0, percentage: "0%" },
      optionTwo: { voted: 0, percentage: "0%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    // Select an option first (required before voting)
    const optionOneRadio = screen.getByLabelText(/option one\?/i);
    fireEvent.click(optionOneRadio);

    const voteButton = screen.getByText(/Vote/i);
    fireEvent.click(voteButton);

    await waitFor(() => {
      expect(screen.getByText(/Vote Confirmation/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Is this your final vote for this poll/i)).toBeInTheDocument();
  });

  it("displays author information when poll is expanded", () => {
    const users = {
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
        id: "test-question",
        author: "tylermcginnis",
        timestamp: 1489579767190,
        optionOne: { votes: [], text: "option one" },
        optionTwo: { votes: [], text: "option two" },
      },
      expand: true,
      answered: false,
      selectedAnswer: undefined,
      optionOne: { voted: 0, percentage: "0%" },
      optionTwo: { voted: 0, percentage: "0%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText(/By Tyler McGinnis/i)).toBeInTheDocument();
  });

  it("displays first letter avatar when poll is collapsed", () => {
    const users = {
      tylermcginnis: {
        id: "tylermcginnis",
        name: "Tyler McGinnis",
        avatarURL: "/avatars/tyler.png",
        answers: {},
        questions: [],
      },
    };

    const poll: Poll = {
      question: {
        id: "test-question",
        author: "tylermcginnis",
        timestamp: 1489579767190,
        optionOne: { votes: [], text: "option one text" },
        optionTwo: { votes: [], text: "option two" },
      },
      expand: false,
      answered: false,
      selectedAnswer: undefined,
      optionOne: { voted: 0, percentage: "0%" },
      optionTwo: { voted: 0, percentage: "0%" },
    };

    renderWithProviders(<PollDetailsComponent poll={poll} />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText(/Option one text/i)).toBeInTheDocument();
    expect(screen.queryByText(/By Tyler McGinnis/i)).not.toBeInTheDocument();
  });
});