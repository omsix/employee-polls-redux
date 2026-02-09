import { screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import App from "./App"
import { renderWithProviders } from "./utils/test-utils"

import { getUsers } from "./components/login-page/loginAPI"

vi.mock("./components/login-page/loginAPI", async () => {
  const actual = await vi.importActual<typeof import("./components/login-page/loginAPI")>(
    "./components/login-page/loginAPI",
  )
  return {
    ...actual,
    getUsers: vi.fn(),
  }
})

const getUsersMock = vi.mocked(getUsers)

describe("App", () => {
  beforeEach(() => {
    localStorage.clear()
    getUsersMock.mockReset()
    getUsersMock.mockResolvedValue({ entities: {}, status: "idle" })
  })

  test("Logged out: renders the login page", async () => {
    renderWithProviders(<App />, {
      preloadedState: {
        authedUser: { name: "", expiresAt: null, status: "idle" },
      },
    })

    expect(await screen.findByText(/welcome to employee polls/i)).toBeInTheDocument()
  })

  test("Logged in: renders the menu toolbar and app shell", async () => {
    localStorage.setItem("authedUser", "sarahedo")

    renderWithProviders(<App />, {
      preloadedState: {
        authedUser: { name: "sarahedo", expiresAt: Date.now() + 60_000, status: "idle" },
        users: { entities: {}, status: "idle" },
        questions: { entities: {}, status: "idle" },
      },
    })

    expect(await screen.findByText(/employee polls/i)).toBeInTheDocument()
  })

  test("Loads users on mount (calls getUsers and dispatches receiveUsers)", async () => {
    getUsersMock.mockResolvedValue({
      entities: {
        sarahedo: {
          id: "sarahedo",
          name: "Sarah Edo",
          avatarURL: "",
          answers: {},
          questions: [],
        },
      },
      status: "idle",
    })

    const { store } = renderWithProviders(<App />, {
      preloadedState: {
        authedUser: { name: "", expiresAt: null, status: "idle" },
      },
    })

    await waitFor(() => {
      expect(getUsersMock).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(store.getState().users.entities["sarahedo"]?.name).toBe("Sarah Edo")
    })
  })

  test("Expired session: dispatches logout and shows login page", async () => {
    localStorage.setItem("authedUser", "sarahedo")

    const { store } = renderWithProviders(<App />, {
      preloadedState: {
        authedUser: { name: "sarahedo", expiresAt: Date.now() - 1, status: "idle" },
      },
    })

    await waitFor(() => {
      expect(store.getState().authedUser.name).toBeNull()
    })

    expect(await screen.findByText(/welcome to employee polls/i)).toBeInTheDocument()
  })

  test("Non-expired session: does not logout", async () => {
    localStorage.setItem("authedUser", "sarahedo")

    const { store } = renderWithProviders(<App />, {
      preloadedState: {
        authedUser: { name: "sarahedo", expiresAt: Date.now() + 60_000, status: "idle" },
      },
    })

    await waitFor(() => {
      expect(store.getState().authedUser.name).toBe("sarahedo")
    })
  })
})