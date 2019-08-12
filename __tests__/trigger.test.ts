import LookEnv from "@mikazuki/lookenv";
import * as trigger from "../src/index";
import { Variables } from "../src/types";

function setup() {
  process.env.ACK_EXCHANGE = "coinz";
  process.env.ACK_ORDER_AMOUNT = "1000";
  process.env.ACK_ORDER_TICKERS = "BTC,ETH,XRP";
  process.env.ACK_COINZ_API_KEY = "*****";
  process.env.ACK_COINZ_API_SECRET = "*****";
}

function cleanup() {
  delete process.env.ACK_EXCHANGE;
  delete process.env.ACK_ORDER_AMOUNT;
  delete process.env.ACK_ORDER_TICKERS;
  delete process.env.ACK_COINZ_API_KEY;
  delete process.env.ACK_COINZ_API_SECRET;
}

describe("trigger#", () => {
  describe("fetchExchange", () => {
    let exchange;

    beforeAll(() => {
      setup();

      exchange = trigger.fetchExchange(new LookEnv<Variables>());
    });

    it("returns IExchange", () => {
      expect(exchange).toBeInstanceOf(Object);
    });
  });

  describe("verifyVariables", () => {
    let isVerified: boolean;
    let env: LookEnv<Variables>;

    beforeAll(() => {
      env = new LookEnv<Variables>();
    });

    describe("all variables are set", () => {
      beforeAll(async () => {
        setup();

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns true", () => {
        expect(isVerified).toBeTruthy();
      });
    });

    describe("ACK_EXCHANGE is not set", () => {
      beforeAll(async () => {
        setup();
        delete process.env.ACK_EXCHANGE;

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_EXCHANGE is invalid value", () => {
      beforeAll(async () => {
        setup();
        process.env.ACK_EXCHANGE = "bitflyer";

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_AMOUNT is not set", () => {
      beforeAll(async () => {
        setup();
        delete process.env.ACK_ORDER_AMOUNT;

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_AMOUNT is not a number", () => {
      beforeAll(async () => {
        setup();
        process.env.ACK_ORDER_AMOUNT = "123hello";

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_TICKERS is not set", () => {
      beforeAll(async () => {
        setup();
        delete process.env.ACK_ORDER_TICKERS;

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_TICKERS includes invalid ticker", () => {
      beforeAll(async () => {
        setup();
        process.env.ACK_ORDER_TICKERS = "BTC,ETH,XRP,ZEC";

        isVerified = await trigger.verifyVariables(env);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });
  });

  describe("calcOrder", () => {
    let order: number;

    describe("amount: 1000, ask: 1221779, limit: {min: 0.0001, max: 25}", () => {
      beforeAll(() => {
        order = trigger.calcOrder(1000, 1221779, { min: 0.0001, max: 25 });
      });

      it("returns 0.0008", () => {
        expect(order).toBe(0.0008);
      });
    });

    describe("amount: 1000, ask: 31434, limit: {min: 0.01, max: 300}", () => {
      beforeAll(() => {
        order = trigger.calcOrder(1000, 31434, { min: 0.01, max: 300 });
      });

      it("returns 0.03", () => {
        expect(order).toBe(0.03);
      });
    });

    describe("amont: 1000, ask: 12836, limit: {min: 0.1, max: 500}", () => {
      beforeAll(() => {
        order = trigger.calcOrder(1000, 12836, { min: 0.1, max: 500 });
      });

      it("returns 0", () => {
        expect(order).toBe(0);
      });
    });

    describe("amount: 10000000, ask: 42.948, limit: { min: 10, max: 100}", () => {
      beforeAll(() => {
        order = trigger.calcOrder(100000, 42.948, { min: 10, max: 100 });
      });

      it("returns 100", () => {
        expect(order).toBe(100);
      });
    });
  });

  afterEach(() => cleanup());
});
