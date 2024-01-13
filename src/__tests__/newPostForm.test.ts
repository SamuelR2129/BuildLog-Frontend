import { removeDollarSign } from "~/components/feed/newPostFormUtils";

describe("removeDollarSign", () => {
  it("should remove the dollar sign from a string", () => {
    expect(removeDollarSign("$10.00")).toBe("10.00");
    expect(removeDollarSign("20.50$")).toBe("20.50");
  });

  it("should not remove the dollar sign from a string that does not contain one", () => {
    expect(removeDollarSign("10.00")).toBe("10.00");
    expect(removeDollarSign("20.50")).toBe("20.50");
  });
});
