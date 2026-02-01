import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import { NewPollComponent } from "./new-poll.component";
import * as dataAPI from "../../data/data";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NewPollComponent", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  it("renders form with two text fields and submit button", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        },
      },
    );

    expect(screen.getByLabelText(/Option One/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Option Two/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("disables submit button when authedUser is not present", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "", expiresAt: null, status: "idle" },
        },
      },
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when option one is empty", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        },
      },
    );

    const optionTwo = screen.getByLabelText(/Option Two/i);
    fireEvent.change(optionTwo, { target: { value: "Second option" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when option two is empty", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        },
      },
    );

    const optionOne = screen.getByLabelText(/Option One/i);
    fireEvent.change(optionOne, { target: { value: "First option" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when both options are filled", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        },
      },
    );

    const optionOne = screen.getByLabelText(/Option One/i);
    const optionTwo = screen.getByLabelText(/Option Two/i);

    fireEvent.change(optionOne, { target: { value: "First option" } });
    fireEvent.change(optionTwo, { target: { value: "Second option" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it("updates input values when typing", () => {
    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        },
      },
    );

    const optionOne = screen.getByLabelText(/Option One/i) as HTMLInputElement;
    const optionTwo = screen.getByLabelText(/Option Two/i) as HTMLInputElement;

    fireEvent.change(optionOne, { target: { value: "Build with React" } });
    fireEvent.change(optionTwo, { target: { value: "Build with Vue" } });

    expect(optionOne.value).toBe("Build with React");
    expect(optionTwo.value).toBe("Build with Vue");
  });

  it("submits form and navigates to home on successful submission", async () => {
    vi.spyOn(dataAPI, "_saveQuestion").mockResolvedValue({
      id: "new-question-id",
      author: "omarcisse",
      timestamp: Date.now(),
      optionOne: { votes: [], text: "First option" },
      optionTwo: { votes: [], text: "Second option" },
    });

    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
          questions: { entities: {}, status: "idle" },
        },
      },
    );

    const optionOne = screen.getByLabelText(/Option One/i);
    const optionTwo = screen.getByLabelText(/Option Two/i);

    fireEvent.change(optionOne, { target: { value: "First option" } });
    fireEvent.change(optionTwo, { target: { value: "Second option" } });

    const form = screen.getByRole("button", { name: /submit/i }).closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("trims whitespace from options before submission", async () => {
    const saveQuestionSpy = vi.spyOn(dataAPI, "_saveQuestion").mockResolvedValue({
      id: "new-question-id",
      author: "omarcisse",
      timestamp: Date.now(),
      optionOne: { votes: [], text: "First option" },
      optionTwo: { votes: [], text: "Second option" },
    });

    renderWithProviders(
      <MemoryRouter>
        <NewPollComponent />
      </MemoryRouter>,
      {
        preloadedState: {
          authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
          questions: { entities: {}, status: "idle" },
        },
      },
    );

    const optionOne = screen.getByLabelText(/Option One/i);
    const optionTwo = screen.getByLabelText(/Option Two/i);

    fireEvent.change(optionOne, { target: { value: "  First option  " } });
    fireEvent.change(optionTwo, { target: { value: "  Second option  " } });

    const form = screen.getByRole("button", { name: /submit/i }).closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(saveQuestionSpy).toHaveBeenCalledWith({
        optionOneText: "First option",
        optionTwoText: "Second option",
        author: "omarcisse",
      });
    });
  });
});