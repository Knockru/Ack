import { createHmac } from "crypto";
import * as got from "got";

import { KeyValuePair } from "../types";
import { Balance, IExchange, Order } from "./exchange";

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

export class CoinZ implements IExchange {
  public id = "coinz";
  public tickers = ["BTC", "ETH", "BCH", "LTC", "XRP"];
  public variables = ["API_KEY", "API_SECRET"];

  private host = "https://api.coin.z.com";
  private key: string;
  private secret: string;

  public initialize(): void {
    this.key = process.env.ACK_COINZ_API_KEY;
    this.secret = process.env.ACK_COINZ_API_SECRET;
  }

  public async fetchBalance(): Promise<Balance> {
    const response = await this.get<Asset[]>("/private/v1/account/assets");
    const balances: Balance = {};
    response.data.forEach(w => {
      balances[w.symbol] = parseFloat(w.amount);
    });

    return balances;
  }

  private async get<T>(path: string): Promise<Response<T>> {
    const headers = this.createHeaders("GET", path);
    const response = await got.get(path, { baseUrl: this.host, headers });
    return JSON.parse(response.body) as Response<T>;
  }

  private async post<T>(path: string, body: any = null): Promise<Response<T>> {
    const headers = this.createHeaders("POST", path, body);
    const response = await got.post(path, { baseUrl: this.host, headers, body });
    return JSON.parse(response.body) as Response<T>;
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
