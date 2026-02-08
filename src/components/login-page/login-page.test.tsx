import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { LoginPageComponent } from "./login-page.component";
import { renderWithProviders } from "../../utils/test-utils";
import * as loginAPI from "./loginAPI";

vi.mock("./loginAPI", async () => {
  const actual = await vi.importActual<typeof import("./loginAPI")>("./loginAPI");
  return {
    ...actual,
    getQuestions: vi.fn(),
  };
});

const getQuestionsMock = vi.mocked(loginAPI.getQuestions);

describe("LoginPageComponent", () => {
  beforeEach(() => {
    getQuestionsMock.mockReset();
    getQuestionsMock.mockResolvedValue({
      entities: {},
      status: "idle",
    });
  });

  it("triggers handleLogin when omarcisse is selected and Login button is clicked", async () => {
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

    const { store } = renderWithProviders(<LoginPageComponent />, {
      preloadedState: {
        users: { entities: users, status: "idle" },
        authedUser: { name: "", expiresAt: null, status: "idle" },
      },
    });

    const selectButton = screen.getByRole("combobox");
    fireEvent.mouseDown(selectButton);

    const omarcisseOption = await screen.findByText("Omar Cisse");
    fireEvent.click(omarcisseOption);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(getQuestionsMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(store.getState().authedUser.name).toBe("omarcisse");
    });
  });

  it("sets session to expire after 1 minute when user logs in", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const currentTime = Date.now();
    vi.setSystemTime(currentTime);

    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    const { store } = renderWithProviders(<LoginPageComponent />, {
      preloadedState: {
        users: { entities: users, status: "idle" },
        authedUser: { name: "", expiresAt: null, status: "idle" },
      },
    });

    const selectButton = screen.getByRole("combobox");
    fireEvent.mouseDown(selectButton);

    const omarcisseOption = await screen.findByText("Omar Cisse");
    fireEvent.click(omarcisseOption);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => {
      const state = store.getState();
      expect(state.authedUser.name).toBe("omarcisse");
      expect(state.authedUser.expiresAt).toBeDefined();
      // Allow for small timing variance due to async operations
      expect(state.authedUser.expiresAt).toBeGreaterThanOrEqual(currentTime + 60 * 1000);
      expect(state.authedUser.expiresAt).toBeLessThanOrEqual(currentTime + 60 * 1000 + 1000);
    });

    vi.advanceTimersByTime(60 * 1000);

    const finalState = store.getState();
    expect(Date.now()).toBeGreaterThanOrEqual(finalState.authedUser.expiresAt!);

    vi.useRealTimers();
  });
});