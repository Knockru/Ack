import { IExchange } from "./exchange";

export class CoinZ implements IExchange {
  public id = "coinz";
  public tickers = ["BTC", "ETH", "BCH", "LTC", "XRP"];
  public variables = ["API_KEY", "API_SECRET"];
}
