import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithProviders } from "../../utils/test-utils";
import MenuToolbarComponent from "./menu-toolbar.component";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MenuToolbarComponent", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("renders the app title and user information", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<MenuToolbarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    expect(screen.getByText(/Employee Polls/)).toBeInTheDocument();
  });

  it("displays correct page label based on current route", () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<MenuToolbarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
      routerInitialEntries: ["/add"],
    });

    expect(screen.getByText(/Employee Polls - New Poll/)).toBeInTheDocument();
  });

  it("opens menu when menu button is clicked", async () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<MenuToolbarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("New Poll")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("navigates to home when Home menu item is clicked", async () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    renderWithProviders(<MenuToolbarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const homeMenuItem = screen.getByText("Home");
    fireEvent.click(homeMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("logs out and navigates to login when Logout menu item is clicked", async () => {
    const users = {
      omarcisse: {
        id: "omarcisse",
        name: "Omar Cisse",
        avatarURL: "/avatars/omarcisse.png",
        answers: {},
        questions: [],
      },
    };

    const { store } = renderWithProviders(<MenuToolbarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: users, status: "idle" },
      },
    });

    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const logoutMenuItem = screen.getByText("Logout");
    fireEvent.click(logoutMenuItem);

    expect(store.getState().authedUser.name).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});