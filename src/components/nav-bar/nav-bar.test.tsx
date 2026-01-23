import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import { NavBarComponent } from "./nav-bar.component";

describe("NavBarComponent", () => {
  it("renders logout button", () => {
    renderWithProviders(<NavBarComponent />);
    
    const logoutButton = screen.getByRole("button", { name: /log out/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("dispatches logout action when logout button is clicked", () => {
    const { store } = renderWithProviders(<NavBarComponent />, {
      preloadedState: {
        authedUser: { name: "omarcisse", expiresAt: Date.now() + 60_000, status: "idle" },
      },
    });

    const logoutButton = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutButton);

    expect(store.getState().authedUser.name).toBeNull();
    expect(store.getState().authedUser.expiresAt).toBeNull();
  });
});