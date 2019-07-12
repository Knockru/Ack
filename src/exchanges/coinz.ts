import { createHmac } from "crypto";
import * as got from "got";

import { KeyValuePair } from "../types";
import { sleep } from "../utils";
import { Balance, IExchange, Order, OrderLimit, Tickers } from "./exchange";

type Response<T> = {
  status: number;
  data: T;
  responseTime: Date;
};

type Asset = {
  amount: string;
  available: string;
  conversionRate: string;
  symbol: string;
};

type Ticker = {
  ask: string;
  bid: string;
  high: string;
  low: string;
  symbol: string;
  timestamp: string;
  volume: string;
};

export class CoinZ implements IExchange {
  public id = "coinz";
  public name = "GMO CoinZ";
  public limits: OrderLimit = {
    BTC: { min: 0.0001, max: 25 },
    ETH: { min: 0.01, max: 300 },
    BCH: { min: 0.01, max: 300 },
    LTC: { min: 0.1, max: 500 },
    XRP: { min: 1, max: 300000 }
  };
  public tickers = ["BTC", "ETH", "BCH", "LTC", "XRP"];
  public variables = ["API_KEY", "API_SECRET"];

  private host = "https://api.coin.z.com";
  private key: string;
  private secret: string;
  private lastCallAt: number;

  public initialize(): void {
    this.key = process.env.ACK_COINZ_API_KEY;
    this.secret = process.env.ACK_COINZ_API_SECRET;
    this.lastCallAt = Date.parse("1970/01/01 00:00:00");
  }

  public async fetchBalance(): Promise<Balance> {
    const response = await this.get<Asset[]>("/private/v1/account/assets");
    const balances: Balance = {};
    response.data.forEach(w => {
      balances[w.symbol] = parseFloat(w.amount);
    });

    return balances;
  }

  public async fetchTickers(): Promise<Tickers> {
    const response = await this.get<Ticker[]>("/public/v1/ticker");
    const tickers: Tickers = {};
    response.data.forEach(w => {
      tickers[w.symbol] = {
        ask: parseFloat(w.ask),
        bid: parseFloat(w.bid)
      };
    });

    return tickers;
  }

  public async makeBuyMarketOrder(symbol: string, size: number): Promise<Order> {
    const params = { size, symbol, side: "BUY", executionType: "MARKET" };

    const orderResp = await this.post<string>("/private/v1/order", params);
    if (orderResp.status != 0) return null;

    const order = await this.get<Order>(`/private/v1/orders?orderId=${orderResp.data}`);
    return order.data;
  }

  private async get<T>(path: string): Promise<Response<T>> {
    await this.waitForRateLimits();

    const headers = this.createHeaders("GET", path);
    const response = await got.get(path, { baseUrl: this.host, headers });
    return JSON.parse(response.body) as Response<T>;
  }

  private async post<T>(path: string, body: any = null): Promise<Response<T>> {
    await this.waitForRateLimits();

    const headers = this.createHeaders("POST", path, body);
    const response = await got.post(path, { baseUrl: this.host, headers, body });
    return JSON.parse(response.body) as Response<T>;
  }

  // GMO CoinZ has API rate-limits : private API can called up to 1 time in 300ms
  private async waitForRateLimits(): Promise<void> {
    if (this.lastCallAt + 300 <= Date.now()) {
      this.lastCallAt = Date.now();
      return;
    }

    await sleep(300);
    this.lastCallAt = Date.now();
  }

  private createHeaders(method: string, path: string, body: any = null): KeyValuePair<string> {
    if (!path.includes("private")) return {};

    const timestamp = Date.now().toString();
    const message = `${timestamp}${method}${path.substring("/private".length)}${body ? JSON.stringify(body) : ""}`;
    const sign = createHmac("sha256", this.secret)
      .update(message)
      .digest("hex");

    return {
      "API-KEY": this.key,
      "API-TIMESTAMP": timestamp,
      "API-SIGN": sign
    };
  }
}
