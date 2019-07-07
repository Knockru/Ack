import { tryParseInt } from "../src/utils";

describe("utils#", () => {
  describe("tryParseInt", () => {
    describe("str is number", () => {
      it("returns {isSuccess: true}", () => {
        const r = tryParseInt("1200");
        expect(r.value).toBe(1200);
        expect(r.isSuccess).toBeTruthy();
      });
    });

    describe("str is string (not a number)", () => {
      it("returns {isSuccess: false}", () => {
        const r = tryParseInt("hello");
        expect(r.value).toBe(0);
        expect(r.isSuccess).toBeFalsy();
      });
    });

    describe("str is number and string", () => {
      it("returns {isSuccess: false}", () => {
        const r = tryParseInt("123hello");
        expect(r.value).toBe(0);
        expect(r.isSuccess).toBeFalsy();
      });
    });
  });
});
