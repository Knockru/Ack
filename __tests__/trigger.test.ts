import * as trigger from "../src/index";

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

      exchange = trigger.fetchExchange();
    });

    it("returns IExchange", () => {
      expect(exchange).toBeInstanceOf(Object);
    });
  });

  describe("verifyVariables", () => {
    let isVerified: boolean;
    describe("all variables are setted", () => {
      beforeAll(() => {
        setup();

        isVerified = trigger.verifyVariables(null);
      });

      it("returns true", () => {
        expect(isVerified).toBeTruthy();
      });
    });

    describe("ACK_EXCHANGE is not set", () => {
      beforeAll(() => {
        setup();
        delete process.env.ACK_EXCHANGE;

        isVerified = trigger.verifyVariables(null);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_EXCHANGE is invalid value", () => {
      beforeAll(() => {
        setup();
        process.env.ACK_EXCHANGE = "bitflyer";

        isVerified = trigger.verifyVariables(null);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_AMOUNT is not set", () => {
      beforeAll(() => {
        setup();
        delete process.env.ACK_ORDER_AMOUNT;

        isVerified = trigger.verifyVariables(null);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_AMOUNT is not a number", () => {
      beforeAll(() => {
        setup();
        process.env.ACK_ORDER_AMOUNT = "123hello";

        isVerified = trigger.verifyVariables(null);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_TICKERS is not set", () => {
      beforeAll(() => {
        setup();
        delete process.env.ACK_ORDER_TICKERS;

        isVerified = trigger.verifyVariables(null);
      });

      it("returns false", () => {
        expect(isVerified).toBeFalsy();
      });
    });

    describe("ACK_ORDER_TICKERS includes invalid ticker", () => {
      beforeAll(() => {
        setup();
        process.env.ACK_ORDER_TICKERS = "BTC,ETH,XRP,ZEC";

        isVerified = trigger.verifyVariables(null);
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
