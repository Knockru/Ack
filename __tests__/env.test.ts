import { FunctionEnv } from "../src/env";

describe("FunctionEnv<T>#", () => {
  let env: FunctionEnv<string>;

  beforeAll(() => {
    env = new FunctionEnv<string>("knockru");
  });

  describe("pascalize", () => {
    let str: string;

    describe("NODE_ENV", () => {
      beforeAll(() => {
        str = env.pascalize("NODE_ENV");
      });

      it("returns NodeEnv", () => {
        expect(str).toBe("NodeEnv");
      });
    });

    describe("NodeEnv", () => {
      beforeAll(() => {
        str = env.pascalize("NodeEnv");
      });

      it("returns NodeEnv", () => {
        expect(str).toBe("NodeEnv");
      });
    });
  });
});
