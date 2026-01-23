import { render } from "@testing-library/react";
import { Avatar } from "@mui/material";
import { vi } from "vitest";
import CircularTextComponent from "./circular-text.component";

describe("CircularTextComponent", () => {
  it("matches snapshot", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.123456789);

    try {
      const fullName = "Sarah Edo";
      const avatarSrc = "/avatars/sarah.png";

      const { asFragment } = render(
        <CircularTextComponent
          text={fullName}
          radius={40}
          fontSize={12}
          color="var(--AppBar-color)"
        >
          <Avatar alt={fullName} src={avatarSrc || undefined}></Avatar>
        </CircularTextComponent>,
      );

      expect(asFragment()).toMatchSnapshot();
    } finally {
      randomSpy.mockRestore();
    }
  });
});