import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "../../app/store";
import { LeaderBoardComponent } from "./leader-board.component";

describe("LeaderBoardComponent", () => {
  it("", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <LeaderBoardComponent />
      </Provider>,
    );
  });
});